import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useQuery} from '@tanstack/react-query';
import {fetchProfile, UserProfile} from '../../api/profile';
import {fetchMyPosts, UserPost} from '../../api/posts';
import {API_BASE_URL} from '../../config/env';

// const posts = [
//   require('../../assets/images/img3.png'),
//   require('../../assets/images/img4.png'),
//   require('../../assets/images/img2.png'),
// ];

interface ProfileScreenProps {
  navigation: any;
}

const calcAge = (dob?: string | null): number | null => {
  if (!dob) {
    return null;
  }
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) {
    age--;
  }
  return age;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({navigation}) => {
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const {
    data: posts = [],
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useQuery<UserPost[]>({
    queryKey: ['myPosts'],
    queryFn: fetchMyPosts,
  });

  const age = calcAge(profile?.dob);
  const nameWithAge = profile
    ? `${profile.name}${age !== null ? `, ${age}` : ''}`
    : '';

  const location = profile
    ? [profile.city, profile.country].filter(Boolean).join(', ')
    : '';

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentInsetAdjustmentBehavior="always">
      {/* Header with profile image */}
      <View style={styles.header}>
        {/* Profile photo: use API image if available, fallback to placeholder */}
        <Image
          source={
            profile?.image_one || profile?.pro_path
              ? {
                  uri: `${API_BASE_URL}/${
                    profile.image_one || profile.pro_path
                  }`,
                }
              : require('../../assets/images/pro.png')
          }
          style={[styles.profileImage, blurEnabled && {opacity: 0.4}]}
        />

        {/* <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation?.goBack()}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => {
            if (profile) {
              navigation?.navigate('SettingScreen', {profile});
            } else {
              navigation?.navigate('SettingScreen'); // fallback – Settings will fetch
            }
          }}
          style={styles.settingsIcon}>
          <Icon name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Blur + Public/Private */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>Blur my Photo</Text>
        <Switch
          value={blurEnabled}
          onValueChange={setBlurEnabled}
          trackColor={{false: '#ccc', true: '#ff4081'}}
          thumbColor="#fff"
        />
      </View>

      <View style={styles.pubPrivRow}>
        <TouchableOpacity onPress={() => setIsPublic(true)}>
          <Text style={[styles.pubPrivText, isPublic && styles.pubPrivActive]}>
            Public
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsPublic(false)}>
          <Text style={[styles.pubPrivText, !isPublic && styles.pubPrivActive]}>
            Private
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading / Error states */}
      {isProfileLoading && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      )}

      {isProfileError && !isProfileLoading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>
            Failed to load profile. Check your connection and try again later.
          </Text>
        </View>
      )}

      {/* Only render details when we have profile */}
      {profile && !isProfileLoading && !isProfileError && (
        <View>
          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.name}>{nameWithAge}</Text>
            {!!location && <Text style={styles.location}>📍 {location}</Text>}
            <Text style={styles.bio}>
              {`${profile?.profession || 'person'} from ${
                profile?.country || 'somewhere'
              }`}
            </Text>
          </View>

          {/* About Me */}
          {/* <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About Me</Text>
              <Text style={styles.editTag}>Edit</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardText}>
                {profile?.education && `Education: ${profile.education}. `}
                {profile?.profession && `Working as ${profile.profession}. `}
                {profile?.marital_status &&
                  `Marital status: ${profile.marital_status}. `}
                {!profile?.education &&
                  !profile?.profession &&
                  !profile?.marital_status &&
                  'Update your profile to tell others more about you.'}
              </Text>
            </View>
          </View> */}

          {/* Appearance */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Appearance</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditAppearance', {profile})
                }>
                <Text style={styles.editTag}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagRow}>
              {profile.height && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    Height: {profile.height} cm
                  </Text>
                </View>
              )}
              {profile.weight && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    Weight: {profile.weight} kg
                  </Text>
                </View>
              )}
              {profile.body_type && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Body: {profile.body_type}</Text>
                </View>
              )}
            </View>
            <View style={styles.tagRow}>
              {profile.hair_color && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Hair: {profile.hair_color}</Text>
                </View>
              )}
              {profile.eye_color && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Eye: {profile.eye_color}</Text>
                </View>
              )}
              {profile.skin_color && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>Skin: {profile.skin_color}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Religion */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Religion details</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditReligionDetails', {profile})
                }>
                <Text style={styles.editTag}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagRow}>
              {profile.religion && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{profile.religion}</Text>
                </View>
              )}
              {profile.dress_code && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{profile.dress_code}</Text>
                </View>
              )}
            </View>
            <View style={styles.tagRow}>
              {profile.prayer_frequency && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>
                    Prayer: {String(profile.prayer_frequency)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Personal Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Personal Info</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('EditPersonalInfo', {profile})
                }>
                <Text style={styles.editTag}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagRow}>
              {profile.marital_status && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{profile.marital_status}</Text>
                </View>
              )}
              {profile.education && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{profile.education}</Text>
                </View>
              )}
            </View>
            <View style={styles.tagRow}>
              {profile.profession && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>{profile.profession}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Interests (placeholder for now) */}
          {/* <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Interests</Text>
              <Text style={styles.editTag}>Edit</Text>
            </View>
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>🛍️ Shopping</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>✈️ Traveling</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.addMore}>
              <Text style={styles.addMoreText}>Add more information +</Text>
            </TouchableOpacity>
          </View> */}

          {/* Posts (from API) */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Posts</Text>
            </View>

            {isPostsLoading && (
              <View style={styles.center}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Loading posts...</Text>
              </View>
            )}

            {isPostsError && !isPostsLoading && (
              <View style={styles.center}>
                <Text style={styles.errorText}>Failed to load posts.</Text>
              </View>
            )}

            {!isPostsLoading && !isPostsError && posts.length === 0 && (
              <Text style={styles.subLocation}>No posts yet.</Text>
            )}

            {!isPostsLoading && !isPostsError && posts.length > 0 && (
              <View
                style={{flexDirection: 'row', marginTop: 8, marginBottom: 100}}>
                {posts.slice(0, 3).map((post, index) => {
                  const uri = `${API_BASE_URL}/${post.image_path}`;

                  // If there are more than 3 posts, show "X+" on the last one
                  if (index === 2 && posts.length > 3) {
                    return (
                      <View key={post.id} style={styles.postItem}>
                        <Image source={{uri}} style={styles.postImage} />
                        <View style={styles.overlay}>
                          <Text style={styles.overlayText}>
                            {posts.length - 2}+
                          </Text>
                        </View>
                      </View>
                    );
                  }

                  return (
                    <Image
                      key={post.id}
                      source={{uri}}
                      style={styles.postItem}
                    />
                  );
                })}
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffafc',
  },
  header: {
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  backIcon: {
    position: 'absolute',
    top: 40,
    left: 16,
  },
  settingsIcon: {
    position: 'absolute',
    top: 40,
    right: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  toggleText: {
    marginRight: 10,
    color: '#333',
  },
  pubPrivRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  pubPrivText: {
    marginHorizontal: 20,
    fontSize: 16,
    color: '#999',
  },
  pubPrivActive: {
    color: '#ff4081',
    borderBottomWidth: 2,
    borderBottomColor: '#ff4081',
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111',
  },
  location: {
    fontSize: 14,
    marginTop: 4,
    color: '#333',
  },
  subLocation: {
    fontSize: 12,
    color: '#777',
  },
  bio: {
    marginTop: 6,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#444',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  editTag: {
    fontSize: 12,
    color: '#3b82f6',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#ff4d88',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginTop: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
  },
  addMore: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ff4081',
    borderStyle: 'dashed',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  addMoreText: {
    color: '#ff4081',
    fontSize: 13,
  },
  postItem: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#dc2626',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
