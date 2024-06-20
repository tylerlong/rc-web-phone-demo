import RingCentral from '@rc-ex/core';
import type { WebPhoneRegistrationData } from 'ringcentral-web-phone';
import WebPhone from 'ringcentral-web-phone';
import type { WebPhoneInvitation } from 'ringcentral-web-phone/lib/src/session';

import store from '../store';
import incomingAudio from 'url:../audio/incoming.ogg';
import outgoingAudio from 'url:../audio/outgoing.ogg';

const afterLogin = async () => {
  if (store.rcToken === '') {
    return;
  }
  const rc = new RingCentral();
  rc.token = { access_token: store.rcToken, refresh_token: store.refreshToken };

  // fetch extension and phone number info
  store.extInfo = await rc.restapi().account().extension().get();
  const numberList = await rc.restapi().account().extension().phoneNumber().get();
  store.primaryNumber = numberList.records?.find((n) => n.primary)?.phoneNumber ?? '';

  // create web phone
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
    logLevel: 0,
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

  global.sessions = [];

  // incoming call
  webPhone.userAgent.on('invite', (session: WebPhoneInvitation) => {
    (session as any).direction = 'inbound';
    store.addSession(session);
  });
};

export default afterLogin;
