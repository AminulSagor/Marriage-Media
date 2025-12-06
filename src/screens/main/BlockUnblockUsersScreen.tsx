// src/screens/BlockUnblockUsersScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useRoute} from '@react-navigation/native';

import {
  fetchBlockedUsers,
  BlockedUser,
  unblockUser as apiUnblockUser,
} from '../../api/friends';

import {chatIdFor, unblockChat} from '../../services/chat';

interface BlockUnblockUsersScreenProps {
  navigation: any;
}

const BlockUnblockUsersScreen: React.FC<BlockUnblockUsersScreenProps> = ({
  navigation,
}) => {
  const queryClient = useQueryClient();
  const route = useRoute<any>();
  const myId = route.params?.myId as number | undefined; // 🔹 current user id (pass via navigation)

  const {
    data: blockedUsers = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<BlockedUser[]>({
    queryKey: ['blocked-users'],
    queryFn: fetchBlockedUsers,
  });

  // 🔹 Call backend /users/unblock then clear Firestore isBlocked for that 1-1 chat
  const unblockMutation = useMutation({
    mutationFn: async (id: number) => {
      // 1) backend unblock
      await apiUnblockUser(id);

      // 2) Firestore: clear isBlocked if we know myId
      try {
        if (typeof myId === 'number') {
          const chatId = chatIdFor(myId, id);
          await unblockChat(chatId);
        }
      } catch (err) {
        console.log('unblockChat firestore failed', err);
      }

      return id;
    },
    onSuccess: (_returnedId, id) => {
      // remove from cache list
      queryClient.setQueryData<BlockedUser[]>(['blocked-users'], prev => {
        if (!prev) {
          return [];
        }
        return prev.filter(user => user.id !== id);
      });
    },
    onError: err => {
      console.log('Unblock failed', err);
    },
  });

  const handleUnblockPress = (id: number) => {
    if (unblockMutation.isPending) return;
    unblockMutation.mutate(id);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Block / Unblock Users</Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.helperText}>Loading blocked users…</Text>
        </View>
      ) : isError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load blocked users.</Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={blockedUsers}
          keyExtractor={item => String(item.id)}
          renderItem={({item}) => (
            <View style={styles.userRow}>
              <Text style={styles.userName}>{item.name}</Text>
              <TouchableOpacity
                style={styles.unblockBtn}
                onPress={() => handleUnblockPress(item.id)}
                disabled={unblockMutation.isPending}>
                <Text style={{color: '#fff'}}>
                  {unblockMutation.isPending ? '...' : 'Unblock'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 20}}>
              No blocked users
            </Text>
          }
        />
      )}
    </View>
  );
};

export default BlockUnblockUsersScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: 40},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  headerTitle: {fontSize: 18, fontWeight: '600', marginLeft: 10},
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  userName: {fontSize: 16},
  unblockBtn: {
    backgroundColor: '#f00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  center: {
    marginTop: 40,
    alignItems: 'center',
  },
  helperText: {
    marginTop: 8,
    color: '#666',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: 8,
  },
  retryText: {
    color: '#2563eb',
  },
});
