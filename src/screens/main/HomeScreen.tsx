import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import PostModal from '../../Components/PostModal';
import {
  fetchFeedPage,
  FeedPost,
  createPost,
  PostImageFile,
  reactToPost,
  reportPost, // 🔹 NEW
} from '../../api/posts';
import {API_BASE_URL} from '../../config/env';

// NEW: friends API
import {fetchFriendList, Friend} from '../../api/friends';

// gesture-handler
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

// detached UI parts
import PostCounts from '../../Components/PostCounts';
import ReactorsBottomSheet from '../../Components/ReactorsBottomSheet';
import CommentsBottomSheet from '../../Components/CommentsBottomSheet';

import {fetchProfile} from '../../api/profile';
import {
  ensurePresenceDoc,
  startPresenceTracking,
  setPresenceStopper,
  stopPresenceIfAny,
} from '../../services/presence';

// 🔹 zoomable viewer (same lib as SingleChat)
import ImageViewer from 'react-native-image-zoom-viewer';

interface HomeScreenProps {
  navigation: any;
}

const PAGE_SIZE = 10;

// reasons for report dialog
const REPORT_REASONS = [
  {id: 'spam', label: 'Spam or misleading'},
  {id: 'hate', label: 'Hate/harassment'},
  {id: 'nudity', label: 'Nudity/sexual content'},
  {id: 'illegal', label: 'Illegal or dangerous'},
  {id: 'violence', label: 'Violence or gore'},
  {id: 'other', label: 'Other'},
] as const;

/** Small card component so each post can manage its own heart animation */
const PostCard: React.FC<{
  item: FeedPost;
  onOpenReacts: (postId: number) => void;
  onOpenComments: (postId: number) => void;
  onDoubleTapReact: (postId: number) => void;
  onOpenReport: (post: FeedPost) => void;
  onOpenImage: (url: string) => void; // 🔹 added
}> = ({
  item,
  onOpenReacts,
  onOpenComments,
  onDoubleTapReact,
  onOpenReport,
  onOpenImage,
}) => {
  const avatarUri = item.pro_path
    ? `${API_BASE_URL}/${item.pro_path}`
    : undefined;
  const postUri = item.image_path
    ? `${API_BASE_URL}/${item.image_path}`
    : undefined;

  // heart animation
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = scale.interpolate({inputRange: [0, 1], outputRange: [0, 1]});

  const showHeart = () => {
    scale.setValue(0);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1,
        duration: 160,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(300),
      Animated.timing(scale, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 🔹 single tap → open image (if exists)
  const singleTap = Gesture.Tap()
    .maxDelay(250)
    .onEnd((_event, success) => {
      if (success && postUri) {
        onOpenImage(postUri);
      }
    });

  // 🔹 double tap → like + heart, NO fullscreen
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd((_event, success) => {
      if (success) {
        showHeart();
        onDoubleTapReact(item.id);
      }
    });

  const tapGesture = Gesture.Exclusive(doubleTap, singleTap);

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        {avatarUri ? (
          <Image source={{uri: avatarUri}} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, {backgroundColor: '#ddd'}]} />
        )}

        <View>
          <Text style={styles.userName}>{item.name || 'Unknown user'}</Text>
          {item.created_at && (
            <Text style={styles.time}>
              {new Date(item.created_at).toLocaleString()}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={{marginLeft: 'auto', padding: 4}}
          onPress={() => onOpenReport(item)}>
          <Icon name="ellipsis-vertical" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Wrap image + caption in the double-tap area so text also reacts */}
      <GestureDetector gesture={tapGesture}>
        <View>
          {/* If no image, show nothing – just caption below */}
          {postUri ? (
            // ❌ removed TouchableOpacity here so double tap doesn’t trigger onPress
            <Image source={{uri: postUri}} style={styles.postImage} />
          ) : null}

          {/* Heart overlay */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heartOverlay,
              {
                opacity,
                transform: [
                  {
                    scale: scale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.7, 1],
                    }),
                  },
                ],
              },
            ]}>
            <Icon name="heart" size={96} color="#ff2d55" />
          </Animated.View>

          {item.caption ? (
            <Text style={styles.postText}>{item.caption}</Text>
          ) : null}
        </View>
      </GestureDetector>

      <PostCounts
        postId={item.id}
        onPressReacts={onOpenReacts}
        onPressComments={onOpenComments}
      />
    </View>
  );
};

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const [reactSheetVisible, setReactSheetVisible] = useState(false);
  const [reactSheetPostId, setReactSheetPostId] = useState<number | null>(null);

  const [commentSheetVisible, setCommentSheetVisible] = useState(false);
  const [commentSheetPostId, setCommentSheetPostId] = useState<number | null>(
    null,
  );

  // report dialog state
  const [reportPostData, setReportPostData] = useState<FeedPost | null>(null);
  const [reportReason, setReportReason] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState('');

  // 🔹 full-screen image viewer state
  const [fullImageUrl, setFullImageUrl] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const {data: me} = useQuery({
    queryKey: ['me-profile'],
    queryFn: fetchProfile,
  });

  // presence tracking
  React.useEffect(() => {
    if (!me?.id) return;

    (async () => {
      stopPresenceIfAny();
      await ensurePresenceDoc(me.id);
      const stop = await startPresenceTracking(me.id);
      setPresenceStopper(stop);
    })();
  }, [me?.id]);

  // --- Friends strip ---
  const {
    data: friends = [],
    isLoading: loadingFriends,
    isError: friendsError,
    refetch: refetchFriends,
  } = useQuery<Friend[]>({
    queryKey: ['all-friends'],
    queryFn: fetchFriendList,
  });

  // Feed
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['feed', PAGE_SIZE],
    initialPageParam: 1,
    queryFn: ({pageParam}) =>
      fetchFeedPage(typeof pageParam === 'number' ? pageParam : 1, PAGE_SIZE),
    getNextPageParam: lastPage => {
      const {page, limit, total, data: rows} = lastPage;
      if (!rows || rows.length === 0) return undefined;
      const loaded = page * limit;
      if (loaded >= total) return undefined;
      return page + 1;
    },
  });

  const feedPosts: FeedPost[] =
    data?.pages.flatMap(page => page.data ?? []) ?? [];

  // Create post
  const {mutate: doCreatePost, isPending: isPosting} = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      setShowModal(false);
      queryClient.invalidateQueries({queryKey: ['feed']});
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create post. Please try again.';
      Alert.alert('Post failed', msg);
    },
  });

  // React to post (API)
  const reactMutation = useMutation({
    mutationFn: (postId: number) => reactToPost(postId),
    onSuccess: (_res, postId) => {
      queryClient.invalidateQueries({queryKey: ['post-reacts-count', postId]});
      queryClient.invalidateQueries({queryKey: ['post-reactors', postId]});
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message || err?.message || 'Failed to react.';
      Alert.alert('React failed', msg);
    },
  });

  // 🔹 Report mutation
  const {mutate: doReportPost, isPending: isReporting} = useMutation({
    mutationFn: reportPost,
    onSuccess: () => {
      Alert.alert('Report submitted', 'Thanks for letting us know.');
      handleCloseReport();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to submit report.';
      Alert.alert('Report failed', msg);
    },
  });

  const handleSubmitPost = (caption: string, image?: PostImageFile | null) => {
    if (!caption.trim() && !image) {
      Alert.alert('Please add a caption or select an image.');
      return;
    }
    doCreatePost({caption, image: image || undefined});
  };

  const handleOpenReactsSheet = (postId: number) => {
    setReactSheetPostId(postId);
    setReactSheetVisible(true);
  };
  const handleOpenCommentsSheet = (postId: number) => {
    setCommentSheetPostId(postId);
    setCommentSheetVisible(true);
  };
  const handleDoubleTapReact = (postId: number) => {
    reactMutation.mutate(postId);
  };

  // report handlers
  const handleOpenReport = (post: FeedPost) => {
    setReportPostData(post);
    setReportReason(null);
    setReportDetails('');
  };

  const handleCloseReport = () => {
    setReportPostData(null);
    setReportReason(null);
    setReportDetails('');
  };

  const handleSubmitReport = () => {
    if (!reportPostData || !reportReason) {
      return;
    }

    const reasonLabel =
      REPORT_REASONS.find(r => r.id === reportReason)?.label ?? reportReason;

    const trimmedDetails = reportDetails.trim();
    const report_text = trimmedDetails
      ? `${reasonLabel}: ${trimmedDetails}` // reason: details
      : reasonLabel;

    doReportPost({
      post_id: reportPostData.id,
      report_text,
    });
  };

  // --- friend card (story replacement) ---
  const renderFriend = ({item}: {item: Friend}) => {
    const uri = item.pro_path ? `${API_BASE_URL}/${item.pro_path}` : undefined;
    return (
      <TouchableOpacity
        onPress={() =>
          navigation?.navigate('OtherProfileScreen', {userId: item.user_id})
        }
        style={styles.storyItem}>
        {uri ? (
          <Image source={{uri}} style={styles.storyImage} />
        ) : (
          <View style={[styles.storyImage, {backgroundColor: '#eee'}]} />
        )}
        <Text numberOfLines={1} style={styles.storyText}>
          {item.name || 'Friend'}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => (
    <>
      <View style={styles.header}>
        <Icon
          name="arrow-back"
          size={24}
          onPress={() => navigation?.goBack?.()}
        />
        <View style={styles.headerIcons}>
          {/* Commented for now */}
          {/* <TouchableOpacity onPress={() => setShowWarning(true)}>
            <Icon name="notifications-outline" size={24} style={styles.icon} />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={() => navigation?.navigate('ChatScreen')}>
            <Icon name="chatbubble-ellipses-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Friends strip (replaces stories) */}
      <FlatList
        data={friends}
        renderItem={renderFriend}
        horizontal
        keyExtractor={(item, idx) => `${item.user_id}-${idx}`}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
        ListEmptyComponent={
          <View style={[styles.storiesContainer, {paddingVertical: 8}]}>
            {loadingFriends ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <ActivityIndicator />
                <Text style={{marginLeft: 8, color: '#666'}}>
                  Loading friends…
                </Text>
              </View>
            ) : friendsError ? (
              <TouchableOpacity onPress={() => refetchFriends()}>
                <Text style={{color: '#dc2626'}}>
                  Failed to load friends. Tap to retry.
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{color: '#666'}}>No friends found.</Text>
            )}
          </View>
        }
      />

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      )}

      {isError && !isLoading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Failed to load posts. Pull to refresh or try again.
          </Text>
        </View>
      )}
    </>
  );

  const renderListFooter = () => (
    <View style={{paddingBottom: 140}}>
      {isFetchingNextPage && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading more...</Text>
        </View>
      )}
      {!hasNextPage && feedPosts.length > 0 && (
        <View style={styles.center}>
          <Text style={styles.loadingText}>No more posts.</Text>
        </View>
      )}
    </View>
  );

  const closeFullImage = () => setFullImageUrl(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={feedPosts}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <PostCard
            item={item}
            onOpenReacts={handleOpenReactsSheet}
            onOpenComments={handleOpenCommentsSheet}
            onDoubleTapReact={handleDoubleTapReact}
            onOpenReport={handleOpenReport}
            onOpenImage={setFullImageUrl} // 🔹 hook into viewer
          />
        )}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isLoading) {
            fetchNextPage();
          }
        }}
        refreshing={isLoading}
        onRefresh={() => {
          refetch();
          refetchFriends();
        }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}>
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <PostModal
        visible={showModal}
        onClose={() => {
          if (!isPosting) setShowModal(false);
        }}
        onPost={handleSubmitPost}
        isPosting={isPosting}
      />

      {/* Existing warning modal */}
      <Modal
        visible={showWarning}
        animationType="fade"
        transparent
        onRequestClose={() => setShowWarning(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.warningBox}>
            <Icon name="warning-outline" size={40} color="red" />
            <Text style={styles.warningText}>
              We got a report against you. Be polite
            </Text>
            <TouchableOpacity
              onPress={() => setShowWarning(false)}
              style={styles.closeBtn}>
              <Text style={{color: '#fff'}}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Report dialog modal */}
      <Modal
        visible={!!reportPostData}
        transparent
        animationType="fade"
        onRequestClose={handleCloseReport}>
        <View style={styles.modalOverlay}>
          <View style={styles.reportBox}>
            <View style={styles.reportHeaderRow}>
              <Icon name="flag" size={22} color="#f04b60" />
              <Text style={styles.reportTitle}>Report Inappropriate</Text>
            </View>

            <Text style={styles.reportMessage}>
              Is this post inappropriate? We will review this report within 24
              hours and, if deemed inappropriate, the post will be removed
              within that timeframe. We will also take action against its
              author. There is zero tolerance for objectionable content or
              abuse.
            </Text>

            <Text style={styles.reportSectionTitle}>Choose a reason</Text>
            {REPORT_REASONS.map(r => (
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
              placeholder="Describe the issue..."
              placeholderTextColor="#999"
              multiline
              value={reportDetails}
              onChangeText={setReportDetails}
            />

            <View style={styles.reportButtonsRow}>
              <TouchableOpacity
                style={[styles.reportButton, styles.reportCancelButton]}
                onPress={handleCloseReport}
                disabled={isReporting}>
                <Text style={[styles.reportButtonText, {color: '#f04b60'}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.reportButton,
                  {
                    backgroundColor:
                      reportReason && !isReporting ? '#f04b60' : '#f7b6c5',
                  },
                ]}
                disabled={!reportReason || isReporting}
                onPress={handleSubmitReport}>
                <Text style={[styles.reportButtonText, {color: '#fff'}]}>
                  {isReporting ? 'Sending...' : 'Send Report'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ReactorsBottomSheet
        visible={reactSheetVisible}
        postId={reactSheetPostId}
        onClose={() => {
          setReactSheetVisible(false);
          setReactSheetPostId(null);
        }}
      />

      <CommentsBottomSheet
        visible={commentSheetVisible}
        postId={commentSheetPostId}
        onClose={() => {
          setCommentSheetVisible(false);
          setCommentSheetPostId(null);
        }}
      />

      {/* 🔹 Full-screen zoomable viewer, same lib as SingleChat */}
      <Modal
        visible={!!fullImageUrl}
        transparent
        animationType="fade"
        onRequestClose={closeFullImage}>
        <View style={styles.fullscreenOverlay}>
          {fullImageUrl ? (
            <ImageViewer
              imageUrls={[{url: fullImageUrl}]}
              enableSwipeDown
              onSwipeDown={closeFullImage}
              onCancel={closeFullImage}
              backgroundColor="#000"
              saveToLocalByLongPress={false}
            />
          ) : null}
          <TouchableOpacity
            style={styles.fullscreenCloseBtn}
            onPress={closeFullImage}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFEFF5', paddingTop: 15},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerIcons: {flexDirection: 'row', marginLeft: 'auto'},
  icon: {marginRight: 12},
  storiesContainer: {paddingHorizontal: 10, marginBottom: 15},
  storyItem: {alignItems: 'center', marginRight: 14, width: 70},
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'deeppink',
  },
  storyText: {marginTop: 5, fontSize: 12, color: '#333'},
  postContainer: {
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
  },
  postHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  avatar: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  userName: {fontWeight: 'bold', fontSize: 14},
  time: {fontSize: 12, color: '#666'},
  postImage: {width: '100%', height: 180, borderRadius: 10, marginTop: 8},
  postText: {fontSize: 13, color: '#333', marginTop: 8},
  fab: {
    position: 'absolute',
    bottom: 110,
    right: 20,
    backgroundColor: '#f04b60',
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  center: {alignItems: 'center', justifyContent: 'center', paddingVertical: 12},
  loadingText: {marginTop: 4, fontSize: 12, color: '#666'},
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#dc2626',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  warningBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: 300,
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  heartOverlay: {
    position: 'absolute',
    top: '35%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
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
  reportItemLabel: {
    marginTop: 10,
    fontSize: 13,
    color: '#555',
  },
  reportItemName: {
    fontWeight: '600',
    color: '#111',
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

  // 🔹 full-screen viewer overlay styles
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
});
