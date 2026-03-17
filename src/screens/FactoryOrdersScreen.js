import React, { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card, FormModal, Input, Row, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatMMK, percent } from '../utils/format';

const base = { productId: '', fabricSentMeters: '0', quantityProduced: '0', defectiveItems: '0', factoryCost: '0', date: new Date().toISOString().slice(0,10) };

export default function FactoryOrdersScreen() {
  const { user } = useAuth();
  const { factoryOrders, products, createItem, updateItem, deleteItem } = useData();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(base);
  const canWrite = user?.role !== 'viewer';
  const save = () => { editing ? updateItem('factoryOrders', editing.id, form) : createItem('factoryOrders', form); setVisible(false); };

  return (
    <Screen scroll>
      <Card title="Factory Orders" right={canWrite ? <Button title="Add Order" compact onPress={() => { setEditing(null); setForm({ ...base, productId: products[0]?.id || '' }); setVisible(true); }} /> : null}>
        <Text>Track outsourced production, defect rate, and real factory cost per piece.</Text>
      </Card>
      {factoryOrders.map((order) => {
        const product = products.find((p) => p.id === order.productId);
        return (
          <Card key={order.id} title={product?.name || order.productId}>
            <Text>Fabric sent: {order.fabricSentMeters}m · Produced: {order.quantityProduced} · Defects: {order.defectiveItems}</Text>
            <Text>Factory cost: {formatMMK(order.factoryCost)} · Cost per piece: {formatMMK(order.costPerPiece)}</Text>
            <Text>Defect rate: {percent(order.defectRate)}</Text>
            <Row>
              <Button title="Edit" compact onPress={() => { setEditing(order); setForm(Object.fromEntries(Object.entries({ ...base, ...order }).map(([k,v])=>[k,String(v)]))); setVisible(true); }} />
              {canWrite ? <Button title="Delete" compact variant="danger" onPress={() => deleteItem('factoryOrders', order.id)} /> : null}
            </Row>
          </Card>
        );
      })}
      <FormModal visible={visible} onClose={() => setVisible(false)} title={editing ? 'Edit Factory Order' : 'Add Factory Order'}>
        {['productId','fabricSentMeters','quantityProduced','defectiveItems','factoryCost','date'].map((k) => <Input key={k} label={k} value={form[k]} onChangeText={(v)=>setForm((p)=>({ ...p,[k]:v }))} keyboardType={k==='date'||k==='productId' ? 'default' : 'numeric'} />)}
        <Button title={editing ? 'Save Changes' : 'Create Order'} onPress={save} />
      </FormModal>
    </Screen>
  );
}
