import React from 'react';
import { Alert, Text } from 'react-native';
import { Button, Card, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { user, signOutUser } = useAuth();

  return (
    <Screen>
      <Card title="Account">
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Role: {user?.role}</Text>
      </Card>

      <Card title="System Controls">
        <Text>Use server-side retention function for audit cleanup after 365 days.</Text>
        <Button title="Sign Out" onPress={() => signOutUser().catch(() => Alert.alert('Unable to sign out'))} />
      </Card>
    </Screen>
  );
}
