import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card, FormModal, Input, Row, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatMMK } from '../utils/format';

const base = { productId: '', qty: '1', pricePerPiece: '0', date: new Date().toISOString().slice(0,10), channel: 'Retail' };

export default function SalesScreen() {
  const { user } = useAuth();
  const { sales, products, createItem, updateItem, deleteItem } = useData();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(base);
  const canWrite = user?.role !== 'viewer';

  const save = () => { editing ? updateItem('sales', editing.id, form) : createItem('sales', form); setVisible(false); };

  return (
    <Screen scroll>
      <Card title="Sales" right={canWrite ? <Button title="Add Sale" compact onPress={() => { setEditing(null); setForm({ ...base, productId: products[0]?.id || '', pricePerPiece: String(products[0]?.currentSellingPrice || 0) }); setVisible(true); }} /> : null}>
        <Text>Record daily sales and selling price used.</Text>
      </Card>
      {sales.map((sale) => {
        const product = products.find((p) => p.id === sale.productId);
        return (
          <Card key={sale.id} title={product?.name || sale.productId}>
            <Text>Qty: {sale.qty} · Price: {formatMMK(sale.pricePerPiece)} · Revenue: {formatMMK(Number(sale.qty) * Number(sale.pricePerPiece))}</Text>
            <Text>Date: {sale.date} · Channel: {sale.channel}</Text>
            <Row>
              <Button title="Edit" compact onPress={() => { setEditing(sale); setForm(Object.fromEntries(Object.entries({ ...base, ...sale }).map(([k,v]) => [k, String(v)]))); setVisible(true); }} />
              {canWrite ? <Button title="Delete" compact variant="danger" onPress={() => deleteItem('sales', sale.id)} /> : null}
            </Row>
          </Card>
        );
      })}
      <FormModal visible={visible} onClose={() => setVisible(false)} title={editing ? 'Edit Sale' : 'Add Sale'}>
        {['productId','qty','pricePerPiece','date','channel'].map((k) => <Input key={k} label={k} value={form[k]} onChangeText={(v) => setForm((p)=>({ ...p,[k]:v }))} keyboardType={k==='date'||k==='channel'||k==='productId' ? 'default' : 'numeric'} />)}
        <Button title={editing ? 'Save Changes' : 'Create Sale'} onPress={save} />
      </FormModal>
    </Screen>
  );
}
