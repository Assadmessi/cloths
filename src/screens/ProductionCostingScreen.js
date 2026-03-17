import React from 'react';
import { Text } from 'react-native';
import { Card, Screen } from '../components/ui';
import { useData } from '../context/DataContext';
import { formatMMK } from '../utils/format';

export default function ProductionCostingScreen() {
  const { products } = useData();
  return (
    <Screen scroll>
      {products.map((p) => (
        <Card key={p.id} title={p.name}>
          <Text>Fabric cost per piece: {formatMMK((Number(p.fabricCostPerMeter) || 0) * (Number(p.metersUsedPerItem) || 0) * (1 + (Number(p.fabricWastagePercent) || 0) / 100))}</Text>
          <Text>Factory cost per piece: {formatMMK(p.factoryChargeType === 'batch' ? (Number(p.factoryCostValue) || 0) / Math.max(Number(p.factoryBatchQty) || 1, 1) : Number(p.factoryCostValue) || 0)}</Text>
          <Text>Price tag cost: {formatMMK((Number(p.priceTagBatchCost) || 0) / Math.max(Number(p.priceTagUnits) || 1, 1))}</Text>
          <Text>Packaging cost: {formatMMK((Number(p.packagingBatchCost) || 0) / Math.max(Number(p.packagingUnits) || 1, 1))}</Text>
          <Text>Outside accessory: {formatMMK(p.outsideAccessoryCostPerPiece)}</Text>
          <Text>Transport + Storage + Marketing + Wastage: {formatMMK((Number(p.transportAllocation)||0)+(Number(p.storageAllocation)||0)+(Number(p.marketingAllocation)||0)+(Number(p.wastageAllowance)||0))}</Text>
          <Text style={{ fontWeight: '700' }}>Production cost per piece: {formatMMK(p.pricing.productionCostPerPiece)}</Text>
        </Card>
      ))}
    </Screen>
  );
}
