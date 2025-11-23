// src/services/presence.ts
import {AppState, AppStateStatus} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export type PresenceStatus = 'online' | 'offline';

const usersCol = () => firestore().collection('users');
const userDoc = (userId: number) => usersCol().doc(String(userId));

/** Ensure a presence doc exists (id = userId as string) */
export const ensurePresenceDoc = async (
  userId: number,
  extra: Record<string, any> = {},
) => {
  const ref = userDoc(userId);
  const snap = await ref.get();
  if (!snap.exists) {
    const ts = firestore.FieldValue.serverTimestamp() as any;
    await ref.set({
      status: 'offline',
      lastSeen: ts,
      updatedAt: ts,
      ...extra,
    });
  }
};

/** Update presence status (sets lastSeen when going offline) */
export const setPresence = async (userId: number, status: PresenceStatus) => {
  const ts = firestore.FieldValue.serverTimestamp() as any;
  if (status === 'online') {
    await userDoc(userId).set({status, updatedAt: ts}, {merge: true});
  } else {
    await userDoc(userId).set(
      {status, lastSeen: ts, updatedAt: ts},
      {merge: true},
    );
  }
};

/** Start tracking app lifecycle → presence in Firestore */
export const startPresenceTracking = async (userId: number) => {
  await ensurePresenceDoc(userId);
  await setPresence(userId, 'online');

  const handler = (state: AppStateStatus) => {
    if (state === 'active') {
      setPresence(userId, 'online').catch(() => {});
    } else {
      // 'inactive' | 'background'
      setPresence(userId, 'offline').catch(() => {});
    }
  };

  const sub = AppState.addEventListener('change', handler);

  // Return an unsubscribe to stop tracking
  return () => {
    sub.remove();
    // best-effort mark offline on teardown
    setPresence(userId, 'offline').catch(() => {});
  };
};

/**
 * Listen to presence for a set of user IDs.
 * Uses chunked 'in' queries (10 ids per listener).
 * Calls back with a merged { [userId]: boolean } map.
 */
export const listenPresenceForUsers = (
  userIds: number[],
  onUpdate: (map: Record<number, boolean>) => void,
) => {
  const ids = Array.from(new Set(userIds.map(n => String(n)))).filter(Boolean);
  if (ids.length === 0) {
    onUpdate({});
    return () => {};
  }

  const chunk = <T>(arr: T[], size: number) =>
    Array.from({length: Math.ceil(arr.length / size)}, (_, i) =>
      arr.slice(i * size, i * size + size),
    );

  const FieldPath = firestore.FieldPath;
  const idPath = FieldPath.documentId();

  const chunks = chunk(ids, 10);
  const unsubs: Array<() => void> = [];
  const latest: Record<number, boolean> = {};

  chunks.forEach(group => {
    const q = usersCol().where(idPath, 'in', group);
    const unsub = q.onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        const uid = Number(change.doc.id);
        const data = change.doc.data() as {status?: string};
        latest[uid] = data?.status === 'online';
      });
      onUpdate({...latest});
    });
    unsubs.push(unsub);
  });

  return () => unsubs.forEach(u => u());
};

/* ---------- Global stop handle so other screens (e.g., Settings) can stop it ---------- */
let currentStopper: null | (() => void) = null;

/** Store the active stopper (called by HomeScreen after starting tracking). */
export const setPresenceStopper = (stopFn: (() => void) | null) => {
  currentStopper = stopFn;
};

/** Stop presence tracking if running (used by Settings logout). */
export const stopPresenceIfAny = () => {
  try {
    currentStopper?.();
  } finally {
    currentStopper = null;
  }
};
