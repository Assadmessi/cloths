import React from 'react';
import { Dimensions, ScrollView, Text } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Card, Screen } from '../components/ui';
import { useBusinessData } from '../hooks/useBusinessData';
import { colors } from '../theme';

const screenWidth = Dimensions.get('window').width - 32;

export default function ReportsScreen() {
  const data = useBusinessData();

  const salesData = {
    labels: data.sales.map((s) => s.date.slice(5)),
    datasets: [{ data: data.sales.map((s) => s.qty * s.pricePerPiece) }]
  };

  const expenseData = data.expensesList.map((e, index) => ({
    name: e.category,
    amount: e.amount,
    color: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'][index % 4],
    legendFontColor: '#334155',
    legendFontSize: 12
  }));

  return (
    <Screen>
      <ScrollView>
        <Card title="Sales Trend">
          <LineChart
            data={salesData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: () => colors.primary,
              labelColor: () => colors.text
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </Card>

        <Card title="Expense Breakdown">
          <PieChart
            data={expenseData}
            width={screenWidth}
            height={220}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="10"
            chartConfig={{
              color: () => colors.text,
              labelColor: () => colors.text
            }}
          />
        </Card>

        <Card title="Report Coverage">
          <Text>Includes profit trends, sales charts, expense breakdown, product performance, promotion impact, and shareholder earnings.</Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
