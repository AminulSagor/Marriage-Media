// src/services/chat.ts
import firestore, {
  FirebaseFirestoreTypes as FT,
} from '@react-native-firebase/firestore';
import {api} from '../api/client';
import {getToken} from '../storage/secureToken';
import axios from 'axios';

export type Conversation = {
  members: string[]; // ["1","4"]
  lastMessage?: string;
  lastAt?: FT.Timestamp | null;
  createdAt?: FT.Timestamp | null;

  lastSenderId?: string; // "1" | "4"
  lastReads?: Record<string, FT.Timestamp | null>; // { "1": ts, "4": ts }
  unreadFor?: Record<string, boolean>; // { "1": false, "4": true }

  // 🔹 NEW: simple global block flag for this conversation
  isBlocked?: boolean;
};

export type MessageDoc = {
  text: string;
  senderId: string; // "1"
  createdAt: FT.Timestamp | null; // serverTimestamp at write
};

export type Message = MessageDoc & {id: string};

// Deterministic 1-1 chat id
export const chatIdFor = (a: number, b: number) =>
  a < b ? `${a}_${b}` : `${b}_${a}`;

const convoDoc = (chatId: string) => firestore().doc(`conversations/${chatId}`);
const msgsCol = (chatId: string) =>
  firestore().collection(`conversations/${chatId}/messages`);

/** Create if missing and return chatId */
export const getOrCreate1to1 = async (
  me: number,
  peer: number,
  seedLastMessage = '',
) => {
  const chatId = chatIdFor(me, peer);
  const ref = convoDoc(chatId);
  const snap = await ref.get();

  if (!snap.exists) {
    const ts = firestore.FieldValue.serverTimestamp();
    await ref.set({
      members: [String(me), String(peer)],
      lastMessage: seedLastMessage,
      lastAt: ts as any,
      createdAt: ts as any,
      lastReads: {},
      lastSenderId: seedLastMessage ? String(me) : undefined,
      unreadFor: {[me]: false, [peer]: !!seedLastMessage},
      isBlocked: false, // 🔹 initialize
    } as Conversation);
  } else {
    // 🔹 Backfill isBlocked if missing on older docs
    const data = snap.data() as Conversation;
    if (typeof data.isBlocked === 'undefined') {
      await ref.set(
        {
          isBlocked: false,
        } as Partial<Conversation>,
        {merge: true},
      );
    }
  }

  return chatId;
};

export const sendMessage = async (
  fromId: number,
  toId: number,
  text: string,
) => {
  const chatId = chatIdFor(fromId, toId);
  const createdAt = firestore.FieldValue.serverTimestamp();

  // 🔹 Safety guard: don't send if conversation is globally blocked
  try {
    const snap = await convoDoc(chatId).get();
    if (snap.exists) {
      const data = snap.data() as Conversation;
      if (data.isBlocked) {
        console.log('sendMessage: conversation is blocked → skipping send');
        return;
      }
    }
  } catch (e) {
    console.log('sendMessage: block check failed, continuing', e);
    // if you want to be strict, you can `return` here instead
    // return;
  }

  // 1) add message
  await msgsCol(chatId).add({
    text,
    senderId: String(fromId),
    createdAt: createdAt as any,
  } as MessageDoc);

  // 2) update conversation summary + unread flags (atomic merge)
  await convoDoc(chatId).set(
    {
      members: [String(fromId), String(toId)],
      lastMessage: text,
      lastAt: createdAt as any,
      lastSenderId: String(fromId),
      [`unreadFor.${fromId}`]: false,
      [`unreadFor.${toId}`]: true,
    } as any,
    {merge: true},
  );
};

/** Mark this convo read for a user (updates lastReads.<userId> + unreadFor.<userId>=false) */
export const markConversationRead = async (chatId: string, userId: number) => {
  await convoDoc(chatId).set(
    {
      [`lastReads.${userId}`]: firestore.FieldValue.serverTimestamp(),
      [`unreadFor.${userId}`]: false,
    } as any,
    {merge: true},
  );
};

/** 🔹 Listen to conversation meta (isBlocked, unreadFor, etc.) */
export const listenConversationMeta = (
  chatId: string,
  onChange: (conv: Conversation | null) => void,
) => {
  return convoDoc(chatId).onSnapshot(snap => {
    if (!snap.exists) {
      onChange(null);
      return;
    }
    onChange(snap.data() as Conversation);
  });
};

/** 🔹 Mark this chat blocked (isBlocked = true for both sides) */
export const blockChat = async (chatId: string) => {
  await convoDoc(chatId).set(
    {
      isBlocked: true,
    } as Partial<Conversation>,
    {merge: true},
  );
};

/** 🔹 Mark this chat unblocked (isBlocked = false) */
export const unblockChat = async (chatId: string) => {
  await convoDoc(chatId).set(
    {
      isBlocked: false,
    } as Partial<Conversation>,
    {merge: true},
  );
};

/** Live newest page (desc). Use FlatList inverted for normal chat UX. */
export const listenLatest = (
  chatId: string,
  pageSize: number,
  onLoad: (items: Message[], lastDoc: FT.DocumentSnapshot | null) => void,
) => {
  return msgsCol(chatId)
    .orderBy('createdAt', 'desc')
    .limit(pageSize)
    .onSnapshot((snap: FT.QuerySnapshot<FT.DocumentData>) => {
      const docs = snap.docs as FT.QueryDocumentSnapshot<FT.DocumentData>[];
      const items: Message[] = docs.map(d => ({
        id: d.id,
        ...(d.data() as MessageDoc),
      }));
      const last = docs.length ? docs[docs.length - 1] : null;
      onLoad(items, last);
    });
};

/** Page older (desc) starting after lastDoc from previous page */
export const fetchOlder = async (
  chatId: string,
  afterDoc: FT.DocumentSnapshot | null,
  pageSize: number,
) => {
  if (!afterDoc)
    return {items: [] as Message[], last: null as FT.DocumentSnapshot | null};

  const snap = await msgsCol(chatId)
    .orderBy('createdAt', 'desc')
    .startAfter(afterDoc)
    .limit(pageSize)
    .get();

  const docs = snap.docs as FT.QueryDocumentSnapshot<FT.DocumentData>[];
  const items: Message[] = docs.map(d => ({
    id: d.id,
    ...(d.data() as MessageDoc),
  }));
  const last = docs.length ? docs[docs.length - 1] : null;
  return {items, last};
};

/** ---------- UPLOAD CHAT IMAGE ---------- **/

type UploadMsgImgResponse = {
  status: string;
  message: string;
  img_path: string;
};

export const uploadMessageImage = async (file: {
  uri: string;
  name?: string;
  type?: string;
}): Promise<string> => {
  const token = await getToken();
  if (!token) {
    throw new Error('No auth token found');
  }

  const form = new FormData();
  console.log(`${file.type} | ${file.name} | ${file.uri}`);

  form.append('img_path', {
    uri: file.uri,
    name: file.name ?? `chat_${Date.now()}.jpg`,
    type: file.type ?? 'image/jpeg',
  } as any);

  const res = await axios.post<UploadMsgImgResponse>(
    'https://aroosiapp.com/php/upload_img.php',
    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = res.data;

  if (!data || data.status !== 'success' || !data.img_path) {
    throw new Error(data?.message || 'Image upload failed');
  }
  console.log(`THE IMAGEPATH : ${data.img_path}`);
  return data.img_path;
};
