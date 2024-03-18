import { autoRun, manage } from 'manate';
import RingCentral from '@rc-ex/core';
import localForage from 'localforage';
import { message } from 'antd';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';
import type { WebPhoneRegistrationData } from 'ringcentral-web-phone';
import WebPhone from 'ringcentral-web-phone';

import incomingAudio from 'url:./audio/incoming.ogg';
import outgoingAudio from 'url:./audio/outgoing.ogg';

export class Store {
  public rcToken = '';
  public refreshToken = '';
  public clientId = '';
  public clientSecret = '';
  public jwtToken = '';

  public async logout() {
    const rc = new RingCentral({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    rc.token = { access_token: this.rcToken, refresh_token: this.refreshToken };
    await rc.revoke();
    this.rcToken = '';
    this.refreshToken = '';
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
      }
    });
  }
}

const store = manage(new Store());

const main = async () => {
  store.rcToken = (await localForage.getItem('rcToken')) ?? '';
  store.refreshToken = (await localForage.getItem('refreshToken')) ?? '';
  store.clientId = (await localForage.getItem('clientId')) ?? '';
  store.clientSecret = (await localForage.getItem('clientSecret')) ?? '';
  store.jwtToken = (await localForage.getItem('jwtToken')) ?? '';

  // auto save things to local
  const { start } = autoRun(store, () => {
    localForage.setItem('rcToken', store.rcToken);
    localForage.setItem('refreshToken', store.refreshToken);
    localForage.setItem('clientId', store.clientId);
    localForage.setItem('clientSecret', store.clientSecret);
    localForage.setItem('jwtToken', store.jwtToken);
  });
  start();

  const refreshToken = async () => {
    if (store.rcToken !== '') {
      const rc = new RingCentral({
        clientId: store.clientId,
        clientSecret: store.clientSecret,
      });
      rc.token = { access_token: store.rcToken, refresh_token: store.refreshToken };
      try {
        await rc.refresh();
        store.rcToken = rc.token!.access_token!;
        store.refreshToken = rc.token!.refresh_token!;
      } catch (e) {
        store.rcToken = '';
        store.refreshToken = '';
      }
    }
  };
  await refreshToken();
  setInterval(() => refreshToken(), 30 * 60 * 1000);

  if (store.rcToken === '') {
    return;
  }

  const rc = new RingCentral();
  rc.token = { access_token: store.rcToken, refresh_token: store.refreshToken };
  const data = (await rc
    .restapi()
    .clientInfo()
    .sipProvision()
    .post({
      sipInfo: [{ transport: 'WSS' }],
    })) as WebPhoneRegistrationData;
  const webPhone = new WebPhone(data, {
    enableDscp: true,
    clientId: localStorage.getItem('webPhoneclientId')!,
    audioHelper: {
      enabled: true,
      incoming: incomingAudio,
      outgoing: outgoingAudio,
    },
    logLevel: 3,
    appName: 'WebPhoneDemo',
    appVersion: '1.0.0',
    media: {
      remote: document.getElementById('remoteVideo') as HTMLVideoElement,
      local: document.getElementById('localVideo') as HTMLVideoElement,
    },
    enableQos: true,
    enableMediaReportLogging: true,
  });
  global.webPhone = webPhone;

  // incoming call
  webPhone.userAgent.on('invite', () => {
    console.log('incoming call');
  });
};
main();

export default store;
