import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Badge, Card, Screen } from '../components/ui';
import { useBusinessData } from '../hooks/useBusinessData';
import { formatMMK, percent } from '../utils/format';

const eventPromotions = [
  'Thingyan: use family sets and light discount to clear warm-season stock',
  'Thadingyut: premium gift box and social gifting focus',
  'Tazaungdaing: combo sets and limited festive packaging',
  'Eid: modest wear bundles and premium family sets',
  'School season: practical discount bundles',
  'Wedding season: premium packaging and higher-margin sets',
  'Payday cycle: short targeted promotions around salary dates'
];

export default function PromotionsScreen() {
  const { promotions } = useBusinessData();

  return (
    <Screen>
      <Card title="Myanmar Event Strategy">
        {eventPromotions.map((item, idx) => <Text key={idx}>• {item}</Text>)}
      </Card>
      <ScrollView>
        {promotions.map((p) => (
          <Card key={p.productId} title={p.productName} right={<Badge text={p.unsafe ? 'Unsafe' : 'Recommended'} tone={p.unsafe ? 'danger' : 'primary'} />}>
            <Text>Discounted price: {formatMMK(p.discountedPrice)}</Text>
            <Text>Promotion profit: {formatMMK(p.promotionProfit)}</Text>
            <Text>Promotion margin: {percent(p.promotionMargin)}</Text>
            <Text>Total promotion cost: {formatMMK(p.totalPromotionCost)}</Text>
            <Text>Break-even sales needed: {Number.isFinite(p.breakEvenSalesNeeded) ? p.breakEvenSalesNeeded : 'Not reachable safely'}</Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
