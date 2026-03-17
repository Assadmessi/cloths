import React from 'react';
import { Text } from 'react-native';
import { Badge, Card, Screen } from '../components/ui';
import { useData } from '../context/DataContext';
import { formatMMK } from '../utils/format';

export default function MarketAnalysisScreen() {
  const { products } = useData();
  const seasonalHints = ['Thingyan', 'Thadingyut', 'Tazaungdaing', 'Eid', 'School Season', 'Wedding Season', 'Payday Cycle'];
  return (
    <Screen scroll>
      <Card title="Myanmar Market Events">
        {seasonalHints.map((s) => <Badge key={s} text={s} tone="secondary" />)}
      </Card>
      {products.map((p) => (
        <Card key={p.id} title={p.name}>
          <Text>Competitor range: {formatMMK(p.competitorMin)} to {formatMMK(p.competitorMax)}</Text>
          <Text>Current price: {formatMMK(p.currentSellingPrice || p.pricing.recommendedPrice)}</Text>
          <Text>{p.marketSuggestion}</Text>
        </Card>
      ))}
    </Screen>
  );
}
