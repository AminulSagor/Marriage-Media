import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

const {width, height} = Dimensions.get('window');

// Flame Users
const flameUsers = [
  {
    id: 1,
    name: 'Niaz Uddin',
    location: 'Rome, Italy',
    likes: '0.2k',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  },
  {
    id: 2,
    name: 'Sarah Khan',
    location: 'Paris, France',
    likes: '1.1k',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce',
  },
  {
    id: 3,
    name: 'David Miller',
    location: 'Berlin, Germany',
    likes: '876',
    image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a',
  },
  {
    id: 4,
    name: 'Emily Brown',
    location: 'New York, USA',
    likes: '2.1k',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  },
];

// Discover Users (6)
const discoverUsers = [
  {
    id: 6,
    name: 'Alice Cooper',
    location: 'London, UK',
    likes: '3.4k',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  },
  {
    id: 7,
    name: 'Michael Smith',
    location: 'Toronto, Canada',
    likes: '1.9k',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  },
  {
    id: 8,
    name: 'Sophia Loren',
    location: 'Madrid, Spain',
    likes: '2.7k',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  },
  {
    id: 9,
    name: 'James Bond',
    location: 'London, UK',
    likes: '4.1k',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
  },
  {
    id: 10,
    name: 'Isabella Rossi',
    location: 'Rome, Italy',
    likes: '2.3k',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  },
  {
    id: 11,
    name: 'Ethan Hunt',
    location: 'Sydney, Australia',
    likes: '3.0k',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39',
  },
];

// Premium Users (6)
const premiumUsers = [
  {
    id: 12,
    name: 'Olivia Martinez',
    location: 'Mexico City, Mexico',
    likes: '5.2k',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  },
  {
    id: 13,
    name: 'William Johnson',
    location: 'Chicago, USA',
    likes: '4.5k',
    image: 'https://images.unsplash.com/photo-1546456073-6712f79251bb',
  },
  {
    id: 14,
    name: 'Emma Wilson',
    location: 'Melbourne, Australia',
    likes: '3.7k',
    image: 'https://images.unsplash.com/photo-1532074205216-d0e1f4b87368',
  },
  {
    id: 15,
    name: 'Liam Anderson',
    location: 'Oslo, Norway',
    likes: '2.9k',
    image: 'https://images.unsplash.com/photo-1548142813-c348350df52b',
  },
  {
    id: 16,
    name: 'Ava Taylor',
    location: 'Dubai, UAE',
    likes: '6.0k',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  },
  {
    id: 17,
    name: 'Noah Davis',
    location: 'Los Angeles, USA',
    likes: '5.8k',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
  },
];

const HeartScreen = ({navigation}) => {
  const [cards, setCards] = useState(flameUsers);
  const [activeTab, setActiveTab] = useState('Flame'); // 🔥 Track active tab

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Image
          source={{uri: 'https://i.pravatar.cc/100'}}
          style={styles.avatar}
        />
        <Text style={styles.heading}>
          {activeTab === 'Flame'
            ? 'Flame'
            : activeTab === 'Discover'
            ? 'Discover'
            : 'Premium'}
        </Text>
        <TouchableOpacity
          onPress={() => navigation?.navigate('NearUser')}
          style={styles.scanBtn}>
          <Image
            source={require('../../assets/images/newAdd.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Sub Header */}
      <View style={styles.subHeader}>
        <View style={styles.tabRow}>
          {['Flame', 'Discover', 'Premium'].map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTab]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={() => navigation?.navigate('FilterScreen')}>
          <Feather name="sliders" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Tabs Content */}
      <View style={{flex: 1}}>
        {activeTab === 'Flame' && (
          <View style={styles.swiperContainer}>
            <Swiper
              cards={cards}
              renderCard={card => (
                <View style={styles.cardContainer}>
                  <Image source={{uri: card.image}} style={styles.cardImage} />
                  <View style={styles.likeBadge}>
                    <Text style={styles.likeText}>{card.likes} ❤️</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.name}>{card.name}</Text>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-sharp" size={16} color="#fff" />
                      <Text style={styles.location}>{card.location}</Text>
                    </View>
                  </View>
                </View>
              )}
              backgroundColor="transparent"
              cardVerticalMargin={20}
              stackSize={5}
              cardIndex={0}
              showSecondCard
              animateCardOpacity
              infinite
              onSwiped={cardIndex =>
                console.log('Swiped card index:', cardIndex)
              }
              onSwipedAll={() => console.log('All cards swiped')}
            />
          </View>
        )}

        {(activeTab === 'Discover' || activeTab === 'Premium') && (
          <ScrollView contentContainerStyle={styles.gridContainer}>
            {cards.map(user => (
              <View key={user.id} style={styles.gridCard}>
                <Image source={{uri: user.image}} style={styles.gridImage} />
                <View style={styles.gridLikeBadge}>
                  <Text style={styles.likeText}>{user.likes} ❤️</Text>
                </View>
                <View style={styles.gridFooter}>
                  <Text style={styles.gridName}>{user.name}</Text>
                  <Text style={styles.gridLocation}>{user.location}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Like / Dislike Buttons (Only for Flame) */}
      {activeTab === 'Flame' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.crossButton}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartButton}>
            <Ionicons name="heart" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HeartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabText: {
    marginRight: 20,
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    color: '#f1499d',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#f1499d',
    paddingBottom: 2,
  },
  scanBtn: {
    padding: 10,
    borderRadius: 12,
  },
  swiperContainer: {
    height: height * 0.55,
  },
  cardContainer: {
    height: height * 0.75,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  likeBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#f1499d',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  likeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardFooter: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  name: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    color: '#fff',
    marginLeft: 5,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  crossButton: {
    width: 60,
    height: 60,
    backgroundColor: '#ccc',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  heartButton: {
    width: 60,
    height: 60,
    backgroundColor: '#f1499d',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabs: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // 🔥 Grid styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 100,
  },
  gridCard: {
    width: width * 0.42,
    height: height * 0.28,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridLikeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f1499d',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  gridFooter: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  gridName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  gridLocation: {
    color: '#fff',
    fontSize: 12,
  },
});
