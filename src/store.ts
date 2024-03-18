import { autoRun, manage } from 'manate';
import RingCentral from '@rc-ex/core';
import localForage from 'localforage';

export class Store {
  public rcToken = '';
  public refreshToken = '';
  public clientId = '';
  public clientSecret = '';
  public jwtToken = '';
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

  // validate saved token
  if (store.rcToken === '') {
    return;
  }
  const rc = new RingCentral({
    server: 'https://platform.ringcentral.com',
  });
  rc.token = { access_token: store.rcToken, refresh_token: store.refreshToken };
  try {
    await rc.restapi().account().extension().get();
  } catch (e) {
    try {
      await rc.refresh();
    } catch (e) {
      store.rcToken = '';
      store.refreshToken = '';
    }
  }
};
main();

export default store;
