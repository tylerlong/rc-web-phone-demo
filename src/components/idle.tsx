import React from 'react';
import { Button, Divider, Input, Space, Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from '../models/store';

const Idle = (props: { store: Store }) => {
  const { store } = props;
  const [callee, setCallee] = React.useState<string>('');
  const render = () => {
    return (
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Divider>Inbound Call</Divider>
        <Typography.Text>
          Logged in as{' '}
          <strong>
            {store.extInfo?.contact?.firstName} {store.extInfo?.contact?.lastName}
          </strong>
          . You may dial <strong>{store.primaryNumber}</strong> to reach this web phone.
        </Typography.Text>
        <Divider>Outbound Call</Divider>
        <Space>
          <Input placeholder="16501234567" onChange={(e) => setCallee(e.target.value.trim())} value={callee} />
          <Button
            type="primary"
            onClick={() => {
              store.call(callee);
            }}
            disabled={callee.trim().length < 3}
          >
            Call
          </Button>
        </Space>
      </Space>
    );
  };
  return auto(render, props);
};

export default Idle;
