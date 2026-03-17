import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Badge, Card, Screen } from '../components/ui';
import { useBusinessData } from '../hooks/useBusinessData';
import { formatMMK, percent } from '../utils/format';
import { myanmarMarketSuggestion } from '../utils/businessLogic';

export default function PricingScreen() {
  const { products } = useBusinessData();

  return (
    <Screen>
      <ScrollView>
        {products.map((p) => (
          <Card key={p.id} title={p.name} right={<Badge text={p.pricing.lowMargin ? 'Watch margin' : 'Healthy'} tone={p.pricing.lowMargin ? 'warning' : 'primary'} />}>
            <Text>Minimum safe price: {formatMMK(p.pricing.minimumPrice)}</Text>
            <Text>Recommended price: {formatMMK(p.pricing.recommendedPrice)}</Text>
            <Text>Premium price: {formatMMK(p.pricing.premiumPrice)}</Text>
            <Text>Promotional price: {formatMMK(p.pricing.promotionalPrice)}</Text>
            <Text>Current margin: {percent(p.pricing.margin)}</Text>
            <Text>Profit per piece: {formatMMK(p.pricing.profit)}</Text>
            <Text>Market note: {myanmarMarketSuggestion(p, p.pricing)}</Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
