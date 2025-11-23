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

interface HomeScreenProps {
  navigation: any;
}

const PAGE_SIZE = 10;

/** Small card component so each post can manage its own heart animation */
const PostCard: React.FC<{
  item: FeedPost;
  onOpenReacts: (postId: number) => void;
  onOpenComments: (postId: number) => void;
  onDoubleTapReact: (postId: number) => void;
}> = ({item, onOpenReacts, onOpenComments, onDoubleTapReact}) => {
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

  const singleTap = Gesture.Tap();
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd(() => {
      showHeart();
      onDoubleTapReact(item.id);
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

        <Icon
          name="ellipsis-vertical"
          size={20}
          color="#000"
          style={{marginLeft: 'auto'}}
        />
      </View>

      <GestureDetector gesture={tapGesture}>
        <View>
          {postUri ? (
            <Image source={{uri: postUri}} style={styles.postImage} />
          ) : (
            <View style={styles.postImagePlaceholder} />
          )}

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
        </View>
      </GestureDetector>

      {item.caption ? (
        <Text style={styles.postText}>{item.caption}</Text>
      ) : null}

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

  const queryClient = useQueryClient();

  const {data: me} = useQuery({
    queryKey: ['me-profile'],
    queryFn: fetchProfile,
  });

  // ⬇️ Start presence tracking when Home loads after login.
  // If called again (e.g., me changes), stop previous then start fresh.
  React.useEffect(() => {
    if (!me?.id) return;

    (async () => {
      // stop any prior tracker first
      stopPresenceIfAny();
      await ensurePresenceDoc(me.id);
      const stop = await startPresenceTracking(me.id);
      setPresenceStopper(stop); // make it globally stoppable (Settings logout)
    })();
    // ⚠️ Do NOT stop on unmount here; we want tracking to keep running
    // and only stop explicitly on logout.
  }, [me?.id]);

  // --- NEW: Friends (replaces stories) ---
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

  // --- NEW: friend card (story replacement) ---
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
        onRefresh={() => refetch()}
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
    </View>
  );
};

export default HomeScreen;

// styles unchanged
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: 15},
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
  postImagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginTop: 8,
  },
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
});
