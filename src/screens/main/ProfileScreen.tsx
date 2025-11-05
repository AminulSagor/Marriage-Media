import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const posts = [
  require('../../assets/images/img3.png'),
  require('../../assets/images/img4.png'),
  require('../../assets/images/img2.png'),
];

const ProfileScreen = ({navigation}) => {
  const [blurEnabled, setBlurEnabled] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/pro.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.backIcon}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation?.navigate('SettingScreen')}
          style={styles.settingsIcon}>
          <Icon name="settings-outline" size={24} color="#fff" />
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

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text style={styles.name}>Niaz Uddin, 28</Text>
        <Text style={styles.location}>📍 Rome, Italy</Text>
        <Text style={styles.subLocation}>
          Current location: Kelton, Australia
        </Text>
        <Text style={styles.bio}>An honest guy from Italy</Text>
      </View>

      {/* About Me */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.editTag}>Edit</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            I'm Niaz, a passionate engineer with a love for building smart,
            efficient solutions. With a strong technical background and
            problem-solving mindset, I thrive on turning complex ideas into
            reality—whether it’s through design.
          </Text>
        </View>
      </View>

      {/* Appearance */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Text style={styles.editTag}>Edit</Text>
        </View>
        <View style={styles.tagRow}>
          {['Height : 175 inc', 'Weight : 68 kg', 'Body : Muscular'].map(
            text => (
              <View key={text} style={styles.tag}>
                <Text style={styles.tagText}>{text}</Text>
              </View>
            ),
          )}
        </View>
        <View style={styles.tagRow}>
          {['Hair : Brown', 'Eye : Black', 'Skin : White'].map(text => (
            <View key={text} style={styles.tag}>
              <Text style={styles.tagText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Religion */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Religion details</Text>
          <Text style={styles.editTag}>Edit</Text>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Islam</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>No specific dresscode</Text>
          </View>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Prayer : 5 times a day</Text>
          </View>
        </View>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <Text style={styles.editTag}>Edit</Text>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Never married</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Master’s degree</Text>
          </View>
        </View>
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Engineer</Text>
          </View>
        </View>
      </View>

      {/* Interests */}
      <View style={styles.section}>
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
      </View>

      {/* Posts */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Posts</Text>
        </View>
        <View style={{flexDirection: 'row', marginTop: 8}}>
          {posts.map((item, index) => {
            if (index === 2) {
              return (
                <View key={index} style={styles.postItem}>
                  <Image source={item} style={styles.postImage} />
                  <View style={styles.overlay}>
                    <Text style={styles.overlayText}>5+</Text>
                  </View>
                </View>
              );
            }
            return <Image key={index} source={item} style={styles.postItem} />;
          })}
        </View>
      </View>
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
});
