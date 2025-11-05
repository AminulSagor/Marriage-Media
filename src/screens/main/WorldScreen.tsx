import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');

const WorldScreen = ({navigation}) => {
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const categories = [
    'Wedding Planning & Coordination',
    'Fashion & Beauty',
    'Religious & Legal Services',
    'Photography & Videography',
    'Venues & Locations',
    'Catering & Food',
    'Decor & Design',
    'Entertainment',
    'Transportation',
    'Stationery & Printing',
    'Post-Wedding & Honeymoon',
    'Gifts & Favors',
  ];
  return (
    <ScrollView
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 50}}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/img1.png')}
          style={styles.profileImage}
        />
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#aaa" />
          <TextInput
            placeholder="locations"
            placeholderTextColor="#ccc"
            style={styles.locationInput}
          />
          <TouchableOpacity onPress={() => setLocationModalVisible(true)}>
            <Icon name="location-sharp" size={20} color="#EC9BEE" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome */}
      <Text style={styles.welcomeText}>Welcome, Jhon</Text>

      {/* Find Businesses Search */}
      <View style={styles.findBusinessBar}>
        <Icon name="search" size={18} color="#aaa" />
        <TextInput
          placeholder="Find businesses"
          placeholderTextColor="#ccc"
          style={styles.findInput}
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Icon name="options-outline" size={22} color="#3399FF" />
        </TouchableOpacity>
      </View>

      {/* Businesses Nearby */}
      <Text style={styles.sectionTitle}>Businesses Nearby</Text>
      <View style={styles.businessCard}>
        <Image
          source={require('../../assets/images/img6.png')}
          style={styles.businessImage}
        />
        <View style={styles.businessOverlay}>
          <Image
            source={require('../../assets/images/cake.png')}
            style={styles.overlayIcon}
          />
          <Text style={styles.overlayLabel}>Cake house</Text>
          <Text style={styles.distanceBadge}>1km</Text>
        </View>
      </View>

      {/* Add Business */}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Add your Business</Text>
        <Text style={styles.addButtonPlus}>+</Text>
      </TouchableOpacity>

      {/* Wedding Services Nearby */}
      <Text style={styles.sectionTitle}>Wedding services Nearby</Text>
      <View style={styles.cardGrid}>
        {[
          {
            name: 'Jhon Imran',
            location: 'Rome, Italy',
            image: require('../../assets/images/img2.png'),
            likes: '2.1k',
          },
          {
            name: 'Niaz Uddin',
            location: 'Rome, Italy',
            image: require('../../assets/images/img3.png'),
            likes: '0.2k',
          },
          {
            name: 'Ibrahim Khalil',
            location: 'Rome, Italy',
            image: require('../../assets/images/img4.png'),
            likes: '2.1k',
          },
          {
            name: 'Niaz Uddin',
            location: 'Rome, Italy',
            image: require('../../assets/images/img5.png'),
            likes: '2.1k',
          },
        ].map((item, index) => (
          <TouchableOpacity
            onPress={() => navigation?.navigate('WeddingServicesScreen')}
            key={index}
            style={styles.serviceCard}>
            <Image source={item.image} style={styles.cardImage} />
            <View style={styles.likeBadge}>
              <Text style={styles.likeText}>{item.likes} 💗</Text>
            </View>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardLocation}>{item.location}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Modal
        transparent
        visible={locationModalVisible}
        animationType="fade"
        onRequestClose={() => setLocationModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Icon name="location" size={40} color="#5CA3FF" />
            <Text style={styles.modalTitle}>
              Allow AROOSI to access this device’s approximate location?
            </Text>

            <Image
              source={require('../../assets/images/world.png')}
              style={styles.worldIcon}
            />

            {/* Buttons */}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.optionText}>While using the app</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.optionText}>Only this time</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => setLocationModalVisible(false)}>
              <Text style={styles.optionText}>Don’t allow</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        transparent
        visible={filterModalVisible}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.filterItem}
                  onPress={() => setFilterModalVisible(false)}>
                  <Text style={styles.filterText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFEFF5',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-between',
  },
  locationInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
  },
  findBusinessBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  findInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  businessCard: {
    marginBottom: 20,
    alignItems: 'center',
  },
  businessImage: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  businessOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 30,
  },
  overlayIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 2,
  },
  overlayLabel: {
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  distanceBadge: {
    backgroundColor: '#EC4D73',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
    fontSize: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#EC4D73',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#EC4D73',
    marginRight: 4,
  },
  addButtonPlus: {
    color: '#EC4D73',
    fontSize: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardName: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: '#666',
  },
  likeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EC4D73',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  likeText: {
    color: '#fff',
    fontSize: 10,
  },
  filterBox: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  filterItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  filterText: {
    fontSize: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  worldIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  optionButton: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  optionText: {
    color: '#000',
    fontSize: 14,
  },
});

export default WorldScreen;
