import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card, FormModal, Input, Row, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatMMK, percent } from '../utils/format';

const base = { name: '', shares: '0', capital: '0' };

export default function ShareholdersScreen() {
  const { user } = useAuth();
  const { shareholders, createItem, updateItem, deleteItem } = useData();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(base);
  const canWrite = user?.role === 'admin' || user?.role === 'manager';
  const save = () => { editing ? updateItem('shareholders', editing.id, form) : createItem('shareholders', form); setVisible(false); };

  return (
    <Screen scroll>
      <Card title="Shareholders" right={canWrite ? <Button title="Add Shareholder" compact onPress={() => { setEditing(null); setForm(base); setVisible(true); }} /> : null}>
        <Text>Editable ownership %, capital, and dividend projection records.</Text>
      </Card>
      {shareholders.map((sh) => (
        <Card key={sh.id} title={sh.name}>
          <Text>Shares: {sh.shares} · Ownership: {percent(sh.ownership)}</Text>
          <Text>Capital: {formatMMK(sh.capital)} · Dividend projection: {formatMMK(sh.dividendProjection)}</Text>
          {canWrite ? <Row><Button title="Edit" compact onPress={() => { setEditing(sh); setForm(Object.fromEntries(Object.entries({ ...base, ...sh }).map(([k,v])=>[k,String(v)]))); setVisible(true); }} /><Button title="Delete" compact variant="danger" onPress={() => deleteItem('shareholders', sh.id)} /></Row> : null}
        </Card>
      ))}
      <FormModal visible={visible} onClose={() => setVisible(false)} title={editing ? 'Edit Shareholder' : 'Add Shareholder'}>
        {['name','shares','capital'].map((k) => <Input key={k} label={k} value={form[k]} onChangeText={(v)=>setForm((p)=>({ ...p,[k]:v }))} keyboardType={k==='name' ? 'default' : 'numeric'} />)}
        <Button title={editing ? 'Save Changes' : 'Create Shareholder'} onPress={save} />
      </FormModal>
    </Screen>
  );
}
