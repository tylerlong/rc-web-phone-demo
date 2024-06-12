import React from 'react';
import { Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './store';
import Login from './components/login';
import Phone from './components/phone';

const App = (props: { store: Store }) => {
  const { store } = props;
  const render = () => (
    <>
      <Typography.Title>RingCentral Web Phone React.js Demo</Typography.Title>
      {store.rcToken === '' ? <Login store={store} /> : <Phone store={store} />}
    </>
  );
  return auto(render, props);
};

export default App;
