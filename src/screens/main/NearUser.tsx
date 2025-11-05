import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const {width} = Dimensions.get('window');

const users = [
  {
    id: '1',
    name: 'Jak Devin',
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: '2',
    name: 'Neha',
    image: 'https://randomuser.me/api/portraits/women/20.jpg',
  },
  {
    id: '3',
    name: 'Faruqi',
    image: 'https://randomuser.me/api/portraits/men/30.jpg',
  },
  {
    id: '4',
    name: 'Ahmed',
    image: 'https://randomuser.me/api/portraits/men/40.jpg',
  },
];

const tabs = ['Likes me', 'Liked', 'Passed', 'Pings'];

const NearUser = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Likes me');

  const renderUser = ({item}) => (
    <View style={styles.userCard}>
      <Image source={{uri: item.image}} style={styles.avatar} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation?.navigate('MatchScreen')}
          style={styles.checkButton}>
          <Icon name="check" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.crossButton}>
          <Icon name="close" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Avatar */}
      <Image
        source={{uri: 'https://randomuser.me/api/portraits/men/1.jpg'}}
        style={styles.topAvatar}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
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

      {/* List */}
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={renderUser}
        contentContainerStyle={{paddingTop: 10}}
      />
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
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
  },
  badge: {
    backgroundColor: '#FF2F6C',
    borderRadius: 10,
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  checkButton: {
    backgroundColor: '#FFC0CB',
    padding: 8,
    borderRadius: 20,
  },
  crossButton: {
    backgroundColor: '#FF5A76',
    padding: 8,
    borderRadius: 20,
  },
});

export default NearUser;
