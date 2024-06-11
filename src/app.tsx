import React from 'react';
import { Input, Typography, Form, Button, Divider, Space, Alert } from 'antd';
import { auto } from 'manate/react';
import { SessionState } from 'sip.js';

import type { Store, CallSession } from './store';

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
  const render = () => (
    <>
      <Button id="logout-btn" onClick={() => store.logout()}>
        Log out
      </Button>
      <Space direction="vertical" style={{ display: 'flex' }}>
        {store.sessions.map((session) => {
          if (session.state === SessionState.Initial) {
            return <Ringing key={session.callId} session={session} />;
          }
          return <Talking key={session.callId} session={session} />;
        })}
        {store.sessions.length === 0 && <Dialpad />}
      </Space>
    </>
  );
  return auto(render, props);
};

const Dialpad = (props) => {
  const render = () => {
    return (
      <Space>
        <Input placeholder="16501234567" />
        <Button type="primary">Call</Button>
      </Space>
    );
  };
  return auto(render, props);
};

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
