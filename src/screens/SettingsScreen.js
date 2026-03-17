import React, { useState } from 'react';
import { Alert, Text } from 'react-native';
import { Button, Card, FormModal, Input, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function SettingsScreen() {
  const { user, signOutUser, setRole } = useAuth();
  const { settings, updateSettings, resetAllData } = useData();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ ...settings, forceUnsafePricing: String(settings.forceUnsafePricing) });

  return (
    <Screen scroll>
      <Card title="Account">
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Role: {user?.role}</Text>
        <Button title="Switch to Admin" compact onPress={() => setRole('admin')} />
        <Button title="Switch to Manager" compact variant="secondary" onPress={() => setRole('manager')} />
        <Button title="Switch to Viewer" compact variant="ghost" onPress={() => setRole('viewer')} />
      </Card>
      <Card title="System Settings">
        <Text>Company: {settings.companyName}</Text>
        <Text>Currency: {settings.currency}</Text>
        <Text>Market Region: {settings.marketRegion}</Text>
        <Text>Force unsafe pricing: {String(settings.forceUnsafePricing)}</Text>
        <Button title="Edit Settings" onPress={() => setVisible(true)} />
      </Card>
      <Card title="Maintenance">
        <Button title="Reset Demo Data" variant="danger" onPress={() => Alert.alert('Reset all local data?', 'This will restore the starter dataset.', [{ text: 'Cancel' }, { text: 'Reset', style: 'destructive', onPress: resetAllData }])} />
        <Button title="Sign Out" variant="ghost" onPress={() => signOutUser().catch(() => {})} />
      </Card>
      <FormModal visible={visible} onClose={() => setVisible(false)} title="Edit Settings">
        {['companyName','currency','marketRegion','forceUnsafePricing'].map((k) => <Input key={k} label={k} value={form[k]} onChangeText={(v)=>setForm((p)=>({ ...p,[k]:v }))} />)}
        <Button title="Save Settings" onPress={() => { updateSettings({ ...form, forceUnsafePricing: form.forceUnsafePricing === 'true' }); setVisible(false); }} />
      </FormModal>
    </Screen>
  );
}
