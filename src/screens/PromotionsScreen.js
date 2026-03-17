import React, { useState } from 'react';
import { Text } from 'react-native';
import { Badge, Button, Card, FormModal, Input, Row, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatMMK, percent } from '../utils/format';

const base = { title: '', productId: '', type: 'discount_percent', discountPercent: '0', fixedDiscount: '0', giftCost: '0', extraPackagingCost: '0', marketingCost: '0', campaignCost: '0', qty: '1', date: new Date().toISOString().slice(0,10), seasonTag: '' };

export default function PromotionsScreen() {
  const { user } = useAuth();
  const { promotions, products, createItem, updateItem, deleteItem } = useData();
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState(base);
  const [editing, setEditing] = useState(null);
  const canWrite = user?.role !== 'viewer';

  const openCreate = () => { setEditing(null); setForm({ ...base, productId: products[0]?.id || '' }); setVisible(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...base, ...Object.fromEntries(Object.entries(item).map(([k,v]) => [k, String(v)])) }); setVisible(true); };
  const save = () => { editing ? updateItem('promotions', editing.id, form) : createItem('promotions', form); setVisible(false); };

  return (
    <Screen scroll>
      <Card title="Promotion Engine" right={canWrite ? <Button title="Add Promotion" compact onPress={openCreate} /> : null}>
        <Text>Compare discount, gift, bundle-style cost, and campaign impact.</Text>
      </Card>
      {promotions.map((promo) => (
        <Card key={promo.id} title={promo.title} right={<Badge text={promo.unsafe ? 'Unsafe' : 'Recommended'} tone={promo.unsafe ? 'danger' : 'secondary'} />}>
          <Text>{promo.productName} · {promo.seasonTag || promo.type}</Text>
          <Text>Discounted price: {formatMMK(promo.discountedPrice)}</Text>
          <Text>Promotion profit: {formatMMK(promo.promotionProfit)} · Margin: {percent(promo.promotionMargin)}</Text>
          <Text>Total promotion cost: {formatMMK(promo.totalPromotionCost)} · Break-even sales: {promo.breakEvenSalesNeeded === Infinity ? 'Never' : promo.breakEvenSalesNeeded}</Text>
          <Row>
            <Button title="Edit" compact onPress={() => openEdit(promo)} />
            {canWrite ? <Button title="Delete" compact variant="danger" onPress={() => deleteItem('promotions', promo.id)} /> : null}
          </Row>
        </Card>
      ))}

      <FormModal visible={visible} onClose={() => setVisible(false)} title={editing ? 'Edit Promotion' : 'Add Promotion'}>
        <Input label="Title" value={form.title} onChangeText={(v) => setForm((p) => ({ ...p, title: v }))} />
        <Input label="Product ID" value={form.productId} onChangeText={(v) => setForm((p) => ({ ...p, productId: v }))} placeholder={products.map((p) => p.id).join(', ')} />
        {['type','discountPercent','fixedDiscount','giftCost','extraPackagingCost','marketingCost','campaignCost','qty','date','seasonTag'].map((key) => <Input key={key} label={key} value={form[key]} onChangeText={(v) => setForm((p)=>({ ...p,[key]:v }))} keyboardType={key === 'date' || key === 'type' || key === 'seasonTag' ? 'default' : 'numeric'} />)}
        <Button title={editing ? 'Save Changes' : 'Create Promotion'} onPress={save} />
      </FormModal>
    </Screen>
  );
}
