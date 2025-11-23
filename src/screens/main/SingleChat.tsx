// src/screens/SingleChat.tsx
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Switch,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  LayoutChangeEvent,
  Keyboard, // ⬅️ NEW
  KeyboardEvent, // ⬅️ NEW
  StatusBar,
} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  fetchOlder,
  listenLatest,
  sendMessage,
  Message,
  markConversationRead,
} from '../../services/chat';

type RouteParams = {
  chatId: string;
  myId: number;
  peerId: number;
  peerName?: string;
  peerAvatar?: string;
};

const PAGE_SIZE = 25;

const SingleChat = ({navigation}: {navigation: any}) => {
  const {params} = useRoute<any>();
  const {chatId, myId, peerName, peerAvatar, peerId} = params as RouteParams;

  const insets = useSafeAreaInsets();
  const [headerH, setHeaderH] = useState(56);
  const [inputH, setInputH] = useState(52);

  const [popupVisible, setPopupVisible] = useState(false);
  const [mute, setMute] = useState(false);
  const [block, setBlock] = useState(false);
  const [unblur, setUnblur] = useState(false);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [messagesDesc, setMessagesDesc] = useState<Message[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // --- Keyboard extra offset (adds a small cushion while visible) ---
  const [kbExtra, setKbExtra] = useState(0);
  useEffect(() => {
    const SHOW = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const HIDE = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (_e: KeyboardEvent) => setKbExtra(40); // small cushion
    const onHide = () => setKbExtra(0);

    const s1 = Keyboard.addListener(SHOW, onShow);
    const s2 = Keyboard.addListener(HIDE, onHide);
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

  // iOS needs a vertical offset equal to status bar + header.
  // Android relies on adjustResize (see manifest step below), but we still keep a tiny kbExtra for parity.
  const keyboardOffset = useMemo(
    () => (Platform.OS === 'ios' ? insets.top + headerH + kbExtra : kbExtra),
    [insets.top, headerH, kbExtra],
  );

  // Hide bottom tab + mark read
  useFocusEffect(
    useCallback(() => {
      const tabNavigator = navigation.getParent()?.getParent();
      tabNavigator?.setOptions({tabBarStyle: {display: 'none'}});
      markConversationRead(chatId, myId).catch(() => {});
      return () => {
        markConversationRead(chatId, myId).catch(() => {});
        tabNavigator?.setOptions({tabBarStyle: undefined});
      };
    }, [navigation, chatId, myId]),
  );

  useEffect(() => {
    navigation.setOptions({title: peerName ?? `Chat`});
  }, [navigation, peerName]);

  useEffect(() => {
    setLoadingInitial(true);
    const unsub = listenLatest(chatId, PAGE_SIZE, (items, last) => {
      setMessagesDesc(items);
      setLastDoc(last);
      setLoadingInitial(false);

      const newest = items[0];
      if (newest && newest.senderId !== String(myId)) {
        markConversationRead(chatId, myId).catch(() => {});
      }
    });
    return unsub;
  }, [chatId, myId]);

  const onEndReached = useCallback(async () => {
    if (!lastDoc || loadingInitial) return;
    const {items, last} = await fetchOlder(chatId, lastDoc, PAGE_SIZE);
    if (items.length) {
      setMessagesDesc(prev => [...prev, ...items]);
      setLastDoc(last);
    }
  }, [chatId, lastDoc, loadingInitial]);

  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    try {
      await sendMessage(myId, peerId, text);
      setInput('');
      markConversationRead(chatId, myId).catch(() => {});
    } finally {
      setSending(false);
    }
  }, [input, sending, myId, peerId, chatId]);

  const onHeaderLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setHeaderH(h);
  };
  const onInputLayout = (e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setInputH(h);
  };

  const renderItem = ({item}: {item: Message}) => {
    const isMine = item.senderId === String(myId);
    const ts =
      item.createdAt && 'toDate' in item.createdAt
        ? item.createdAt.toDate()
        : null;
    const time = ts
      ? ts.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
      : '…';

    return (
      <View style={[styles.msgRow, isMine ? styles.rowMine : styles.rowPeer]}>
        {!isMine && (
          <Image
            source={{uri: peerAvatar || 'https://placehold.co/28x28'}}
            style={styles.msgAvatar}
          />
        )}
        <View
          style={[
            styles.msgBubble,
            isMine ? styles.bubbleMine : styles.bubblePeer,
          ]}>
          <Text
            style={[
              styles.msgText,
              isMine ? styles.textMine : styles.textPeer,
            ]}>
            {item.text}
          </Text>
          <Text
            style={[
              styles.msgTime,
              isMine ? styles.timeMine : styles.timePeer,
            ]}>
            {time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeRoot} edges={['left', 'right']}>
      <StatusBar backgroundColor="#ffb6c9" barStyle="dark-content" />
      <View style={[styles.topSafeFill, {height: insets.top}]} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}>
        {/* Header strip */}
        <View style={[styles.header]} onLayout={onHeaderLayout}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Image
            source={{uri: peerAvatar || 'https://placehold.co/32x32'}}
            style={styles.avatar}
          />
          <Text style={styles.username} numberOfLines={1}>
            {peerName ?? 'Chat'}
          </Text>
          <View style={styles.headerIcons}>
            {/* Commented For Now */}
            {/* <Icon name="call" size={22} color="#ff4f91" style={styles.icon} />
            <Icon
              name="videocam"
              size={22}
              color="#ff4f91"
              style={styles.icon}
            /> */}
            <TouchableOpacity onPress={() => setPopupVisible(true)}>
              <Icon name="information-circle" size={22} color="#ff4f91" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <View style={styles.chatBody}>
          {loadingInitial ? (
            <View style={{alignItems: 'center', padding: 12}}>
              <ActivityIndicator />
              <Text style={{color: '#888', marginTop: 4}}>Loading…</Text>
            </View>
          ) : (
            <FlatList
              data={messagesDesc}
              keyExtractor={m => m.id}
              renderItem={renderItem}
              inverted
              onEndReachedThreshold={0.1}
              onEndReached={onEndReached}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode={
                Platform.OS === 'ios' ? 'interactive' : 'on-drag'
              }
              contentContainerStyle={{
                paddingVertical: 8,
                // keep last bubble clear of input bar + bottom inset
                paddingBottom: inputH + insets.bottom + 8,
              }}
            />
          )}
        </View>

        {/* Input bar */}
        <View
          style={[
            styles.inputArea,
            {paddingBottom: Math.max(10, insets.bottom)},
          ]}
          onLayout={onInputLayout}>
          <Icon name="camera" size={22} color="#ff4f91" />
          <Icon name="images" size={22} color="#ff4f91" />
          {/* <Icon name="mic" size={22} color="#ff4f91" /> */}
          <TextInput
            placeholder="Aa"
            style={styles.input}
            value={input}
            onChangeText={setInput}
            multiline={false}
            blurOnSubmit={false}
            returnKeyType="send"
            enablesReturnKeyAutomatically
            onSubmitEditing={onSend}
          />
          <TouchableOpacity
            onPress={onSend}
            disabled={!input.trim() || sending}>
            <Icon
              name="send"
              size={22}
              color={input.trim() && !sending ? '#ff4f91' : '#ccc'}
            />
          </TouchableOpacity>
        </View>

        {/* Popup */}
        <Modal
          visible={popupVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPopupVisible(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPressOut={() => setPopupVisible(false)}>
            <View style={styles.popup}>
              {/* Commented For Now */}
              {/* <View style={styles.row}>
                <Text style={styles.text}>Mute audio / video calls</Text>
                <Switch value={mute} onValueChange={setMute} />
              </View> */}
              <View style={styles.row}>
                <Text style={styles.text}>Block this person</Text>
                <Switch value={block} onValueChange={setBlock} />
              </View>
              <TouchableOpacity style={styles.row}>
                <Text style={[styles.text, {color: 'red', marginLeft: 6}]}>
                  Report this person
                </Text>
                <Icon name="warning-outline" size={18} color="red" />
              </TouchableOpacity>
              <View style={styles.row}>
                <Text style={styles.text}>Unblur my photo</Text>
                <Switch value={unblur} onValueChange={setUnblur} />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SingleChat;

const styles = StyleSheet.create({
  safeRoot: {flex: 1, backgroundColor: '#ffe6f0'},
  container: {flex: 1},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffb6c9',
    paddingHorizontal: 12,
    paddingBottom: 14,
    paddingTop: 14,
  },
  avatar: {width: 32, height: 32, borderRadius: 16, marginHorizontal: 6},
  username: {flex: 1, fontWeight: '600', fontSize: 16, color: '#000'},
  headerIcons: {flexDirection: 'row', alignItems: 'center'},
  icon: {marginHorizontal: 6},
  chatBody: {flex: 1, paddingHorizontal: 12, paddingTop: 8},

  msgRow: {flexDirection: 'row', marginVertical: 4, alignItems: 'flex-end'},
  rowMine: {justifyContent: 'flex-end'},
  rowPeer: {justifyContent: 'flex-start'},
  msgAvatar: {width: 28, height: 28, borderRadius: 14, marginRight: 6},
  msgBubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '80%',
  },
  bubbleMine: {backgroundColor: '#ff8fc5', alignSelf: 'flex-end'},
  bubblePeer: {backgroundColor: '#fff', alignSelf: 'flex-start'},
  msgText: {fontSize: 15},
  textMine: {color: '#fff'},
  textPeer: {color: '#111'},
  msgTime: {fontSize: 10, marginTop: 4, alignSelf: 'flex-end'},
  timeMine: {color: 'rgba(255,255,255,0.85)'},
  timePeer: {color: '#666'},

  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    gap: 10,
    borderTopColor: '#eee',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ios: 10, android: 6}),
    color: '#000',
    maxHeight: 120,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  text: {fontSize: 15, color: '#000'},
  topSafeFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffb6c9',
  },
});
