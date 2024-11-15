import React from 'react';
import { Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './models/store';
import Login from './components/login';
import Phone from './components/phone';

const App = auto((props: { store: Store }) => {
  const { store } = props;
  return (
    <>
      <Typography.Title>RingCentral Web Phone React.js Demo</Typography.Title>
      {store.rcToken === '' ? <Login store={store} /> : <Phone store={store} />}
    </>
  );
});

export default App;
