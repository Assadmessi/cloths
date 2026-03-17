import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Badge, Card, Screen } from '../components/ui';
import { useBusinessData } from '../hooks/useBusinessData';
import { formatMMK } from '../utils/format';

export default function ProductsScreen() {
  const { products } = useBusinessData();

  return (
    <Screen>
      <ScrollView>
        {products.map((p) => (
          <Card
            key={p.id}
            title={p.name}
            right={<Badge text={`${p.category} • ${p.region}`} />}
          >
            <Text>SKU: {p.sku}</Text>
            <Text>Stock: {p.stockQty}</Text>
            <Text>Production cost: {formatMMK(p.pricing.productionCostPerPiece)}</Text>
            <Text>Recommended price: {formatMMK(p.pricing.recommendedPrice)}</Text>
            <Text>Premium price: {formatMMK(p.pricing.premiumPrice)}</Text>
            <Text>Promotional price: {formatMMK(p.pricing.promotionalPrice)}</Text>
            <View>
              <Text>Competitor range: {formatMMK(p.competitorMin)} - {formatMMK(p.competitorMax)}</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
