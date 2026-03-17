import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Badge, Card, Screen } from '../components/ui';
import { useBusinessData } from '../hooks/useBusinessData';
import { formatMMK, percent } from '../utils/format';

export default function FactoryOrdersScreen() {
  const { factoryOrders, products } = useBusinessData();

  return (
    <Screen>
      <ScrollView>
        {factoryOrders.map((order) => {
          const product = products.find((p) => p.id === order.productId);
          const costPerPiece = order.quantityProduced ? order.factoryCost / order.quantityProduced : 0;
          return (
            <Card key={order.id} title={product?.name || order.productId} right={<Badge text={percent(order.defectRate)} tone={order.defectRate > 0.05 ? 'warning' : 'primary'} />}>
              <Text>Fabric sent: {order.fabricSentMeters} meters</Text>
              <Text>Quantity produced: {order.quantityProduced}</Text>
              <Text>Defective items: {order.defectiveItems}</Text>
              <Text>Factory cost: {formatMMK(order.factoryCost)}</Text>
              <Text>Cost per piece: {formatMMK(costPerPiece)}</Text>
              <Text>Defect rate: {percent(order.defectRate)}</Text>
            </Card>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
