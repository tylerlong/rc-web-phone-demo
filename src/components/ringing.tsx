import { auto } from 'manate/react';
import React from 'react';
import { Alert, Button, Space } from 'antd';

import type { CallSession } from '../models/call-session';

const Ringing = auto((props: { session: CallSession }) => {
  const { session } = props;
  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Alert
        type="warning"
        message={`Incoming call from ${session.raw.remoteIdentity.displayName} ${session.raw.remoteIdentity.uri.user}`}
      />
      <Button type="primary" onClick={() => session.accept()} block>
        Answer
      </Button>
      <Button type="primary" danger onClick={() => session.decline()} block>
        Decline
      </Button>
      <Button onClick={() => session.toVoicemail()} block>
        To Voicemail
      </Button>
    </Space>
  );
});

export default Ringing;
