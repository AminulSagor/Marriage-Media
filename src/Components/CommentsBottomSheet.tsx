import React, {useMemo, useRef, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {addComment, fetchPostComments} from '../api/posts';
import Icon from 'react-native-vector-icons/Ionicons';
import {API_BASE_URL} from '../config/env';

const COMMENTS_PAGE_LIMIT = 20;

interface CommentsBottomSheetProps {
  visible: boolean;
  postId: number | null;
  onClose: () => void;
}

const CommentsBottomSheet: React.FC<CommentsBottomSheetProps> = ({
  visible,
  postId,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const listQueryKey = useMemo(() => ['post-comments-list', postId], [postId]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: listQueryKey,
    enabled: visible && !!postId,
    initialPageParam: 1,
    queryFn: ({pageParam}) =>
      fetchPostComments({
        post_id: postId as number,
        page: typeof pageParam === 'number' ? pageParam : 1,
        limit: COMMENTS_PAGE_LIMIT,
      }),
    getNextPageParam: lastPage => {
      const {page, limit, total, data: rows} = lastPage;
      if (!rows || rows.length === 0) return undefined;
      const loaded = page * limit;
      if (loaded >= total) return undefined;
      return page + 1;
    },
  });

  const comments = data?.pages.flatMap(p => p.data ?? []) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) fetchNextPage();
  };

  // --- Send comment mutation
  const sendMutation = useMutation({
    mutationFn: () =>
      addComment({
        post_id: postId as number,
        comment: text.trim(),
      }),
    onMutate: async () => {
      if (!postId) return;
      const trimmed = text.trim();
      setText('');

      // stop outgoing refetches
      await queryClient.cancelQueries({queryKey: listQueryKey});

      const prev = queryClient.getQueryData<any>(listQueryKey);

      // optimistic insert into list's first page
      queryClient.setQueryData(listQueryKey, (old: any) => {
        if (!old) return old;
        const optimistic = {
          user_id: -1,
          name: 'You',
          pro_path: '',
          comment_text: trimmed,
          created_at: new Date().toISOString(),
        };
        const pages = [...old.pages];
        pages[0] = {
          ...pages[0],
          data: [optimistic, ...(pages[0]?.data ?? [])],
          total: (pages[0]?.total ?? 0) + 1,
        };
        return {...old, pages};
      });

      // 🔴 also optimistically bump the separate COUNT query
      queryClient.setQueryData(['post-comments-count', postId], (old: any) => {
        if (!old) return old;
        return {...old, total: (old.total ?? 0) + 1};
      });

      return {prevSnapshot: prev};
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevSnapshot) {
        queryClient.setQueryData(listQueryKey, ctx.prevSnapshot);
      }
      // rollback count if we bumped it
      queryClient.invalidateQueries({
        queryKey: ['post-comments-count', postId],
      });
    },
    onSettled: () => {
      // sync both list and count with server
      queryClient.invalidateQueries({queryKey: listQueryKey});
      queryClient.invalidateQueries({
        queryKey: ['post-comments-count', postId],
      });
    },
  });

  const handleSend = () => {
    if (!postId) return;
    if (!text.trim()) return;
    sendMutation.mutate();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.sheetOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Comments</Text>

              {/* List */}
              {isLoading && (
                <View style={styles.sheetCenter}>
                  <ActivityIndicator />
                  <Text style={styles.sheetSubText}>Loading...</Text>
                </View>
              )}

              {isError && !isLoading && (
                <View style={styles.sheetCenter}>
                  <Text style={styles.sheetError}>
                    Failed to load comments. Please try again.
                  </Text>
                </View>
              )}

              {!isLoading && !isError && comments.length === 0 && (
                <View style={styles.sheetCenter}>
                  <Text style={styles.sheetSubText}>
                    Be the first to comment.
                  </Text>
                </View>
              )}

              {(!isLoading || comments.length > 0) && (
                <FlatList
                  data={comments}
                  keyExtractor={(_, index) => String(index)}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.3}
                  onEndReached={handleLoadMore}
                  contentContainerStyle={{paddingBottom: 64}} // room for input bar
                  ListFooterComponent={
                    isFetchingNextPage ? (
                      <View style={styles.sheetCenter}>
                        <ActivityIndicator />
                      </View>
                    ) : null
                  }
                  renderItem={({item}) => {
                    const avatarUri = item.pro_path
                      ? `${API_BASE_URL}/${item.pro_path}`
                      : undefined;
                    return (
                      <View style={styles.row}>
                        {avatarUri ? (
                          <Image
                            source={{uri: avatarUri}}
                            style={styles.avatar}
                          />
                        ) : (
                          <View
                            style={[styles.avatar, {backgroundColor: '#eee'}]}
                          />
                        )}
                        <View style={{flex: 1}}>
                          <Text style={styles.name}>
                            {item.name || 'Unknown user'}
                          </Text>
                          <Text style={styles.commentText}>
                            {item.comment_text}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                />
              )}

              {/* Input bar */}
              <View style={styles.inputBar}>
                <TextInput
                  ref={inputRef}
                  value={text}
                  onChangeText={setText}
                  placeholder="Write a comment…"
                  placeholderTextColor="#999"
                  style={styles.input}
                  multiline
                />
                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!text.trim() || sendMutation.isPending}
                  style={styles.sendBtn}>
                  <Icon
                    name="send"
                    size={20}
                    color={
                      !text.trim() || sendMutation.isPending
                        ? '#bbb'
                        : '#EC4D73'
                    }
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CommentsBottomSheet;

const styles = StyleSheet.create({
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '70%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ddd',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    color: '#111',
  },
  sheetCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  sheetSubText: {marginTop: 4, fontSize: 13, color: '#666'},
  sheetError: {fontSize: 13, color: '#dc2626', textAlign: 'center'},

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  avatar: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  name: {fontSize: 14, color: '#111', fontWeight: '500'},
  commentText: {fontSize: 13, color: '#444', marginTop: 2},

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#eee',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 14 : 10,
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f6f6f6',
    borderRadius: 16,
    color: '#111',
    fontSize: 14,
  },
  sendBtn: {
    padding: 8,
    alignSelf: 'flex-end',
  },
});
