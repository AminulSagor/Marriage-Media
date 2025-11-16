import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchPostReactors} from '../api/posts';
import {API_BASE_URL} from '../config/env';

const REACTORS_PAGE_LIMIT = 20;

interface ReactorsBottomSheetProps {
  visible: boolean;
  postId: number | null;
  onClose: () => void;
}

const ReactorsBottomSheet: React.FC<ReactorsBottomSheetProps> = ({
  visible,
  postId,
  onClose,
}) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['post-reactors-list', postId],
    enabled: visible && !!postId,
    initialPageParam: 1,
    queryFn: ({pageParam}) =>
      fetchPostReactors({
        post_id: postId as number,
        page: typeof pageParam === 'number' ? pageParam : 1,
        limit: REACTORS_PAGE_LIMIT,
      }),
    getNextPageParam: lastPage => {
      const {page, limit, total, data: rows} = lastPage;
      if (!rows || rows.length === 0) return undefined;
      const loaded = page * limit;
      if (loaded >= total) return undefined;
      return page + 1;
    },
  });

  const reactors = data?.pages.flatMap(p => p.data ?? []) ?? [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
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
            <View style={styles.sheetContainer}>
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>Reactions</Text>

              {isLoading && (
                <View style={styles.sheetCenter}>
                  <ActivityIndicator />
                  <Text style={styles.sheetSubText}>Loading...</Text>
                </View>
              )}

              {isError && !isLoading && (
                <View style={styles.sheetCenter}>
                  <Text style={styles.sheetError}>
                    Failed to load reactors. Please try again.
                  </Text>
                </View>
              )}

              {!isLoading && !isError && reactors.length === 0 && (
                <View style={styles.sheetCenter}>
                  <Text style={styles.sheetSubText}>
                    No reactions yet on this post.
                  </Text>
                </View>
              )}

              {!isLoading && !isError && reactors.length > 0 && (
                <FlatList
                  data={reactors}
                  keyExtractor={(_, index) => String(index)}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.3}
                  onEndReached={handleLoadMore}
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
                        <Text style={styles.name}>
                          {item.name || 'Unknown user'}
                        </Text>
                      </View>
                    );
                  }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ReactorsBottomSheet;

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
    paddingBottom: 24,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '60%',
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
    marginBottom: 10,
    color: '#111',
  },
  sheetCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  sheetSubText: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },
  sheetError: {
    fontSize: 13,
    color: '#dc2626',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
});
