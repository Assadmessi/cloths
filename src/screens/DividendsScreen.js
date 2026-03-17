import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card, FormModal, Input, Row, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatMMK } from '../utils/format';

const base = { title: '', amount: '0', date: new Date().toISOString().slice(0,10) };

export default function DividendsScreen() {
  const { user } = useAuth();
  const { dividends, shareholders, createItem, updateItem, deleteItem } = useData();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(base);
  const canWrite = user?.role === 'admin';
  const save = () => { editing ? updateItem('dividends', editing.id, form) : createItem('dividends', form); setVisible(false); };

  return (
    <Screen scroll>
      <Card title="Dividends" right={canWrite ? <Button title="Declare Dividend" compact onPress={() => { setEditing(null); setForm(base); setVisible(true); }} /> : null}>
        <Text>Distribute profit based on current share ownership.</Text>
      </Card>
      {dividends.map((div) => (
        <Card key={div.id} title={div.title}>
          <Text>{formatMMK(div.amount)} · {div.date}</Text>
          {shareholders.map((sh) => <Text key={sh.id}>{sh.name}: {formatMMK(div.amount * sh.ownership)}</Text>)}
          {canWrite ? <Row><Button title="Edit" compact onPress={() => { setEditing(div); setForm(Object.fromEntries(Object.entries({ ...base, ...div }).map(([k,v])=>[k,String(v)]))); setVisible(true); }} /><Button title="Delete" compact variant="danger" onPress={() => deleteItem('dividends', div.id)} /></Row> : null}
        </Card>
      ))}
      <FormModal visible={visible} onClose={() => setVisible(false)} title={editing ? 'Edit Dividend' : 'Declare Dividend'}>
        {['title','amount','date'].map((k) => <Input key={k} label={k} value={form[k]} onChangeText={(v)=>setForm((p)=>({ ...p,[k]:v }))} keyboardType={k==='amount' ? 'numeric' : 'default'} />)}
        <Button title={editing ? 'Save Changes' : 'Declare'} onPress={save} />
      </FormModal>
    </Screen>
  );
}
