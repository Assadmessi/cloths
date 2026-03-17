import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DataProvider, useData } from './src/context/DataContext';
import AppNavigator from './src/navigation/AppNavigator';

function Bootstrap() {
  const { user } = useAuth();
  return (
    <DataProvider user={user}>
      <AppWithData />
    </DataProvider>
  );
}

function AppWithData() {
  const { ready } = useData();
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return <AppNavigator />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Bootstrap />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
