import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {fetchFriendProfile, cancelFriendOrUnfriend} from '../../api/friends';
import {fetchProfile} from '../../api/profile';
import {API_BASE_URL} from '../../config/env';
import {getOrCreate1to1, markConversationRead} from '../../services/chat';
import {fetchOtherUserPosts} from '../../api/posts';

// If you have a concrete stack, replace ParamListBase with your RootStackParamList
type OtherProfileRoute = RouteProp<ParamListBase, string>;

const OtherProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const route = useRoute<OtherProfileRoute>();
  const userId: number | undefined = (route.params as any)?.userId;

  const queryClient = useQueryClient();

  // 🔹 logged-in user ("me")
  const {data: me} = useQuery({
    queryKey: ['me-profile'],
    queryFn: fetchProfile,
  });

  // 🔹 profile of the user we are viewing
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['friend-profile', userId],
    queryFn: () => fetchFriendProfile(Number(userId)),
    enabled: !!userId,
  });

  // 🔹 posts of the user we are viewing
  const {
    data: posts = [],
    isLoading: loadingPosts,
    isError: postsError,
  } = useQuery({
    queryKey: ['other-posts', userId],
    queryFn: () => fetchOtherUserPosts(Number(userId)),
    enabled: !!userId,
  });

  // same API used in NearUser.tsx close button
  const unfriendMut = useMutation({
    mutationFn: (receiverId: number) => cancelFriendOrUnfriend(receiverId),
    onSuccess: () => {
      // refresh lists that depend on friend requests / sent requests
      queryClient.invalidateQueries({queryKey: ['friend-requests']});
      queryClient.invalidateQueries({queryKey: ['sent-requests']});
    },
  });

  const valueOrMissing = (v: any) =>
    v !== undefined && v !== null && String(v).trim() !== ''
      ? String(v)
      : 'Missing in api';

  const computeAge = (dob?: string | null) => {
    if (!dob) return undefined;
    const d = new Date(dob);
    if (isNaN(d.getTime())) return undefined;
    const diff = Date.now() - d.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = computeAge(profile?.dob);
  const nameLine =
    valueOrMissing(profile?.name) + (age !== undefined ? `, ${age}` : '');

  const locationLine = (() => {
    const loc = [profile?.city, profile?.country].filter(Boolean).join(', ');
    return valueOrMissing(loc);
  })();

  const headerImage = profile?.pro_path
    ? {uri: `${API_BASE_URL}/${profile.pro_path}`}
    : {uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'};

  // 🔹 open/create 1-1 chat
  const handleOpenChat = React.useCallback(async () => {
    if (!me?.id || !userId) {
      return;
    }

    try {
      const chatId = await getOrCreate1to1(me.id, Number(userId));

      // mark as read for me (no-op if new)
      markConversationRead(chatId, me.id).catch(() => {});

      navigation.navigate('SingleChat', {
        chatId,
        myId: me.id,
        peerId: Number(userId),
        peerName: profile?.name ?? `User ${userId}`,
        peerAvatar: profile?.pro_path
          ? `${API_BASE_URL}/${profile.pro_path}`
          : 'https://placehold.co/80x80',
      });
    } catch (err) {
      console.log('open chat failed', err);
      Alert.alert('Could not open chat', 'Please try again.');
    }
  }, [me?.id, userId, navigation, profile?.name, profile?.pro_path]);

  // 🔹 confirm before unfriend
  const handleUnfriendPress = () => {
    if (!userId) return;

    const targetName = profile?.name || 'this user';

    Alert.alert(
      'Unfriend',
      `Do you really want to unfriend ${targetName}?`,
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => unfriendMut.mutate(Number(userId)),
        },
      ],
      {cancelable: true},
    );
  };

  if (!userId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{alignItems: 'center', marginTop: 40}}>
          <Text style={{color: '#dc2626'}}>
            No userId passed to this screen.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{alignItems: 'center', marginTop: 40}}>
          <ActivityIndicator />
          <Text style={{marginTop: 6, color: '#666'}}>Loading profile…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{alignItems: 'center'}}>
          <Text style={{color: '#dc2626', marginBottom: 10}}>
            Failed to load profile.
          </Text>
          <TouchableOpacity onPress={() => refetch()}>
            <Text style={{color: '#2563eb'}}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={headerImage} style={styles.profileImage} />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Action Icons*/}
      <View style={styles.actionRow}>
        {/* 🔹 LEFT ICON – unfriend with confirmation */}
        <TouchableOpacity
          style={styles.actionIcon}
          disabled={unfriendMut.isPending}
          onPress={handleUnfriendPress}>
          <Image
            source={require('../../assets/images/one.png')}
            style={styles.actionImg}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* middle icon → open chat */}
        <TouchableOpacity style={styles.actionIcon} onPress={handleOpenChat}>
          <Image
            source={require('../../assets/images/onee.png')}
            style={styles.actionImg}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* right icon commented for backup */}
        {/* <TouchableOpacity style={styles.actionIcon}>
          <Image
            source={require('../../assets/images/oneee.png')}
            style={styles.actionImg}
            resizeMode="contain"
          />
        </TouchableOpacity> */}
      </View>

      {/* Public / Private Tabs */}
      {/* <View style={styles.tabRow}>
        <Text style={[styles.tabText, styles.activeTab]}>Public</Text>
        <Text style={styles.tabText}>Private</Text>
      </View> */}

      {/* Profile Info */}
      <View style={styles.section}>
        <Text style={styles.name}>{nameLine}</Text>
        <Text style={styles.location}>📍 {locationLine}</Text>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>
            Height : {valueOrMissing(profile?.height)}{' '}
            {typeof profile?.height === 'number' ||
            /[0-9]/.test(String(profile?.height))
              ? 'cm'
              : ''}
          </Text>
          <Text style={styles.tag}>
            Weight : {valueOrMissing(profile?.weight)}{' '}
            {typeof profile?.weight === 'number' ||
            /[0-9]/.test(String(profile?.weight))
              ? 'kg'
              : ''}
          </Text>
        </View>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>
            Body : {valueOrMissing(profile?.body_type)}
          </Text>
          <Text style={styles.tag}>
            Hair : {valueOrMissing(profile?.hair_color)}
          </Text>
        </View>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>
            Eye : {valueOrMissing(profile?.eye_color)}
          </Text>
          <Text style={styles.tag}>
            Skin : {valueOrMissing(profile?.skin_color)}
          </Text>
        </View>
      </View>

      {/* Religion */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Religion details</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>{valueOrMissing(profile?.religion)}</Text>
          <Text style={styles.tag}>
            {valueOrMissing(profile?.religion_section)}
          </Text>
        </View>
        <Text style={styles.tag}>
          Prayer: {valueOrMissing(profile?.prayer_frequency)}
        </Text>
        <Text style={styles.tag}>
          Dress code: {valueOrMissing(profile?.dress_code)}
        </Text>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>
            {valueOrMissing(profile?.marital_status)}
          </Text>
          <Text style={styles.tag}>{valueOrMissing(profile?.education)}</Text>
        </View>
        <Text style={styles.tag}>{valueOrMissing(profile?.profession)}</Text>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.tagRow}>
          <Text style={styles.tag}>
            Age:{' '}
            {profile?.prefered_partner_age_start != null &&
            profile?.prefered_partner_age_end != null
              ? `${profile.prefered_partner_age_start}-${profile.prefered_partner_age_end}`
              : 'Missing in api'}
          </Text>
        </View>
      </View>

      {/* Posts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Posts</Text>

        {loadingPosts ? (
          <ActivityIndicator />
        ) : postsError ? (
          <Text style={styles.subText}>Could not load posts.</Text>
        ) : posts.length === 0 ? (
          <Text style={styles.subText}>No posts yet.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.postScroll}>
            {posts.map(post => (
              <Image
                key={post.id}
                source={{uri: `${API_BASE_URL}/${post.image_path}`}}
                style={styles.postImg}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </ScrollView>
  );
};

export default OtherProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F0DFE3'},
  imageContainer: {position: 'relative'},
  profileImage: {
    width: 460,
    height: 400,
    borderBottomLeftRadius: 150,
    borderBottomRightRadius: 150,
    alignSelf: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
  },
  notifyButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
  },
  overlayContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: '90%',
  },
  overlayText: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    textAlign: 'center',
    marginVertical: 4,
  },

  // Icons row (no boxes)
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -25,
  },
  actionIcon: {
    backgroundColor: 'transparent',
    padding: 0,
    borderRadius: 0,
    elevation: 0,
  },
  actionImg: {width: 65, height: 65},

  tabRow: {flexDirection: 'row', justifyContent: 'center', marginVertical: 10},
  tabText: {fontSize: 16, marginHorizontal: 20, color: '#999'},
  activeTab: {fontWeight: 'bold', color: '#000'},

  section: {marginHorizontal: 20, marginTop: 15, marginBottom: 20},
  name: {fontSize: 22, fontWeight: 'bold', color: '#000'},
  location: {fontSize: 14, color: '#444', marginTop: 2},
  subText: {fontSize: 14, color: '#666', marginTop: 5},
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  card: {backgroundColor: '#fff', padding: 12, borderRadius: 12},
  cardText: {fontSize: 14, color: '#444'},
  tagRow: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8},
  tag: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 4,
    fontSize: 13,
    color: '#000',
    elevation: 2,
  },
  postRow: {flexDirection: 'row', justifyContent: 'space-between'},
  postImg: {width: 100, height: 100, borderRadius: 12},
  postScroll: {
    flexDirection: 'row',
    gap: 10,
  },
});
