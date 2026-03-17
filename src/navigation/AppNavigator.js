import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProductsScreen from '../screens/ProductsScreen';
import MoreScreen from '../screens/MoreScreen';
import ProductionCostingScreen from '../screens/ProductionCostingScreen';
import PricingScreen from '../screens/PricingScreen';
import PromotionsScreen from '../screens/PromotionsScreen';
import SalesScreen from '../screens/SalesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import ShareholdersScreen from '../screens/ShareholdersScreen';
import DividendsScreen from '../screens/DividendsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import MarketAnalysisScreen from '../screens/MarketAnalysisScreen';
import FactoryOrdersScreen from '../screens/FactoryOrdersScreen';
import AuditHistoryScreen from '../screens/AuditHistoryScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const MoreStack = createNativeStackNavigator();

function MoreStackScreen() {
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen name="MoreHome" component={MoreScreen} options={{ title: 'More' }} />
      <MoreStack.Screen name="Production Costing" component={ProductionCostingScreen} />
      <MoreStack.Screen name="Pricing Strategy" component={PricingScreen} />
      <MoreStack.Screen name="Promotions" component={PromotionsScreen} />
      <MoreStack.Screen name="Sales" component={SalesScreen} />
      <MoreStack.Screen name="Expenses" component={ExpensesScreen} />
      <MoreStack.Screen name="Shareholders" component={ShareholdersScreen} />
      <MoreStack.Screen name="Dividends" component={DividendsScreen} />
      <MoreStack.Screen name="Reports" component={ReportsScreen} />
      <MoreStack.Screen name="Market Analysis" component={MarketAnalysisScreen} />
      <MoreStack.Screen name="Factory Orders" component={FactoryOrdersScreen} />
      <MoreStack.Screen name="Audit History" component={AuditHistoryScreen} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} />
    </MoreStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name !== 'More',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'grid',
            Products: 'cube',
            More: 'menu'
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="More" component={MoreStackScreen} options={{ title: 'Menu' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? <Stack.Screen name="Main" component={MainTabs} /> : <Stack.Screen name="Login" component={LoginScreen} />}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
