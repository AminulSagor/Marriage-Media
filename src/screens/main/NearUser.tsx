// src/screens/NearUser.tsx
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';

import {
  fetchFriendRequests,
  FriendRequestItem,
  getSendRequestList,
  SentRequestItem,
  acceptFriendRequest,
  cancelFriendOrUnfriend,
} from '../../api/friends';
import {fetchProfile} from '../../api/profile';
import {API_BASE_URL} from '../../config/env';

const {width} = Dimensions.get('window');

// const tabs = ['Likes me', 'Liked', 'Passed', 'Pings']; //Commented For backup
const tabs = ['Likes me', 'Liked'];

type NearUserItem = {
  id: string; // request id
  userId?: number; // actual other user id (receiver/sender)
  name: string;
  image: string;
};

// demo data for other tabs (not used now)
const demoUsers: NearUserItem[] = [
  {
    id: '1',
    userId: 1,
    name: 'Jak Devin',
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: '2',
    userId: 2,
    name: 'Neha',
    image: 'https://randomuser.me/api/portraits/women/20.jpg',
  },
  {
    id: '3',
    userId: 3,
    name: 'Faruqi',
    image: 'https://randomuser.me/api/portraits/men/30.jpg',
  },
  {
    id: '4',
    userId: 4,
    name: 'Ahmed',
    image: 'https://randomuser.me/api/portraits/men/40.jpg',
  },
];

const mapIncoming = (r: FriendRequestItem): NearUserItem => ({
  id: String(r.request_id),
  // other user = sender; fall back to request_id if backend doesn't send it
  userId: r.user_id ?? r.sender_id ?? r.request_id,
  name: r.name,
  image: r.pro_path
    ? `${API_BASE_URL}/${r.pro_path}`
    : 'https://randomuser.me/api/portraits/men/40.jpg',
});

const mapSent = (r: SentRequestItem): NearUserItem => ({
  id: String(r.request_id),
  // other user = receiver; fall back to request_id if backend doesn't send it
  userId: r.user_id ?? r.receiver_id ?? r.request_id,
  name: r.name,
  image: r.pro_path
    ? `${API_BASE_URL}/${r.pro_path}`
    : 'https://randomuser.me/api/portraits/men/40.jpg',
});

const NearUser = ({navigation}: {navigation: any}) => {
  const [activeTab, setActiveTab] = useState<
    // 'Likes me' | 'Liked' | 'Passed' | 'Pings' //Commented For backup
    'Likes me' | 'Liked'
  >('Likes me');
  const queryClient = useQueryClient();

  // current user avatar
  const {data: me} = useQuery({
    queryKey: ['me-profile'],
    queryFn: fetchProfile,
  });
  const myAvatarUri = me?.pro_path
    ? `${API_BASE_URL}/${me.pro_path}`
    : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2';

  // Incoming requests → "Likes me"
  const {
    data: incomingData,
    isLoading: incomingLoading,
    isError: incomingError,
    refetch: refetchIncoming,
  } = useQuery({queryKey: ['friend-requests'], queryFn: fetchFriendRequests});

  // Sent requests → "Liked"
  const {
    data: sentData,
    isLoading: sentLoading,
    isError: sentError,
    refetch: refetchSent,
  } = useQuery({queryKey: ['sent-requests'], queryFn: getSendRequestList});

  // Accept request
  const acceptMut = useMutation({
    mutationFn: (requestId: number) => acceptFriendRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['friend-requests']});
    },
  });

  // Cancel request / Unfriend
  const cancelMut = useMutation({
    mutationFn: (receiverId: number) => cancelFriendOrUnfriend(receiverId),
    onSuccess: () => {
      // affects both incoming and sent lists
      queryClient.invalidateQueries({queryKey: ['friend-requests']});
      queryClient.invalidateQueries({queryKey: ['sent-requests']});
    },
  });

  const likeMeUsers = useMemo(
    () => (incomingData?.data ?? []).map(mapIncoming),
    [incomingData],
  );
  const likedUsers = useMemo(() => (sentData ?? []).map(mapSent), [sentData]);

  const listData: NearUserItem[] =
    activeTab === 'Likes me'
      ? likeMeUsers
      : activeTab === 'Liked'
      ? likedUsers
      : demoUsers;

  const renderUser = ({item}: {item: NearUserItem}) => (
    <View style={styles.userCard}>
      <Image source={{uri: item.image}} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.actions}>
        {/* ✅ Show tick for all tabs EXCEPT "Liked" */}
        {activeTab !== 'Liked' && (
          <TouchableOpacity
            disabled={activeTab === 'Likes me' && acceptMut.isPending}
            onPress={() => {
              if (activeTab === 'Likes me') {
                // accept and then navigate to match
                acceptMut.mutate(Number(item.id), {
                  onSuccess: () => navigation?.navigate('MatchScreen'),
                });
              } else {
                // Passed / Pings → just navigate
                // navigation?.navigate('MatchScreen');
              }
            }}
            style={styles.checkButton}>
            <Icon name="check" size={22} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.crossButton}
          disabled={cancelMut.isPending}
          onPress={() => {
            // prefer actual userId, fall back to request id
            const receiverId = item.userId ?? Number(item.id);
            cancelMut.mutate(receiverId);
          }}>
          <Icon name="close" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderLoadingOrError = () => {
    const isLoading = activeTab === 'Likes me' ? incomingLoading : sentLoading;
    const isError = activeTab === 'Likes me' ? incomingError : sentError;
    const refetch = activeTab === 'Likes me' ? refetchIncoming : refetchSent;

    if (isLoading) {
      return (
        <View style={{alignItems: 'center', marginTop: 16}}>
          <ActivityIndicator />
          <Text style={{color: '#666', marginTop: 6}}>Loading…</Text>
        </View>
      );
    }
    if (isError) {
      return (
        <View style={{alignItems: 'center', marginTop: 16}}>
          <Text style={{color: '#dc2626', marginBottom: 8}}>
            Failed to load {activeTab.toLowerCase()} list.
          </Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={{color: '#2563eb'}}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const showLoaderOrError =
    (activeTab === 'Likes me' && (incomingLoading || incomingError)) ||
    (activeTab === 'Liked' && (sentLoading || sentError));

  return (
    <View style={styles.container}>
      {/* Top Avatar = current user */}
      <Image source={{uri: myAvatarUri}} style={styles.topAvatar} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
            {tab === 'Pings' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* List / States */}
      {showLoaderOrError ? (
        renderLoadingOrError()
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => item.id}
          renderItem={renderUser}
          contentContainerStyle={{paddingTop: 10}}
          ListEmptyComponent={
            <View style={{alignItems: 'center', marginTop: 16}}>
              <Text style={{color: '#666'}}>No users to show.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0DFE3',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  topAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {backgroundColor: '#fff'},
  tabText: {fontWeight: '600', color: '#666'},
  activeTabText: {color: '#000'},
  badge: {
    backgroundColor: '#FF2F6C',
    borderRadius: 10,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {color: '#fff', fontSize: 10, fontWeight: 'bold'},
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    elevation: 2,
  },
  avatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
  name: {fontSize: 16, fontWeight: '600', flex: 1},
  actions: {flexDirection: 'row', gap: 10},
  checkButton: {backgroundColor: '#FFC0CB', padding: 8, borderRadius: 20},
  crossButton: {backgroundColor: '#FF5A76', padding: 8, borderRadius: 20},
});

export default NearUser;
