import React from 'react';
import { Button, Space } from 'antd';
import { auto } from 'manate/react';
import { SessionState } from 'sip.js';

import type { Store } from '../models/store';
import Idle from './idle';
import Ringing from './ringing';
import Talking from './talking';

const Phone = auto((props: { store: Store }) => {
  const { store } = props;
  return (
    <>
      <Button id="logout-btn" onClick={() => store.logout()}>
        Log out
      </Button>
      <Space direction="vertical" style={{ display: 'flex' }}>
        {store.sessions.map((session) => {
          if ((session as any).direction === 'inbound' && session.state === SessionState.Initial) {
            return <Ringing key={session.callId} session={session} />;
          }
          return <Talking key={session.callId} session={session} />;
        })}
        {store.sessions.length === 0 && <Idle store={store} />}
      </Space>
    </>
  );
});

export default Phone;
