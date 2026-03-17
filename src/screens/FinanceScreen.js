import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Badge, Card, Screen, Stat } from '../components/ui';
import { useBusinessData } from '../hooks/useBusinessData';
import { formatMMK, percent } from '../utils/format';

export default function FinanceScreen() {
  const data = useBusinessData();

  return (
    <Screen>
      <Card title="Finance Overview">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          <Stat label="Revenue" value={formatMMK(data.revenue)} />
          <Stat label="Production Cost" value={formatMMK(data.productionCost)} />
          <Stat label="Expenses" value={formatMMK(data.expenses)} tone="warning" />
          <Stat label="Distributable Profit" value={formatMMK(data.distributableProfit)} />
        </View>
      </Card>

      <Card title="Shareholders" right={<Badge text={`Total shares ${data.totalShares}`} />}>
        {data.shareholders.map((s) => (
          <View key={s.id} style={{ marginBottom: 12 }}>
            <Text>{s.name}</Text>
            <Text>Shares: {s.shares} | Ownership: {percent(s.ownership)}</Text>
            <Text>Capital: {formatMMK(s.capital)} | Dividend: {formatMMK(s.dividend)}</Text>
          </View>
        ))}
      </Card>

      <ScrollView>
        <Card title="Expenses">
          {data.expensesList.map((e) => (
            <Text key={e.id}>• {e.category}: {formatMMK(e.amount)} ({e.date})</Text>
          ))}
        </Card>
      </ScrollView>
    </Screen>
  );
}
