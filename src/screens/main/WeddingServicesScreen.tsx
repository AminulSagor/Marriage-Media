import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';

const WeddingServicesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/1.jpg',
            }}
            style={styles.avatar}
          />
          <View style={{flex: 1}}>
            <Text style={styles.welcome}>Welcome, Jhon</Text>
            <Text style={styles.location}>📍 Rome, Italy</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            placeholder="What are you looking for?"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Wedding services Nearby</Text>
            <Text style={styles.subText}>Where every bite tells a story!</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.linkText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Service Card */}
        <View style={styles.card}>
          <Image
            source={{uri: 'https://picsum.photos/400/200'}}
            style={styles.cardImage}
          />

          <TouchableOpacity style={styles.likeBadge}>
            <Ionicons name="heart" size={14} color="#fff" />
            <Text style={styles.likeText}>2.1k</Text>
          </TouchableOpacity>

          <View style={{marginTop: 10}}>
            <Text style={styles.cardTitle}>Nurani cake shop</Text>
            <Text style={styles.cardLocation}>📍 Rome, Italy</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.rating}>(5.0)</Text>
          </View>

          {/* About */}
          <Text style={styles.cardSubtitle}>About us:</Text>
          <Text style={styles.cardText}>
            Where every bite tells a story! From creamy cheesecakes to rich
            chocolate delights, we bake dreams into reality.
          </Text>

          {/* Contact */}
          <Text style={styles.cardSubtitle}>Contact:</Text>
          <Text style={styles.contact}>📞 +012941246</Text>
          <Text style={styles.contact}>📧 yourgmail.com</Text>
          <Text style={styles.contact}>🔗 https://cakeshop.com</Text>

          {/* Services */}
          <Text style={styles.cardSubtitle}>Our services:</Text>
          <Text style={styles.cardText}>
            Lorem ipsum dolor sit amet consectetur wamis ultricies tristique
            duis amet suspendisse convallis vestibulum habitant in est.
          </Text>

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Contact Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Customer Reviews :</Text>
          <TouchableOpacity style={styles.reviewBtn}>
            <Text style={styles.reviewBtnText}>Add review</Text>
          </TouchableOpacity>
        </View>

        {/* Review Item */}
        <View style={styles.reviewCard}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/women/44.jpg',
            }}
            style={styles.reviewAvatar}
          />
          <View style={{flex: 1}}>
            <Text style={styles.reviewName}>Amina ⭐⭐⭐</Text>
            <Text style={styles.reviewText}>
              “The cake was not only stunning but absolutely delicious! Everyone
              at the party asked where it was from.”
            </Text>
          </View>
        </View>

        <View style={styles.reviewCard}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/46.jpg',
            }}
            style={styles.reviewAvatar}
          />
          <View style={{flex: 1}}>
            <Text style={styles.reviewName}>Ahmed ⭐⭐⭐⭐⭐</Text>
            <Text style={styles.reviewText}>
              "Amazing service and the cupcakes were a hit! So soft and
              flavorful – will definitely order again."
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeddingServicesScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFEFF4'},
  header: {flexDirection: 'row', alignItems: 'center', padding: 16},
  avatar: {width: 45, height: 45, borderRadius: 25, marginRight: 12},
  welcome: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  location: {fontSize: 13, color: '#555'},

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
  },
  searchInput: {flex: 1, fontSize: 14, marginLeft: 6, color: '#000'},

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  subText: {fontSize: 13, color: '#555'},
  linkText: {fontSize: 13, color: '#E91E63', fontWeight: 'bold'},

  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 14,
    elevation: 3,
  },
  cardImage: {width: '100%', height: 200, borderRadius: 12},
  likeBadge: {
    position: 'absolute',
    top: 25,
    right: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  likeText: {color: '#fff', marginLeft: 4, fontSize: 12},
  cardTitle: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  cardLocation: {fontSize: 13, color: '#555'},
  ratingRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  stars: {fontSize: 14},
  rating: {fontSize: 13, marginLeft: 5, color: '#555'},
  cardSubtitle: {marginTop: 10, fontWeight: 'bold', color: '#000'},
  cardText: {fontSize: 13, color: '#555', marginTop: 2},
  contact: {fontSize: 13, color: '#333', marginTop: 2},

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: '#E91E63',
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  primaryText: {color: '#fff', fontWeight: 'bold'},
  secondaryBtn: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  secondaryText: {color: '#000', fontWeight: 'bold'},

  reviewBtn: {
    backgroundColor: '#E91E63',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  reviewBtnText: {fontSize: 12, color: '#fff'},

  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  reviewAvatar: {width: 40, height: 40, borderRadius: 20, marginRight: 12},
  reviewName: {fontWeight: 'bold', color: '#000', marginBottom: 4},
  reviewText: {fontSize: 13, color: '#555'},
});
