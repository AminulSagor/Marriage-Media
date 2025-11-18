// PostCounts.tsx
import React from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useQuery} from '@tanstack/react-query';
import {fetchPostComments, fetchPostReactors} from '../api/posts';

const COUNT_LIMIT = 1;

export default function PostCounts({
  postId,
  onPressReacts,
  onPressComments,
}: {
  postId: number;
  onPressReacts?: (postId: number) => void;
  onPressComments?: (postId: number) => void;
}) {
  const {data: reactsData, isLoading: reactsLoading} = useQuery({
    queryKey: ['post-reacts-count', postId],
    queryFn: () =>
      fetchPostReactors({post_id: postId, page: 1, limit: COUNT_LIMIT}),
  });

  const {data: commentsData, isLoading: commentsLoading} = useQuery({
    queryKey: ['post-comments-count', postId],
    queryFn: () =>
      fetchPostComments({post_id: postId, page: 1, limit: COUNT_LIMIT}),
  });

  const reactsTotal = !reactsLoading ? reactsData?.total ?? 0 : 0;
  const commentsTotal = !commentsLoading ? commentsData?.total ?? 0 : 0;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onPressReacts?.(postId)}
        style={styles.item}
        android_ripple={{color: '#eee'}}>
        <Icon name="heart" size={18} color="#d11" />
        <Text style={styles.text}>{reactsTotal}</Text>
      </Pressable>

      {/* ALWAYS tappable even when commentsTotal === 0 */}
      <Pressable
        onPress={() => onPressComments?.(postId)}
        style={styles.item}
        android_ripple={{color: '#eee'}}>
        <Icon name="chatbubble-ellipses-outline" size={18} color="#444" />
        <Text style={styles.text}>{commentsTotal}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  text: {fontSize: 13, color: '#111'},
});
