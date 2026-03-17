import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Badge, Card, Screen } from '../components/ui';

const demoLogs = [
  {
    id: 'log-1',
    entityType: 'products',
    entityId: 'prod-shirt-001',
    action: 'update',
    message: 'Manager updated price from 5000 MMK to 6500 MMK',
    timestamp: '2026-03-12 10:22'
  },
  {
    id: 'log-2',
    entityType: 'promotions',
    entityId: 'promo-1',
    action: 'create',
    message: 'Admin created Thingyan campaign with 10% discount',
    timestamp: '2026-03-13 12:05'
  },
  {
    id: 'log-3',
    entityType: 'auditLogs',
    entityId: 'retention-job',
    action: 'archive',
    message: 'System archived 365-day old history records',
    timestamp: '2026-03-15 00:00'
  }
];

export default function AuditHistoryScreen() {
  return (
    <Screen>
      <ScrollView>
        <Card title="Audit Policy">
          <Text>All actions generate immutable history records. Users cannot edit or delete logs. Retention is 1 year, then archive or auto-delete with system log.</Text>
        </Card>

        {demoLogs.map((log) => (
          <Card key={log.id} title={log.entityType} right={<Badge text={log.action} />}>
            <Text>{log.message}</Text>
            <Text>ID: {log.entityId}</Text>
            <Text>{log.timestamp}</Text>
          </Card>
        ))}
      </ScrollView>
    </Screen>
  );
}
