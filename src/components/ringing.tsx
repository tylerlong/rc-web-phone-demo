import { auto } from 'manate/react';
import React from 'react';
import { Alert, Button, Space } from 'antd';

import type { CallSession } from '../store';

const Ringing = (props: { session: CallSession }) => {
  const { session } = props;
  const render = () => {
    return (
      <Space>
        <Alert
          type="warning"
          message={`Incoming call from ${session.raw.remoteIdentity.displayName} ${session.raw.remoteIdentity.uri.user}`}
        />
        <Button type="primary" onClick={() => session.accept()}>
          Answer
        </Button>
      </Space>
    );
  };
  return auto(render, props);
};

export default Ringing;
