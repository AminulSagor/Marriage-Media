import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MatchScreen = () => {
  const navigation = useNavigation();

  // Replace with actual images or URLs
  const userImage = require('../../assets/images/pic10.png');
  const matchedUserImage = require('../../assets/images/pic11.png');
  const bgImage = require('../../assets/images/pic12.png');

  return (
    <ImageBackground
      source={bgImage}
      style={styles.backgroundImage}
      resizeMode="cover">
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>

        {/* Match Text */}
        <Text style={styles.matchText}>It's a match</Text>

        {/* Profile Images + Heart */}
        <View style={styles.profileContainer}>
          <Image source={userImage} style={styles.profileImage} />
          <View style={styles.heartContainer}>
            <Image
              source={require('../../assets/images/heart.png')}
              style={styles.heartIcon}
            />
          </View>
          <Image source={matchedUserImage} style={styles.profileImage} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>messege</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Keep swiping</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Nav */}
        <View style={styles.bottomNav}>
          <Ionicons name="person-circle-outline" size={24} color="white" />
          <Ionicons name="chatbubble-outline" size={24} color="white" />
          <Ionicons name="heart-outline" size={24} color="white" />
          <Ionicons name="home-outline" size={24} color="white" />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  matchText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 40,
    marginBottom: 30,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    // borderRadius: 60,
    // borderWidth: 4,
    // borderColor: '#f83292',
  },
  heartContainer: {
    // marginHorizontal: 2,
  },
  heartIcon: {
    width: 50,
    height: 50,
    tintColor: '#f83292',
    zIndex: 1000,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#f83292',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 15,
    width: '80%',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#fd80ac',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: '80%',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    backgroundColor: '#f83292',
    borderRadius: 40,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 10,
  },
});

export default MatchScreen;
