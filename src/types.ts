import type { SessionState } from 'sip.js';

export interface CallSession {
  callId: string;
  state: SessionState;
}
