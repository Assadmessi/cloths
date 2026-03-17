import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { Screen, Button, Card } from '../components/ui';
import { colors } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { signIn, loading } = useAuth();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    try {
      await signIn(email, password);
    } catch (e) {
      Alert.alert('Login failed', e.message);
    }
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Clothing OS</Text>
        <Text style={styles.subtitle}>Myanmar-ready clothing business operating system</Text>
      </View>
      <Card title="Secure Login">
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
        <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <Button title={loading ? 'Signing in...' : 'Sign In'} onPress={handleLogin} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: 40, gap: 8 },
  title: { fontSize: 34, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.subtext },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, backgroundColor: '#fff' }
});
