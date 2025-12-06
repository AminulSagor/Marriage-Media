// src/screens/ChatScreen.tsx
import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useQuery} from '@tanstack/react-query';
import firestore, {
  FirebaseFirestoreTypes as FT,
} from '@react-native-firebase/firestore';

import {fetchProfile} from '../../api/profile';
import {fetchAllFriends, Friend} from '../../api/friends';
import {API_BASE_URL} from '../../config/env';
import {getOrCreate1to1, markConversationRead} from '../../services/chat';
import {listenPresenceForUsers} from '../../services/presence'; // ⬅️ keep only listeners

type ChatScreenProps = {navigation: any};

type ConversationRow = {
  chatId: string;
  peerId: number;
  peerName: string;
  peerAvatar?: string;
  lastMessage?: string;
  lastAt?: Date | null;
  unread?: boolean;
};

const PAGE = 20;

const avatarFromPath = (pro_path?: string | null) =>
  pro_path ? `${API_BASE_URL}/${pro_path}` : 'https://placehold.co/80x80';

const timeStr = (d?: Date | null) =>
  d ? d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) : '';

const toJsDate = (t: any): Date | null => {
  if (!t) return null;
  if (typeof t.toDate === 'function') return t.toDate();
  if (t instanceof Date) return t;
  if (typeof t.seconds === 'number') {
    return new Date(t.seconds * 1000 + Math.floor((t.nanoseconds || 0) / 1e6));
  }
  return null;
};

const ChatScreen: React.FC<ChatScreenProps> = ({navigation}) => {
  // ---- data from API ----
  const {data: me} = useQuery({
    queryKey: ['me-profile'],
    queryFn: fetchProfile,
  });
  const {data: friendsRes} = useQuery({
    queryKey: ['friends-all'],
    queryFn: fetchAllFriends,
  });
  const friends: Friend[] = friendsRes?.data ?? [];

  // 🔊 Listen to friends presence map { [id]: true }
  const [onlineMap, setOnlineMap] = useState<Record<number, boolean>>({});
  useEffect(() => {
    if (!friends?.length) {
      setOnlineMap({});
      return;
    }
    const ids = friends.map(f => f.user_id);
    const unsub = listenPresenceForUsers(ids, map => setOnlineMap(map));
    return unsub;
  }, [friends]);

  // quick lookup for peer info
  const friendMap = useMemo(() => {
    const m = new Map<number, Friend>();
    friends.forEach(f => m.set(f.user_id, f));
    return m;
  }, [friends]);

  // header search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState('');

  // conversations + pagination
  const [convos, setConvos] = useState<ConversationRow[]>([]);
  const [lastDoc, setLastDoc] =
    useState<FT.QueryDocumentSnapshot<FT.DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // open/create 1-1 chat
  const openFriendChat = useCallback(
    async (friend: Friend) => {
      if (!me?.id) return;
      const chatId = await getOrCreate1to1(me.id, friend.user_id);
      setConvos(prev =>
        prev.map(c => (c.chatId === chatId ? {...c, unread: false} : c)),
      );
      markConversationRead(chatId, me.id).catch(() => {});
      navigation.navigate('SingleChat', {
        chatId,
        myId: me.id,
        peerId: friend.user_id,
        peerName: friend.name,
        peerAvatar: avatarFromPath(friend.pro_path),
      });
    },
    [me?.id, navigation],
  );

  // open conversation
  const openConversation = useCallback(
    async (row: ConversationRow) => {
      if (me?.id) {
        setConvos(prev =>
          prev.map(c => (c.chatId === row.chatId ? {...c, unread: false} : c)),
        );
        markConversationRead(row.chatId, me.id).catch(() => {});
      }
      navigation.navigate('SingleChat', {
        chatId: row.chatId,
        myId: me?.id,
        peerId: row.peerId,
        peerName: row.peerName,
        peerAvatar: row.peerAvatar,
      });
    },
    [me?.id, navigation],
  );

  // conversations listener
  useEffect(() => {
    if (!me?.id) return;
    setInitialLoading(true);

    const myIdStr = String(me.id);
    const baseRef = firestore()
      .collection('conversations')
      .where('members', 'array-contains', myIdStr)
      .orderBy('lastAt', 'desc');

    const mapDoc = (d: FT.QueryDocumentSnapshot<FT.DocumentData>) => {
      const data = d.data() as {
        members: string[];
        lastMessage?: string;
        lastAt?: any;
        lastSenderId?: string | number;
        [key: string]: any;
      };

      let peerIdNum: number;
      if (d.id.includes('_')) {
        const [a, b] = d.id.split('_');
        peerIdNum = Number(a) === me.id ? Number(b) : Number(a);
      } else {
        const peerIdStr = (data.members || []).find(m => m !== myIdStr) ?? '';
        peerIdNum = Number(peerIdStr);
      }

      const friend = friendMap.get(peerIdNum);
      const peerName = friend?.name ?? `User ${peerIdNum}`;
      const peerAvatar = friend?.pro_path
        ? `${API_BASE_URL}/${friend.pro_path}`
        : 'https://placehold.co/80x80';

      const lastAtDate = toJsDate(data.lastAt);
      const myReadTs = toJsDate(data[`lastReads.${myIdStr}`]);
      const lastSender =
        data.lastSenderId == null ? undefined : String(data.lastSenderId);
      const unreadFromFlag = data[`unreadFor.${myIdStr}`];
      const unreadFallback =
        !!lastAtDate &&
        lastSender !== myIdStr &&
        (!myReadTs || lastAtDate.getTime() > myReadTs.getTime());
      const isUnread =
        typeof unreadFromFlag === 'boolean' ? unreadFromFlag : unreadFallback;

      return {
        chatId: d.id,
        peerId: peerIdNum,
        peerName,
        peerAvatar,
        lastMessage: data.lastMessage ?? '',
        lastAt: lastAtDate,
        unread: isUnread,
      } as ConversationRow;
    };

    const unsub = baseRef.limit(PAGE).onSnapshot(
      snap => {
        const rows = snap.docs.map(mapDoc);
        setConvos(rows);
        setLastDoc(snap.docs.length ? snap.docs[snap.docs.length - 1] : null);
        setInitialLoading(false);
      },
      err => {
        if (__DEV__) console.log('conversations listen error:', err);
        setInitialLoading(false);
      },
    );

    return unsub;
  }, [me?.id, friendMap]);

  const loadMoreConvos = useCallback(async () => {
    if (!me?.id || !lastDoc || loadingMore) return;
    setLoadingMore(true);

    try {
      const myIdStr = String(me.id);
      const snap = await firestore()
        .collection('conversations')
        .where('members', 'array-contains', myIdStr)
        .orderBy('lastAt', 'desc')
        .startAfter(lastDoc)
        .limit(PAGE)
        .get();

      const more = snap.docs.map(d => {
        const data = d.data() as any;

        let peerIdNum: number;
        if (d.id.includes('_')) {
          const [a, b] = d.id.split('_');
          peerIdNum = Number(a) === me.id ? Number(b) : Number(a);
        } else {
          const peerIdStr =
            (data.members || []).find((m: string) => m !== myIdStr) ?? '';
          peerIdNum = Number(peerIdStr);
        }

        const friend = friendMap.get(peerIdNum);
        const peerName = friend?.name ?? `User ${peerIdNum}`;
        const peerAvatar = friend?.pro_path
          ? `${API_BASE_URL}/${friend.pro_path}`
          : 'https://placehold.co/80x80';

        const lastAtDate = toJsDate(data.lastAt);
        const myReadTs = toJsDate(data[`lastReads.${myIdStr}`]);
        const lastSender =
          data.lastSenderId == null ? undefined : String(data.lastSenderId);
        const unreadFromFlag = data[`unreadFor.${myIdStr}`];
        const unreadFallback =
          !!lastAtDate &&
          lastSender !== myIdStr &&
          (!myReadTs || lastAtDate.getTime() > myReadTs.getTime());
        const isUnread =
          typeof unreadFromFlag === 'boolean' ? unreadFromFlag : unreadFallback;

        return {
          chatId: d.id,
          peerId: peerIdNum,
          peerName,
          peerAvatar,
          lastMessage: data.lastMessage ?? '',
          lastAt: lastAtDate,
          unread: isUnread,
        } as ConversationRow;
      });

      setConvos(prev => [...prev, ...more]);
      setLastDoc(snap.docs.length ? snap.docs[snap.docs.length - 1] : null);
    } finally {
      setLoadingMore(false);
    }
  }, [me?.id, lastDoc, loadingMore, friendMap]);

  const filtered = useMemo(() => {
    if (!isSearching || !searchText.trim()) return convos;
    const q = searchText.trim().toLowerCase();
    return convos.filter(c => c.peerName.toLowerCase().includes(q));
  }, [isSearching, searchText, convos]);

  const myAvatarUri =
    me?.image_one || me?.pro_path
      ? `${API_BASE_URL}/${me?.image_one || me?.pro_path}`
      : 'https://placehold.co/36x36';

  const renderOnlineUser = ({item}: {item: Friend}) => {
    const isOnline = !!onlineMap[item.user_id];
    return (
      <TouchableOpacity
        onPress={() => openFriendChat(item)}
        style={styles.onlineUser}>
        <View>
          <Image
            source={{uri: avatarFromPath(item.pro_path)}}
            style={styles.onlineAvatar}
          />
          {isOnline && <View style={styles.onlineDot} />}
        </View>
        <Text style={styles.onlineName} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderConversation = ({item}: {item: ConversationRow}) => {
    const isOnline = !!onlineMap[item.peerId];
    return (
      <TouchableOpacity
        onPress={() => openConversation(item)}
        style={[styles.messageItem, item.unread && styles.messageItemUnread]}>
        <View style={{marginRight: 12}}>
          <Image source={{uri: item.peerAvatar}} style={styles.avatar} />
          {isOnline && <View style={styles.presenceDot} />}
        </View>
        <View style={styles.messageContent}>
          <Text
            style={[styles.name, item.unread && styles.nameUnread]}
            numberOfLines={1}>
            {item.peerName}
          </Text>
          <Text
            style={[styles.message, item.unread && styles.messageUnread]}
            numberOfLines={1}>
            {item.lastMessage || 'Start the conversation'}
          </Text>
        </View>
        <View style={styles.meta}>
          {item.unread ? (
            <View style={styles.unreadDot} />
          ) : (
            <View style={{height: 8}} />
          )}
          <Text style={[styles.time, item.unread && styles.timeUnread]}>
            {timeStr(item.lastAt)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#ffb6c9" // Android only
      />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={{uri: myAvatarUri}} style={styles.profilePic} />
          {!isSearching ? (
            <>
              <Text style={styles.title}>Inbox ({convos.length})</Text>
              <Icon
                name="search-outline"
                size={24}
                color="#ff4081"
                style={{marginLeft: 'auto'}}
                onPress={() => setIsSearching(true)}
              />
            </>
          ) : (
            <>
              <TextInput
                autoFocus
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search by username"
                placeholderTextColor="#888"
                style={styles.searchInput}
              />
              <TouchableOpacity
                onPress={() => {
                  setIsSearching(false);
                  setSearchText('');
                }}>
                <Icon name="close-outline" size={26} color="#ff4081" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Online users */}
        <View style={styles.onlineContainer}>
          <FlatList
            data={friends}
            horizontal
            keyExtractor={f => String(f.user_id)}
            renderItem={renderOnlineUser}
            style={styles.onlineList}
            contentContainerStyle={styles.onlineContent}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={null}
          />
        </View>

        <View style={styles.tag}>
          <Text style={styles.tagText}>All Chats</Text>
        </View>

        {/* Chats list */}
        {initialLoading ? (
          <View style={{alignItems: 'center', paddingVertical: 16}}>
            <ActivityIndicator />
            <Text style={{color: '#777', marginTop: 4}}>Loading…</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={c => c.chatId}
            renderItem={renderConversation}
            contentContainerStyle={{paddingBottom: 80}}
            ListEmptyComponent={
              <View style={{alignItems: 'center', padding: 24}}>
                <Text style={{color: '#777'}}>No conversations yet.</Text>
              </View>
            }
            onEndReachedThreshold={0.2}
            onEndReached={loadMoreConvos}
            ListFooterComponent={
              loadingMore ? (
                <View style={{paddingVertical: 12}}>
                  <ActivityIndicator />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFEFF5'},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe1ec',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    gap: 10,
  },
  profilePic: {width: 36, height: 36, borderRadius: 18},
  title: {fontSize: 18, fontWeight: 'bold', color: '#111', marginLeft: 8},
  searchInput: {
    flex: 1,
    height: 38,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 12,
    color: '#000',
  },

  // top friends
  onlineUser: {alignItems: 'center', marginRight: 12, width: 60},
  onlineAvatar: {width: 50, height: 50, borderRadius: 25},
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: '#4cd964',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineName: {fontSize: 12, marginTop: 4, color: '#444'},
  onlineContainer: {height: 86, paddingVertical: 6},
  onlineList: {flexGrow: 0},
  onlineContent: {paddingHorizontal: 10},

  // conversation tile
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.4,
    borderColor: '#ddd',
    backgroundColor: '#FFEFF5',
  },
  messageItemUnread: {backgroundColor: '#ffe1ec'},
  avatar: {width: 48, height: 48, borderRadius: 24},
  presenceDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: '#4cd964',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  messageContent: {flex: 1, marginLeft: 12},
  name: {fontSize: 15, color: '#111'},
  nameUnread: {fontWeight: '700', color: '#111'},
  message: {fontSize: 13, color: '#777'},
  messageUnread: {color: '#ff4081'},
  meta: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 40,
    minWidth: 48,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4081',
    marginBottom: 4,
  },
  time: {fontSize: 12, color: '#888'},
  timeUnread: {color: '#ff4081', fontWeight: '600'},

  tag: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#ff4081',
    alignSelf: 'flex-start',
  },
  tagText: {color: '#fff', fontWeight: 'bold'},
});
