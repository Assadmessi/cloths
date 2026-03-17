import React from 'react';
import { Text } from 'react-native';
import { Badge, Card, EmptyState, Screen } from '../components/ui';
import { useData } from '../context/DataContext';

export default function AuditHistoryScreen() {
  const { auditLogs } = useData();
  return (
    <Screen scroll>
      <Card title="Audit History">
        <Text>Read-only. Users cannot edit or delete these records. Retention rule is 365 days.</Text>
      </Card>
      {!auditLogs.length ? <EmptyState title="No audit events yet" subtitle="Create or edit data and the logs will appear here." /> : auditLogs.map((log) => (
        <Card key={log.id} title={`${log.entityType} · ${log.action}`} right={<Badge text={log.role} tone={log.role === 'system' ? 'warning' : 'primary'} />}>
          <Text>{log.message}</Text>
          <Text>Field: {log.fieldChanged}</Text>
          <Text>Old: {String(log.oldValue)}</Text>
          <Text>New: {String(log.newValue)}</Text>
          <Text>User: {log.userName} · {new Date(log.timestamp).toLocaleString()}</Text>
        </Card>
      ))}
    </Screen>
  );
}
