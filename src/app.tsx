import React from 'react';
import { Input, Typography, Form, Button, Divider } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './store';

const { Title, Text } = Typography;

const Login = (props: { store: Store }) => {
  const { store } = props;
  const render = () => (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
      <Form.Item label="Client ID" required>
        <Input
          onChange={(e) => {
            store.clientId = e.target.value;
          }}
          value={store.clientId}
        ></Input>
      </Form.Item>
      <Form.Item label="Client Secret" required>
        <Input.Password
          onChange={(e) => {
            store.clientSecret = e.target.value;
          }}
          value={store.clientSecret}
        ></Input.Password>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={() => store.authCodeFlow()}>
          Auth Code Flow
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Text type="secondary">
          Note: Set the app's redirect URI to {window.location.origin + window.location.pathname}
          callback.html
        </Text>
      </Form.Item>
      <Divider>OR</Divider>
      <Form.Item label="JWT Token" required>
        <Input.Password
          onChange={(e) => {
            store.jwtToken = e.target.value;
          }}
          value={store.jwtToken}
        ></Input.Password>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={() => store.jwtFlow()}>
          Personal JWT Flow
        </Button>
      </Form.Item>
    </Form>
  );
  return auto(render, props);
};

const Phone = (props: { store: Store }) => {
  const { store } = props;
  const render = () => <Button onClick={() => store.logout()}>Log out</Button>;
  return auto(render, props);
};

const App = (props: { store: Store }) => {
  const { store } = props;
  const render = () => (
    <>
      <Title>RingCentral Web Phone Demo</Title>
      {store.rcToken === '' ? <Login store={store} /> : <Phone store={store} />}
    </>
  );
  return auto(render, props);
};

export default App;
