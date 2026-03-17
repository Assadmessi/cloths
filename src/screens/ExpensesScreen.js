import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card, FormModal, Input, Row, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatMMK } from '../utils/format';

const base = { category: 'Marketing', amount: '0', date: new Date().toISOString().slice(0,10), note: '' };

export default function ExpensesScreen() {
  const { user } = useAuth();
  const { expenses, createItem, updateItem, deleteItem } = useData();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(base);
  const canWrite = user?.role !== 'viewer';

  const save = () => { editing ? updateItem('expenses', editing.id, form) : createItem('expenses', form); setVisible(false); };

  return (
    <Screen scroll>
      <Card title="Expenses" right={canWrite ? <Button title="Add Expense" compact onPress={() => { setEditing(null); setForm(base); setVisible(true); }} /> : null}>
        <Text>Track operations, transport, marketing, storage, and campaign spending.</Text>
      </Card>
      {expenses.map((exp) => (
        <Card key={exp.id} title={exp.category}>
          <Text>{formatMMK(exp.amount)} · {exp.date}</Text>
          <Text>{exp.note}</Text>
          <Row>
            <Button title="Edit" compact onPress={() => { setEditing(exp); setForm(Object.fromEntries(Object.entries({ ...base, ...exp }).map(([k,v])=>[k,String(v)]))); setVisible(true); }} />
            {canWrite ? <Button title="Delete" compact variant="danger" onPress={() => deleteItem('expenses', exp.id)} /> : null}
          </Row>
        </Card>
      ))}
      <FormModal visible={visible} onClose={() => setVisible(false)} title={editing ? 'Edit Expense' : 'Add Expense'}>
        {['category','amount','date','note'].map((k) => <Input key={k} label={k} value={form[k]} onChangeText={(v)=>setForm((p)=>({ ...p,[k]:v }))} keyboardType={k==='amount' ? 'numeric' : 'default'} />)}
        <Button title={editing ? 'Save Changes' : 'Create Expense'} onPress={save} />
      </FormModal>
    </Screen>
  );
}
