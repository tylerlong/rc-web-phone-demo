import React from 'react';
import { Button, Divider, Input, Space, Typography } from 'antd';

import type { Store } from '../store';
import { auto } from 'manate/react';

const Idle = (props: { store: Store }) => {
  const { store } = props;
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
          <Input placeholder="16501234567" />
          <Button type="primary">Call</Button>
        </Space>
      </Space>
    );
  };
  return auto(render, props);
};

export default Idle;
