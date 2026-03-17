import React from 'react';
import { Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card, Screen } from '../components/ui';
import { useData } from '../context/DataContext';
import { formatMMK } from '../utils/format';
import { colors } from '../theme';

export default function ReportsScreen() {
  const { sales, expenses, products, shareholders, promotions, revenue, netProfit } = useData();
  const width = Dimensions.get('window').width - 48;
  const pieData = [
    { name: 'Sales', amount: revenue, color: '#1C6DD0', legendFontColor: colors.text, legendFontSize: 12 },
    { name: 'Expenses', amount: expenses.reduce((a,b)=>a+Number(b.amount),0), color: '#E0A100', legendFontColor: colors.text, legendFontSize: 12 },
    { name: 'Net Profit', amount: Math.max(0, netProfit), color: '#1B9C85', legendFontColor: colors.text, legendFontSize: 12 }
  ];
  return (
    <Screen scroll>
      <Card title="Financial Summary">
        <Text>Total revenue: {formatMMK(revenue)}</Text>
        <Text>Net profit: {formatMMK(netProfit)}</Text>
        <Text>Sales records: {sales.length} · Expense records: {expenses.length}</Text>
        <Text>Products tracked: {products.length} · Shareholders: {shareholders.length} · Promotions: {promotions.length}</Text>
      </Card>
      <Card title="Business Mix Chart">
        <PieChart
          data={pieData}
          width={width}
          height={220}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="12"
          chartConfig={{ color: () => colors.text, labelColor: () => colors.text }}
          absolute
        />
      </Card>
    </Screen>
  );
}
