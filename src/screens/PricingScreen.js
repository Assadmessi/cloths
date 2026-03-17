import React from 'react';
import { Text } from 'react-native';
import { Badge, Card, Screen } from '../components/ui';
import { useData } from '../context/DataContext';
import { formatMMK, percent } from '../utils/format';

export default function PricingScreen() {
  const { products } = useData();
  return (
    <Screen scroll>
      {products.map((p) => (
        <Card key={p.id} title={p.name} right={<Badge text={p.pricing.isUnsafe ? 'Unsafe' : 'Healthy'} tone={p.pricing.isUnsafe ? 'danger' : 'secondary'} />}>
          <Text>Minimum safe price: {formatMMK(p.pricing.minimumPrice)}</Text>
          <Text>Recommended price: {formatMMK(p.pricing.recommendedPrice)}</Text>
          <Text>Premium price: {formatMMK(p.pricing.premiumPrice)}</Text>
          <Text>Promotional price: {formatMMK(p.pricing.promotionalPrice)}</Text>
          <Text>Profit per piece at current price: {formatMMK(p.pricing.profit)}</Text>
          <Text>Margin: {percent(p.pricing.margin)}</Text>
          <Text>{p.marketSuggestion}</Text>
        </Card>
      ))}
    </Screen>
  );
}
