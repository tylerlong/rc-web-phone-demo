import type { WebPhoneInvitation } from 'ringcentral-web-phone/lib/src/session';
import type { SessionState } from 'sip.js';

export class CallSession {
  public callId: string;
  public state: SessionState;
  public direction: string;

  public constructor(session: WebPhoneInvitation) {
    this.callId = session.request.callId;
    this.state = session.state;
    this.direction = (session as any).direction;
  }

  public get raw(): WebPhoneInvitation {
    return global.sessions.find((s) => s.request.callId === this.callId) as WebPhoneInvitation;
  }

  public async accept() {
    this.raw.accept();
  }

  public async dispose() {
    this.raw.dispose();
  }

  public async decline() {
    this.raw.decline!();
  }

  public async toVoicemail() {
    this.raw.toVoicemail!();
  }
}

export default CallSession;
