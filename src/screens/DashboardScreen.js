import React from 'react';
import { Text, View } from 'react-native';
import { Badge, Card, Row, Screen, Stat } from '../components/ui';
import { useData } from '../context/DataContext';
import { formatMMK, percent } from '../utils/format';

export default function DashboardScreen() {
  const { totalMoney, netProfit, expensesTotal, stockValue, recommendations, products, promotions, shareholders } = useData();
  const lowMarginCount = products.filter((p) => p.pricing.lowMargin).length;
  const unsafePromoCount = promotions.filter((p) => p.unsafe).length;

  return (
    <Screen scroll>
      <Row>
        <Stat label="Total Money" value={formatMMK(totalMoney)} />
        <Stat label="Net Profit" value={formatMMK(netProfit)} tone={netProfit >= 0 ? 'secondary' : 'danger'} />
      </Row>
      <Row>
        <Stat label="Expenses" value={formatMMK(expensesTotal)} tone="warning" />
        <Stat label="Stock Value" value={formatMMK(stockValue)} />
      </Row>

      <Card title="Recommended Actions">
        {recommendations.map((item, idx) => (
          <Badge key={idx} text={item} tone="secondary" />
        ))}
      </Card>

      <Card title="Pricing Alerts">
        <Text>{lowMarginCount} product(s) are below the healthy margin threshold.</Text>
        {products.slice(0, 3).map((p) => (
          <View key={p.id} style={{ gap: 6, paddingVertical: 6 }}>
            <Text style={{ fontWeight: '700' }}>{p.name}</Text>
            <Text>Safe: {formatMMK(p.pricing.minimumPrice)} · Current: {formatMMK(p.currentSellingPrice || p.pricing.recommendedPrice)}</Text>
            <Text>Margin: {percent(p.pricing.margin)}</Text>
          </View>
        ))}
      </Card>

      <Card title="Promotion Signals">
        <Text>{unsafePromoCount} promotion(s) are unsafe right now.</Text>
        {promotions.map((promo) => (
          <View key={promo.id} style={{ gap: 4, paddingVertical: 6 }}>
            <Text style={{ fontWeight: '700' }}>{promo.title}</Text>
            <Text>{promo.productName} · Discounted: {formatMMK(promo.discountedPrice)} · Margin: {percent(promo.promotionMargin)}</Text>
          </View>
        ))}
      </Card>

      <Card title="Shareholder Snapshot">
        {shareholders.map((sh) => (
          <Text key={sh.id}>{sh.name}: {percent(sh.ownership)} ownership</Text>
        ))}
      </Card>
    </Screen>
  );
}
