import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card, Input, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('admin@clothingos.com');
  const [password, setPassword] = useState('password');

  return (
    <Screen>
      <Card title="Myanmar Clothing OS">
        <Text>Use admin, manager, staff, or viewer in the email to simulate roles.</Text>
        <Input label="Email" value={email} onChangeText={setEmail} />
        <Input label="Password" value={password} onChangeText={setPassword} />
        <Button title={loading ? 'Signing In...' : 'Sign In'} onPress={() => signIn(email, password)} />
      </Card>
    </Screen>
  );
}
