import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useBusinessData } from '../hooks/useBusinessData';
import { Badge, Card, Screen, Stat } from '../components/ui';
import { formatMMK, percent } from '../utils/format';

export default function DashboardScreen() {
  const data = useBusinessData();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card title="Business Snapshot" right={<Badge text="Myanmar MMK" />}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            <Stat label="Total Money" value={formatMMK(data.cash)} />
            <Stat label="Net Profit" value={formatMMK(data.netProfit)} tone={data.netProfit > 0 ? 'primary' : 'danger'} />
            <Stat label="Expenses" value={formatMMK(data.expenses)} tone="warning" />
            <Stat label="Stock Value" value={formatMMK(data.stockValue)} />
          </View>
        </Card>

        <Card title="Recommended Actions">
          {data.recommendedActions.map((item, idx) => (
            <Text key={idx}>• {item}</Text>
          ))}
        </Card>

        <Card title="Pricing Alerts">
          {data.products.map((product) => (
            <View key={product.id} style={{ marginBottom: 10 }}>
              <Text>{product.name}</Text>
              <Text>Cost: {formatMMK(product.pricing.productionCostPerPiece)} | Margin: {percent(product.pricing.margin)}</Text>
              {product.pricing.isUnsafe && <Badge text="Unsafe price" tone="danger" />}
              {product.pricing.lowMargin && <Badge text="Low margin" tone="warning" />}
            </View>
          ))}
        </Card>

        <Card title="Promotion Suggestions">
          {data.promotions.map((promo) => (
            <View key={promo.productId} style={{ marginBottom: 10 }}>
              <Text>{promo.productName}</Text>
              <Text>Promo profit: {formatMMK(promo.promotionProfit)} | Promo margin: {percent(promo.promotionMargin)}</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}
