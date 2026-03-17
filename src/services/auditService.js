import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function createAuditLog({
  entityType,
  entityId,
  action,
  changes = [],
  user
}) {
  const payload = {
    entityType,
    entityId,
    action,
    changes,
    userId: user?.uid || 'unknown',
    userName: user?.name || 'Unknown User',
    role: user?.role || 'unknown',
    timestamp: serverTimestamp(),
    retentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  };
  return addDoc(collection(db, 'auditLogs'), payload);
}
