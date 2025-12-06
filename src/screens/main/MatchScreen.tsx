import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getOrCreate1to1} from '../../services/chat';

type MatchRouteParams = {
  currentUser?: {
    id: number;
    name: string;
    avatar?: string;
  };
  matchedUser?: {
    id: number;
    name: string;
    avatar?: string;
  };
};

const MatchScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {currentUser, matchedUser} = (route.params || {}) as MatchRouteParams;

  const userImageSource = currentUser?.avatar
    ? {uri: currentUser.avatar}
    : require('../../assets/images/pic10.png');

  const matchedUserImageSource = matchedUser?.avatar
    ? {uri: matchedUser.avatar}
    : require('../../assets/images/pic11.png');

  const bgImage = require('../../assets/images/pic12.png');

  const handleMessagePress = async () => {
    try {
      if (!currentUser?.id || !matchedUser?.id) {
        console.warn('Missing ids for chat');
        return;
      }

      const chatId = await getOrCreate1to1(currentUser.id, matchedUser.id, '');

      /**
       * ⬇️ VERY IMPORTANT:
       * Use the SAME route name you registered in your navigator
       * for the 1–1 chat screen. Example: "Chat", "ChatRoom", etc.
       */
      navigation.navigate('SingleChat', {
        chatId,
        peerId: matchedUser.id,
        peerName: matchedUser.name,
        peerAvatar: matchedUser.avatar,
      });
    } catch (e) {
      console.log('Failed to open 1-1 chat:', e);
    }
  };

  const handleKeepSwiping = () => {
    // pop two screens if possible, otherwise just goBack twice
    if ((navigation as any).pop) {
      (navigation as any).pop(2);
    } else {
      navigation.goBack();
      navigation.goBack();
    }
  };

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
          <Image source={userImageSource} style={styles.profileImage} />
          <View style={styles.heartContainer}>
            <Image
              source={require('../../assets/images/heart.png')}
              style={styles.heartIcon}
            />
          </View>
          <Image source={matchedUserImageSource} style={styles.profileImage} />
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleMessagePress}>
            <Text style={styles.primaryButtonText}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleKeepSwiping}>
            <Text style={styles.secondaryButtonText}>Keep swiping</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Nav (optional / cosmetic) */}
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
    justifyContent: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55, // ⬅️ circle avatar
    borderWidth: 4, // ⬅️ ring like original
    borderColor: '#f83292',
    marginHorizontal: 10,
  },
  heartContainer: {
    position: 'absolute',
    alignSelf: 'center',
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
