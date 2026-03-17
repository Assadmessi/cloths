import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, spacing } from '../theme';

export function Screen({ children, scroll = false, contentContainerStyle }) {
  if (scroll) {
    return <ScrollView style={styles.screen} contentContainerStyle={[{ gap: spacing(2), paddingBottom: spacing(4) }, contentContainerStyle]}>{children}</ScrollView>;
  }
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
    <View style={[styles.stat, tone === 'warning' && { borderColor: colors.warning }, tone === 'danger' && { borderColor: colors.danger }, tone === 'secondary' && { borderColor: colors.secondary }]}> 
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', compact = false }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, compact && { paddingVertical: 10 }, variant === 'secondary' && { backgroundColor: colors.secondary }, variant === 'danger' && { backgroundColor: colors.danger }, variant === 'ghost' && { backgroundColor: '#E2E8F0' }]}>
      <Text style={[styles.buttonText, variant === 'ghost' && { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Badge({ text, tone = 'primary' }) {
  const bg = tone === 'danger' ? '#FEE2E2' : tone === 'warning' ? '#FEF3C7' : tone === 'secondary' ? '#DCFCE7' : '#DBEAFE';
  const color = tone === 'danger' ? colors.danger : tone === 'warning' ? colors.warning : tone === 'secondary' ? colors.secondary : colors.primary;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}> 
      <Text style={[styles.badgeText, { color }]}>{text}</Text>
    </View>
  );
}

export function Input({ label, value, onChangeText, keyboardType = 'default', placeholder }) {
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <TextInput style={styles.input} value={String(value ?? '')} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={placeholder} placeholderTextColor={colors.subtext} />
    </View>
  );
}

export function Row({ children }) {
  return <View style={styles.row}>{children}</View>;
}

export function EmptyState({ title, subtitle }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={styles.emptyText}>{subtitle}</Text> : null}
    </View>
  );
}

export function FormModal({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Button title="Close" compact variant="ghost" onPress={onClose} />
        </View>
        <ScrollView contentContainerStyle={{ padding: spacing(2), gap: spacing(1.5), paddingBottom: spacing(4) }}>
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing(2), gap: spacing(2) },
  card: { backgroundColor: colors.card, borderRadius: 18, padding: spacing(2), borderWidth: 1, borderColor: colors.border, gap: spacing(1.25) },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  stat: { backgroundColor: '#fff', padding: spacing(1.5), borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary, gap: 4, minWidth: '47%', flex: 1 },
  statLabel: { color: colors.subtext, fontSize: 12 },
  statValue: { color: colors.text, fontSize: 18, fontWeight: '700' },
  button: { paddingVertical: spacing(1.5), paddingHorizontal: spacing(2), backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12, color: colors.text },
  inputLabel: { color: colors.text, fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', gap: spacing(1) },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 28, gap: 6 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  emptyText: { color: colors.subtext, textAlign: 'center' },
  modalHeader: { paddingHorizontal: spacing(2), paddingTop: spacing(2), paddingBottom: spacing(1), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.bg },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text }
});
