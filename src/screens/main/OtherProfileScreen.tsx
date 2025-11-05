import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const OtherProfileScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/pic22.png')}
            style={styles.profileImage}
          />

          {/* Back & Notification */}
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}>
            <Ionicons name="chevron-back" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.notifyButton}>
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>

          {/* Overlay Text Bubbles */}
          <View style={styles.overlayContainer}>
            <Text style={styles.overlayText}>
              Looking for halal connection. You seem nice. 🌸
            </Text>
            <Text style={styles.overlayText}>
              Liked your adab. Would love to chat.🌿
            </Text>
            <Text style={styles.overlayText}>
              With respect—liked your profile. Salaam.✨
            </Text>
            <Text style={styles.overlayText}>
              Good vibes from your profile. Salaam!
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actinBtn}>
            <Image
              source={require('../../assets/images/one.png')} // 👈 your wink image
              style={styles.actionImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actiontn}>
            <Image
              source={require('../../assets/images/onee.png')} // 👈 your wink image
              style={styles.actionImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actioBtn}>
            <Image
              source={require('../../assets/images/oneee.png')} // 👈 your wink image
              style={styles.actionImg}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Public / Private Tabs */}
        <View style={styles.tabRow}>
          <Text style={[styles.tabText, styles.activeTab]}>Public</Text>
          <Text style={styles.tabText}>Private</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.name}>Niaz Uddin, 28</Text>
          <Text style={styles.location}>📍 Rome, Italy</Text>
          <Text style={styles.location}>Current: Lisbon, Australia</Text>
          <Text style={styles.subText}>An honest guy from Italy</Text>
        </View>

        {/* About Me */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>
              Hi, I am Niaz Uddin. mawmnd po qwdqdma camasd adkdwa, aesocm...
            </Text>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>Height : 175 cm</Text>
            <Text style={styles.tag}>Weight : 68 kg</Text>
          </View>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>Body : Muscular</Text>
            <Text style={styles.tag}>Hair : Brown</Text>
          </View>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>Eye : Black</Text>
            <Text style={styles.tag}>Skin : White</Text>
          </View>
        </View>

        {/* Religion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Religion details</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>Islam</Text>
            <Text style={styles.tag}>Sunni</Text>
          </View>
          <Text style={styles.tag}>Prayer: 5 times a day</Text>
          <Text style={styles.tag}>No specific dresscode</Text>
        </View>

        {/* Personal Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>Never married</Text>
            <Text style={styles.tag}>Master's degree</Text>
          </View>
          <Text style={styles.tag}>Engineer</Text>
        </View>

        {/* Interests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>Shopping</Text>
            <Text style={styles.tag}>Traveling</Text>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.tagRow}>
            <Text style={styles.tag}>Gender: Female</Text>
            <Text style={styles.tag}>Age: 25-30</Text>
          </View>
        </View>

        {/* Posts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Posts</Text>
          <View style={styles.postRow}>
            <Image
              source={{uri: 'https://picsum.photos/100/100?random=1'}}
              style={styles.postImg}
            />
            <Image
              source={{uri: 'https://picsum.photos/100/100?random=2'}}
              style={styles.postImg}
            />
            <Image
              source={{uri: 'https://picsum.photos/100/100?random=3'}}
              style={styles.postImg}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OtherProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFEFF4'},
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

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -25,
  },
  actionBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  actionImg: {
    width: 65,
    height: 65,
  },

  actionText: {fontWeight: 'bold', color: '#E91E63'},
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
});
