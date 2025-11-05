import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const onlineUsers = [
  {
    id: '1',
    name: 'Andrew',
    avatar: require('../../assets/images/chat1.png'),
    online: true,
  },
  {
    id: '2',
    name: 'Kabil',
    avatar: require('../../assets/images/chat1.png'),
    online: true,
  },
  {
    id: '3',
    name: 'Ahmed',
    avatar: require('../../assets/images/chat111.png'),
    online: true,
  },
  {
    id: '4',
    name: 'Rubi',
    avatar: require('../../assets/images/chat11.png'),
    online: true,
  },
  {
    id: '5',
    name: 'Melissa',
    avatar: require('../../assets/images/chat1.png'),
    online: true,
  },
  {
    id: '6',
    name: 'Hasan',
    avatar: require('../../assets/images/img1.png'),
    online: true,
  },
];

const messages = [
  {
    id: '1',
    name: 'Andrew adam',
    message: 'Typing...',
    time: '17:32',
    unreadCount: 2,
    avatar: require('../../assets/images/chat1.png'),
    active: true,
  },
  {
    id: '2',
    name: 'Afsana khan',
    message: 'how are you ?',
    time: '11:09',
    unreadCount: 1,
    avatar: require('../../assets/images/chat1.png'),
  },
  {
    id: '3',
    name: 'Himel Mia',
    message: 'how are you ?',
    time: '08:23',
    avatar: require('../../assets/images/chat111.png'),
  },
  {
    id: '4',
    name: 'Nur Nabi',
    message: 'All great here brother',
    time: '17:00',
    avatar: require('../../assets/images/img1.png'),
  },
  {
    id: '5',
    name: 'Md Arafat',
    message: 'it was good ..',
    time: '16:48',
    avatar: require('../../assets/images/chat1.png'),
  },
  {
    id: '6',
    name: 'Melissa',
    message: 'So it should b.',
    time: '16:48',
    avatar: require('../../assets/images/chat11.png'),
  },
];

const tabs = ['Chats', 'Winks (5)', 'Pings (7)', 'Passed'];

const ChatScreen = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Chats');

  const renderOnlineUser = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation?.navigate('OtherProfileScreen')}
      style={styles.onlineUser}>
      <View>
        <Image source={item.avatar} style={styles.onlineAvatar} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <Text style={styles.onlineName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderMessage = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation?.navigate('SingleChat')}
      style={[styles.messageItem, item.active && {backgroundColor: '#ffe1ec'}]}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.messageContent}>
        <Text style={[styles.name, item.active && {fontWeight: 'bold'}]}>
          {item.name}
        </Text>
        <Text style={[styles.message, item.active && {color: '#ff4081'}]}>
          {item.message}
        </Text>
      </View>
      <View style={styles.meta}>
        {item.unreadCount && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/img1.png')}
          style={styles.profilePic}
        />
        <Text style={styles.title}>Inbox (2)</Text>
        <Icon
          name="search-outline"
          size={24}
          color="#ff4081"
          style={{marginLeft: 'auto', marginRight: 16}}
        />
        <Icon name="people-outline" size={24} color="#ff4081" />
      </View>

      {/* Online users */}
      <View>
        <FlatList
          data={onlineUsers}
          horizontal
          keyExtractor={item => item.id}
          renderItem={renderOnlineUser}
          contentContainerStyle={{paddingHorizontal: 10}}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={{paddingBottom: 80}}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe1ec',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profilePic: {width: 36, height: 36, borderRadius: 18, marginRight: 10},
  title: {fontSize: 18, fontWeight: 'bold', color: '#111'},

  onlineUser: {alignItems: 'center', marginRight: 16},
  onlineAvatar: {width: 55, height: 55, borderRadius: 28},
  onlineDot: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 12,
    height: 12,
    backgroundColor: '#4cd964',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  onlineName: {fontSize: 12, marginTop: 4, color: '#444'},

  tabs: {
    flexDirection: 'row',
    marginTop: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabItem: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
  },
  activeTabItem: {backgroundColor: '#ff4081'},
  tabText: {color: '#555', fontSize: 13},
  activeTabText: {color: '#fff', fontWeight: 'bold'},

  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.4,
    borderColor: '#ddd',
  },
  avatar: {width: 48, height: 48, borderRadius: 24, marginRight: 12},
  messageContent: {flex: 1},
  name: {fontSize: 15, color: '#111'},
  message: {fontSize: 13, color: '#777'},
  meta: {alignItems: 'flex-end', justifyContent: 'space-between', height: 40},
  unreadBadge: {
    backgroundColor: '#ff4081',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 4,
  },
  unreadText: {color: '#fff', fontSize: 12},
  time: {fontSize: 12, color: '#888'},

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ff4081',
    paddingVertical: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  navItem: {alignItems: 'center'},
  navText: {fontSize: 11, color: '#fff', marginTop: 2},
});
