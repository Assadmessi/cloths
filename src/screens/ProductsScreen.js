import React, { useMemo, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { Badge, Button, Card, EmptyState, FormModal, Input, Row, Screen } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatMMK } from '../utils/format';

const emptyForm = {
  name: '', sku: '', category: 'Shirt', region: 'Yangon', fabricCostPerMeter: '0', metersUsedPerItem: '0', fabricWastagePercent: '0', factoryChargeType: 'per_piece', factoryCostValue: '0', factoryBatchQty: '0', priceTagBatchCost: '0', priceTagUnits: '0', packagingBatchCost: '0', packagingUnits: '0', outsideAccessoryCostPerPiece: '0', transportAllocation: '0', storageAllocation: '0', marketingAllocation: '0', wastageAllowance: '0', targetMargin: '0.3', minimumProfit: '1000', competitorMin: '0', competitorMax: '0', stockQty: '0', currentSellingPrice: '0'
};

export default function ProductsScreen() {
  const { user } = useAuth();
  const { products, createItem, updateItem, deleteItem } = useData();
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const canWrite = user?.role !== 'viewer';

  const sortedProducts = useMemo(() => [...products].sort((a, b) => a.name.localeCompare(b.name)), [products]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setVisible(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm(Object.fromEntries(Object.entries(emptyForm).map(([k]) => [k, String(item[k] ?? emptyForm[k])] )));
    setVisible(true);
  };

  const save = () => {
    if (!form.name || !form.sku) {
      Alert.alert('Missing fields', 'Name and SKU are required.');
      return;
    }
    if (editing) updateItem('products', editing.id, form);
    else createItem('products', form);
    setVisible(false);
  };

  return (
    <Screen scroll>
      <Card title="Products" right={canWrite ? <Button title="Add Product" compact onPress={openCreate} /> : null}>
        <Text>Editable product catalog with costing, stock, and Myanmar pricing fields.</Text>
      </Card>

      {!sortedProducts.length ? <EmptyState title="No products yet" subtitle="Create your first SKU." /> : sortedProducts.map((item) => (
        <Card key={item.id} title={item.name} right={<Badge text={item.category} />}>
          <Text>SKU: {item.sku} · Region: {item.region}</Text>
          <Text>Cost: {formatMMK(item.pricing.productionCostPerPiece)} · Current: {formatMMK(item.currentSellingPrice || item.pricing.recommendedPrice)}</Text>
          <Text>Stock: {item.stockQty} · Safe Price: {formatMMK(item.pricing.minimumPrice)}</Text>
          <Row>
            <Button title="Edit" compact onPress={() => openEdit(item)} />
            {canWrite ? <Button title="Delete" compact variant="danger" onPress={() => deleteItem('products', item.id)} /> : null}
          </Row>
        </Card>
      ))}

      <FormModal visible={visible} onClose={() => setVisible(false)} title={editing ? 'Edit Product' : 'Add Product'}>
        {Object.keys(emptyForm).map((key) => (
          <Input key={key} label={key} value={form[key]} onChangeText={(v) => setForm((prev) => ({ ...prev, [key]: v }))} keyboardType={key.includes('Cost') || key.includes('Qty') || key.includes('Percent') || key.includes('Margin') || key.includes('Profit') || key.includes('Units') || key.includes('Meter') ? 'numeric' : 'default'} />
        ))}
        <Button title={editing ? 'Save Changes' : 'Create Product'} onPress={save} />
      </FormModal>
    </Screen>
  );
}
