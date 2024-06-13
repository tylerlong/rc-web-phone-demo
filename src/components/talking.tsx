import { Alert, Button, Space } from 'antd';
import { auto } from 'manate/react';
import React from 'react';

import type { CallSession } from '../models/call-session';

const Talking = (props: { session: CallSession }) => {
  const { session } = props;
  const render = () => {
    return (
      <Space>
        <Alert
          type="success"
          message={`You are talking to ${session.raw.remoteIdentity.displayName} ${session.raw.remoteIdentity.uri.user}`}
        />
        <Button onClick={() => session.dispose()} danger>
          Hang up
        </Button>
      </Space>
    );
  };
  return auto(render, props);
};

export default Talking;
