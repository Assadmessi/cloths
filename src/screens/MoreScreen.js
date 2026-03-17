import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Card, Screen } from '../components/ui';
import { colors } from '../theme';

const items = [
  'Production Costing', 'Pricing Strategy', 'Promotions', 'Sales', 'Expenses', 'Shareholders', 'Dividends', 'Reports', 'Market Analysis', 'Factory Orders', 'Audit History', 'Settings'
];

export default function MoreScreen({ navigation }) {
  return (
    <Screen scroll>
      <Card title="All Sections">
        <Text>Only 3 tabs stay in the bottom bar: Dashboard, Products, and this hamburger menu.</Text>
      </Card>
      <View style={{ gap: 12 }}>
        {items.map((item) => (
          <TouchableOpacity key={item} onPress={() => navigation.navigate(item)} style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 16 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item}</Text>
            <Text style={{ color: colors.subtext, marginTop: 4 }}>Open and edit records in {item.toLowerCase()}.</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Screen>
  );
}
