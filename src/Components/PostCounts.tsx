import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {fetchPostComments, fetchPostReactors} from '../api/posts';

interface PostCountsProps {
  postId: number;
  onPressReacts?: (postId: number, total: number) => void;
  onPressComments?: (postId: number, total: number) => void;
}

const PostCounts: React.FC<PostCountsProps> = ({
  postId,
  onPressReacts,
  onPressComments,
}) => {
  const {
    data: reactsData,
    isLoading: reactsLoading,
    isError: reactsError,
  } = useQuery({
    queryKey: ['post-reacts-count', postId],
    queryFn: () => fetchPostReactors({post_id: postId, page: 1, limit: 1}),
  });

  const {
    data: commentsData,
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery({
    queryKey: ['post-comments-count', postId],
    queryFn: () => fetchPostComments({post_id: postId, page: 1, limit: 1}),
  });

  const reactsTotal =
    !reactsLoading && !reactsError ? reactsData?.total ?? 0 : 0;
  const commentsTotal =
    !commentsLoading && !commentsError ? commentsData?.total ?? 0 : 0;

  const handleReactsPress = () => {
    if (reactsTotal > 0 && onPressReacts) {
      onPressReacts(postId, reactsTotal);
    }
  };

  const handleCommentsPress = () => {
    if (commentsTotal > 0 && onPressComments) {
      onPressComments(postId, commentsTotal);
    }
  };

  return (
    <View style={styles.reactions}>
      <TouchableOpacity
        onPress={handleReactsPress}
        disabled={reactsTotal === 0}>
        <Text
          style={[
            styles.reactionText,
            reactsTotal === 0 && styles.reactionDisabled,
          ]}>
          ❤️ {reactsTotal}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleCommentsPress}
        disabled={commentsTotal === 0}>
        <Text
          style={[
            styles.reactionText,
            commentsTotal === 0 && styles.reactionDisabled,
          ]}>
          💬 {commentsTotal}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostCounts;

const styles = StyleSheet.create({
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  reactionText: {
    fontSize: 13,
    color: '#111',
  },
  reactionDisabled: {
    color: '#aaa',
  },
});
