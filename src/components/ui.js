import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, spacing } from '../theme';

export function Screen({ children }) {
  return <View style={styles.screen}>{children}</View>;
}

export function Card({ title, right, children }) {
  return (
    <View style={styles.card}>
      {(title || right) && (
        <View style={styles.cardHeader}>
          {title ? <Text style={styles.cardTitle}>{title}</Text> : <View />}
          {right}
        </View>
      )}
      {children}
    </View>
  );
}

export function Stat({ label, value, tone = 'primary' }) {
  return (
    <View style={[styles.stat, tone === 'warning' && { borderColor: colors.warning }, tone === 'danger' && { borderColor: colors.danger }]}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary' }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === 'secondary' && { backgroundColor: colors.secondary },
        variant === 'danger' && { backgroundColor: colors.danger }
      ]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Badge({ text, tone = 'primary' }) {
  const bg = tone === 'danger' ? '#FEE2E2' : tone === 'warning' ? '#FEF3C7' : '#DBEAFE';
  const color = tone === 'danger' ? colors.danger : tone === 'warning' ? colors.warning : colors.primary;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing(2), gap: spacing(2) },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: spacing(2), borderWidth: 1, borderColor: colors.border, gap: spacing(1.25) },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  stat: { backgroundColor: '#fff', padding: spacing(1.5), borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, gap: 4, minWidth: '47%' },
  statLabel: { color: colors.subtext, fontSize: 12 },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  button: { paddingVertical: spacing(1.5), paddingHorizontal: spacing(2), backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' }
});
