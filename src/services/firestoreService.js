import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { createAuditLog } from './auditService';

export async function listCollection(name) {
  const snapshot = await getDocs(query(collection(db, name)));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createEntity(name, data, user) {
  const ref = await addDoc(collection(db, name), data);
  await createAuditLog({
    entityType: name,
    entityId: ref.id,
    action: 'create',
    changes: Object.keys(data).map((k) => ({ field: k, oldValue: null, newValue: data[k] })),
    user
  });
  return ref;
}

export async function upsertEntity(name, id, data, oldData = {}, user) {
  await setDoc(doc(db, name, id), data, { merge: true });
  const changes = Object.keys(data).map((k) => ({
    field: k,
    oldValue: oldData?.[k] ?? null,
    newValue: data[k]
  }));
  await createAuditLog({
    entityType: name,
    entityId: id,
    action: 'update',
    changes,
    user
  });
}

export async function patchEntity(name, id, data, oldData = {}, user) {
  await updateDoc(doc(db, name, id), data);
  const changes = Object.keys(data).map((k) => ({
    field: k,
    oldValue: oldData?.[k] ?? null,
    newValue: data[k]
  }));
  await createAuditLog({
    entityType: name,
    entityId: id,
    action: 'update',
    changes,
    user
  });
}

export async function removeEntity(name, id, oldData = {}, user) {
  await deleteDoc(doc(db, name, id));
  await createAuditLog({
    entityType: name,
    entityId: id,
    action: 'delete',
    changes: Object.keys(oldData).map((k) => ({
      field: k,
      oldValue: oldData[k],
      newValue: null
    })),
    user
  });
}
