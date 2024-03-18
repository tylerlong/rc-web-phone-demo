import React from 'react';
import { Input, Typography, Form } from 'antd';
import { auto } from 'manate/react';

import type { Store } from './store';

const { Text, Title } = Typography;

const Login = (props: { store: Store }) => {
  const { store } = props;
  const render = () => (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
      <Form.Item label="Client ID">
        <Input
          onChange={(e) => {
            store.clientId = e.target.value;
          }}
          value={store.clientId}
        ></Input>
      </Form.Item>
      <Form.Item label="Client Secret">
        <Input.Password
          onChange={(e) => {
            store.clientSecret = e.target.value;
          }}
          value={store.clientSecret}
        ></Input.Password>
      </Form.Item>
    </Form>
  );
  return auto(render, props);
};

const Phone = (props: { store: Store }) => {
  const { store } = props;
  const render = () => <>Phone here</>;
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
