import type GetExtensionInfoResponse from '@rc-ex/core/lib/definitions/GetExtensionInfoResponse';
import RingCentral from '@rc-ex/core';
import { message } from 'antd';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';
import type { WebPhoneInvitation } from 'ringcentral-web-phone/lib/src/session';
import { SessionState } from 'sip.js';
import type WebPhone from 'ringcentral-web-phone';

import afterLogin from '../actions/after-login';
import CallSession from './call-session';

export class Store {
  public rcToken = '';
  public refreshToken = '';
  public clientId = '';
  public clientSecret = '';
  public jwtToken = '';
  public extInfo: GetExtensionInfoResponse;
  public primaryNumber = '';

  public sessions: CallSession[] = [];

  public async logout() {
    const rc = new RingCentral({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    rc.token = { access_token: this.rcToken, refresh_token: this.refreshToken };
    await rc.revoke();
    this.rcToken = '';
    this.refreshToken = '';
    location.reload();
  }

  public async jwtFlow() {
    if (this.clientId === '' || this.clientSecret === '' || this.jwtToken === '') {
      message.error('Please input client ID, client secret and JWT token');
      return;
    }
    const rc = new RingCentral({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    try {
      const token = await rc.authorize({ jwt: this.jwtToken });
      this.rcToken = token.access_token!;
      this.refreshToken = token.refresh_token!;
      afterLogin();
    } catch (e) {
      message.open({ duration: 10, type: 'error', content: e.message });
    }
  }

  public async authCodeFlow() {
    if (this.clientId === '' || this.clientSecret === '') {
      message.error('Please input client ID and client secret');
      return;
    }
    const rc = new RingCentral({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    const authorizeUriExtension = new AuthorizeUriExtension();
    await rc.installExtension(authorizeUriExtension);
    const authorizeUri = authorizeUriExtension.buildUri({
      redirect_uri: window.location.origin + window.location.pathname + 'callback.html',
    });
    window.open(
      authorizeUri,
      'popupWindow',
      `width=600,height=600,left=${window.screenX + 256},top=${window.screenY + 128}`,
    )!;
    window.addEventListener('message', async (event) => {
      if (event.data.source === 'oauth-callback') {
        const token = await rc.authorize({
          code: event.data.code,
          redirect_uri: window.location.origin + window.location.pathname + 'callback.html',
        });
        this.rcToken = token.access_token!;
        this.refreshToken = token.refresh_token!;
        afterLogin();
      }
    });
  }

  public addSession(session: WebPhoneInvitation) {
    console.log('addSession', session);
    global.sessions.push(session);
    this.sessions.push(new CallSession(session));
    const callSession = this.sessions[this.sessions.length - 1];
    const listener = (newState: SessionState) => {
      console.log(newState);
      callSession.state = newState;
      if (newState === SessionState.Terminated) {
        session.stateChange.removeListener(listener);
        global.sessions = global.sessions.filter((s) => s.request.callId !== session.request.callId);
        this.sessions = this.sessions.filter((s) => s.callId !== session.request.callId);
      }
    };
    session.stateChange.addListener(listener);
  }

  public call(callee: string) {
    const webPhone = global.webPhone as WebPhone;
    const session = webPhone.userAgent.invite(callee, { fromNumber: this.primaryNumber });
    (session as any).direction = 'outbound';
    this.addSession(session as any);
  }
}

export default Store;
