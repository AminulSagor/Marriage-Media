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
  Keyboard,
  KeyboardEvent,
  StatusBar,
  Alert,
  ScrollView, // ✅ added
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
  uploadMessageImage, // ✅ new
} from '../../services/chat';
import {blockUser} from '../../api/friends';

// 🔹 image picker
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';

import ImageViewer from 'react-native-image-zoom-viewer';

type RouteParams = {
  chatId: string;
  myId: number;
  peerId: number;
  peerName?: string;
  peerAvatar?: string;
};

const PAGE_SIZE = 25;

// reasons for reporting a user
const USER_REPORT_REASONS = [
  {id: 'spam', label: 'Spam or fake account'},
  {id: 'harassment', label: 'Harassment or bullying'},
  {id: 'hate', label: 'Hate speech or symbols'},
  {id: 'scam', label: 'Scam or fraud'},
  {id: 'inappropriate', label: 'Inappropriate or offensive messages'},
  {id: 'other', label: 'Other'},
] as const;

// simple helper – treat any http/https value as an image URL
const isImageUrl = (value: string) => /^https?:\/\//i.test(value);

const SingleChat = ({navigation}: {navigation: any}) => {
  const {params} = useRoute<any>();
  const {chatId, myId, peerName, peerAvatar, peerId} = params as RouteParams;

  const insets = useSafeAreaInsets();
  const [headerH, setHeaderH] = useState(56);
  const [inputH, setInputH] = useState(52);

  const [popupVisible, setPopupVisible] = useState(false);
  const [mute, setMute] = useState(false);
  const [block, setBlock] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [unblur, setUnblur] = useState(false);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [messagesDesc, setMessagesDesc] = useState<Message[]>([]);
  const [lastDoc, setLastDoc] = useState<any>(null);

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  // report user dialog state
  const [reportVisible, setReportVisible] = useState(false);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState('');
  const [sendingReport, setSendingReport] = useState(false);

  // image preview state (before upload)
  const [pendingImage, setPendingImage] = useState<Asset | null>(null);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [sendingImage, setSendingImage] = useState(false);

  // 🔹 full-screen image viewer
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);

  // --- Keyboard extra offset (adds a small cushion while visible) ---
  const [kbExtra, setKbExtra] = useState(0);
  useEffect(() => {
    const SHOW = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const HIDE = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (_e: KeyboardEvent) => setKbExtra(40);
    const onHide = () => setKbExtra(0);

    const s1 = Keyboard.addListener(SHOW, onShow);
    const s2 = Keyboard.addListener(HIDE, onHide);
    return () => {
      s1.remove();
      s2.remove();
    };
  }, []);

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

  // 🔹 back button: close full-screen image first, otherwise go back
  const handleBackPress = () => {
    if (fullImageUrl) {
      setFullImageUrl(null);
    } else {
      navigation.goBack();
    }
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

    const showAsImage = isImageUrl(item.text);

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
          {showAsImage ? (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setFullImageUrl(item.text)}>
              <Image
                source={{uri: item.text}}
                style={styles.msgImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : (
            <Text
              style={[
                styles.msgText,
                isMine ? styles.textMine : styles.textPeer,
              ]}>
              {item.text}
            </Text>
          )}
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

  // handle block toggle -> call /users/block when turned ON
  const handleToggleBlock = useCallback(
    async (value: boolean) => {
      setBlock(value);

      if (value && !blocking) {
        try {
          setBlocking(true);
          await blockUser(peerId);
        } catch (err) {
          console.log('Failed to block user', err);
          setBlock(false);
        } finally {
          setBlocking(false);
        }
      }
    },
    [peerId, blocking],
  );

  // report dialog handlers
  const openReportDialog = () => {
    setPopupVisible(false);
    setReportReason(null);
    setReportDetails('');
    setReportVisible(true);
  };

  const closeReportDialog = () => {
    if (sendingReport) return;
    setReportVisible(false);
    setReportReason(null);
    setReportDetails('');
  };

  const submitReport = () => {
    if (!reportReason || sendingReport) return;

    const reasonLabel =
      USER_REPORT_REASONS.find(r => r.id === reportReason)?.label ??
      reportReason;

    const trimmedDetails = reportDetails.trim();
    const combinedText = trimmedDetails
      ? `${reasonLabel}: ${trimmedDetails}`
      : reasonLabel;

    // No backend endpoint provided yet, so just show a confirmation.
    setSendingReport(true);
    setTimeout(() => {
      setSendingReport(false);
      Alert.alert(
        'Report submitted',
        'Thanks for letting us know. We will review this conversation.',
      );
      closeReportDialog();
      console.log('User report payload:', {
        peerId,
        report_text: combinedText,
      });
    }, 500);
  };

  // ---------- image picker handlers ----------

  const handlePickedAsset = (asset?: Asset) => {
    if (!asset || !asset.uri) return;
    setPendingImage(asset);
    setImagePreviewVisible(true);
  };

  const openCameraPicker = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('Camera error:', response.errorMessage);
          Alert.alert('Camera error', 'Could not open camera.');
          return;
        }
        const asset = response.assets?.[0];
        handlePickedAsset(asset);
      },
    );
  };

  const openGalleryPicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          console.log('Image picker error:', response.errorMessage);
          Alert.alert('Image error', 'Could not select image.');
          return;
        }
        const asset = response.assets?.[0];
        handlePickedAsset(asset);
      },
    );
  };

  const handleCancelImage = () => {
    if (sendingImage) return;
    setImagePreviewVisible(false);
    setPendingImage(null);
  };

  const handleSendImage = async () => {
    if (!pendingImage?.uri || sendingImage) return;
    try {
      setSendingImage(true);

      // ✅ upload image and get URL
      const url = await uploadMessageImage({
        uri: pendingImage.uri,
        name: pendingImage.fileName ?? undefined,
        type: pendingImage.type ?? undefined,
      });

      // ✅ send URL as plain text message
      await sendMessage(myId, peerId, url);
      markConversationRead(chatId, myId).catch(() => {});

      setImagePreviewVisible(false);
      setPendingImage(null);
    } catch (err) {
      console.log('Send image failed', err);
      Alert.alert('Failed to send image', 'Please try again.');
    } finally {
      setSendingImage(false);
    }
  };

  const closeFullImage = () => setFullImageUrl(null);

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
          <TouchableOpacity onPress={handleBackPress}>
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
          <TouchableOpacity onPress={openCameraPicker}>
            <Icon name="camera" size={22} color="#ff4f91" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openGalleryPicker}>
            <Icon name="images" size={22} color="#ff4f91" />
          </TouchableOpacity>
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

        {/* Info popup */}
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
              <View style={styles.row}>
                <Text style={styles.text}>Block this person</Text>
                <Switch
                  value={block}
                  disabled={blocking}
                  onValueChange={handleToggleBlock}
                />
              </View>
              <TouchableOpacity style={styles.row} onPress={openReportDialog}>
                <Text style={[styles.text, {color: 'red', marginLeft: 6}]}>
                  Report this person
                </Text>
                <Icon name="warning-outline" size={18} color="red" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Report user dialog */}
        <Modal
          visible={reportVisible}
          transparent
          animationType="fade"
          onRequestClose={closeReportDialog}>
          <View style={styles.modalOverlay}>
            <View style={styles.reportBox}>
              <View style={styles.reportHeaderRow}>
                <Icon name="flag" size={22} color="#f04b60" />
                <Text style={styles.reportTitle}>Report this user</Text>
              </View>

              <Text style={styles.reportMessage}>
                If this person is behaving inappropriately, you can report them.
                We will review recent messages and may restrict their account if
                they violate our community guidelines.
              </Text>

              <Text style={styles.reportSectionTitle}>Choose a reason</Text>
              {USER_REPORT_REASONS.map(r => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.reasonRow}
                  onPress={() => setReportReason(r.id)}>
                  <Icon
                    name={
                      reportReason === r.id
                        ? 'radio-button-on'
                        : 'radio-button-off'
                    }
                    size={20}
                    color={reportReason === r.id ? '#f04b60' : '#999'}
                  />
                  <Text style={styles.reasonText}>{r.label}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.reportSectionTitle}>
                Add details (optional)
              </Text>
              <TextInput
                style={styles.detailsInput}
                placeholder="Describe what happened..."
                placeholderTextColor="#999"
                multiline
                value={reportDetails}
                onChangeText={setReportDetails}
              />

              <View style={styles.reportButtonsRow}>
                <TouchableOpacity
                  style={[styles.reportButton, styles.reportCancelButton]}
                  onPress={closeReportDialog}
                  disabled={sendingReport}>
                  <Text style={[styles.reportButtonText, {color: '#f04b60'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.reportButton,
                    {
                      backgroundColor:
                        reportReason && !sendingReport ? '#f04b60' : '#f7b6c5',
                    },
                  ]}
                  disabled={!reportReason || sendingReport}
                  onPress={submitReport}>
                  <Text style={[styles.reportButtonText, {color: '#fff'}]}>
                    {sendingReport ? 'Sending...' : 'Send Report'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Image preview dialog (before upload) */}
        <Modal
          visible={imagePreviewVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelImage}>
          <View style={styles.modalOverlay}>
            <View style={styles.imagePreviewBox}>
              {pendingImage?.uri ? (
                <Image
                  source={{uri: pendingImage.uri}}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
              ) : null}

              <View style={styles.previewButtonsRow}>
                <TouchableOpacity
                  style={[styles.previewButton, styles.previewCancelButton]}
                  onPress={handleCancelImage}
                  disabled={sendingImage}>
                  <Text style={[styles.previewButtonText, {color: '#f04b60'}]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.previewButton,
                    {
                      backgroundColor: sendingImage ? '#f7b6c5' : '#f04b60',
                    },
                  ]}
                  onPress={handleSendImage}
                  disabled={sendingImage}>
                  <Text style={[styles.previewButtonText, {color: '#fff'}]}>
                    {sendingImage ? 'Sending...' : 'Send'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* 🔹 Full-screen image viewer with pinch-zoom (iOS + Android) */}
        <Modal
          visible={!!fullImageUrl}
          transparent={true}
          animationType="fade"
          onRequestClose={closeFullImage}>
          <View style={styles.fullscreenContainer}>
            {/* close button overlay */}
            <TouchableOpacity
              style={styles.fullscreenBackBtn}
              onPress={closeFullImage}>
              <Icon name="close" size={30} color="#fff" />
            </TouchableOpacity>

            {fullImageUrl ? (
              <ImageViewer
                imageUrls={[{url: fullImageUrl}]}
                enableSwipeDown
                onSwipeDown={closeFullImage}
                onCancel={closeFullImage}
                backgroundColor="#000"
                saveToLocalByLongPress={false} // optional: disable save dialog
              />
            ) : null}
          </View>
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
  msgImage: {
    width: 220,
    height: 260,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginBottom: 4,
    overflow: 'hidden',
  },

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

  // report dialog styles
  reportBox: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
  },
  reportHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reportTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  reportMessage: {
    fontSize: 13,
    color: '#333',
    backgroundColor: '#f7f0f3',
    padding: 10,
    borderRadius: 12,
    lineHeight: 18,
  },
  reportSectionTitle: {
    marginTop: 14,
    marginBottom: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  reasonText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  detailsInput: {
    marginTop: 8,
    minHeight: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  reportButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  reportButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  reportCancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f04b60',
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // image preview styles
  imagePreviewBox: {
    width: '88%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
  },
  previewImage: {
    width: '100%',
    height: 260,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  previewButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  previewButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  previewCancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f04b60',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenBackBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
});
