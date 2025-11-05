import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import PostModal from '../../Components/PostModal';

const HomeScreen = ({navigation}) => {
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false); // ⚠️ warning modal

  const stories = [
    {id: '1', name: 'My Story', image: require('../../assets/images/img2.png')},
    {id: '2', name: 'Salina', image: require('../../assets/images/img1.png')},
    {id: '3', name: 'Laisa', image: require('../../assets/images/pic10.png')},
    {id: '4', name: 'Niaz', image: require('../../assets/images/img1.png')},
  ];

  const posts = [
    {
      id: '1',
      user: 'Salina Akhter',
      time: '34mins ago',
      image: require('../../assets/images/rtc1.png'),
      avatar: require('../../assets/images/pic10.png'),
      text: 'Lorem ipsum dolor sit amet...',
      likes: '4.9k',
      comments: '1k',
    },
    {
      id: '2',
      user: 'Suhana Khan',
      time: '14mins ago',
      image: require('../../assets/images/rtc.png'),
      avatar: require('../../assets/images/img1.png'),
      text: 'Lorem ipsum dolor sit amet...',
      likes: '3.5k',
      comments: '1k',
    },
  ];

  const renderStory = ({item}) => (
    <TouchableOpacity
      onPress={() => navigation?.navigate('OtherProfileScreen')}
      style={styles.storyItem}>
      <Image source={item.image} style={styles.storyImage} />
      <Text style={styles.storyText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderPost = post => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image source={post.avatar} style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{post.user}</Text>
          <Text style={styles.time}>{post.time}</Text>
        </View>
        <Icon
          name="ellipsis-vertical"
          size={20}
          color="#000"
          style={{marginLeft: 'auto'}}
        />
      </View>
      {post.image ? (
        <Image source={post.image} style={styles.postImage} />
      ) : (
        <View style={styles.postImagePlaceholder} />
      )}
      <Text style={styles.postText}>{post.text}</Text>
      <View style={styles.reactions}>
        <Text>❤️ {post.likes}</Text>
        <Text>💬 {post.comments}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-back" size={24} />
        <View style={styles.headerIcons}>
          {/* 🔔 Show warning modal here */}
          <TouchableOpacity onPress={() => setShowWarning(true)}>
            <Icon name="notifications-outline" size={24} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation?.navigate('ChatScreen')}>
            <Icon name="chatbubble-ellipses-outline" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stories */}
      <FlatList
        data={stories}
        renderItem={renderStory}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      />

      {/* Posts */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {posts.map(post => (
          <View key={post.id}>{renderPost(post)}</View>
        ))}
      </ScrollView>

      {/* ✅ Floating Plus Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}>
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* ✅ Post Modal */}
      <PostModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onPost={() => {
          setShowModal(false);
        }}
      />

      {/* ⚠️ Warning Modal */}
      <Modal
        visible={showWarning}
        animationType="fade"
        transparent
        onRequestClose={() => setShowWarning(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.warningBox}>
            <Icon name="warning-outline" size={40} color="red" />
            <Text style={styles.warningText}>
              We got a report against you. Be polite
            </Text>
            <TouchableOpacity
              onPress={() => setShowWarning(false)}
              style={styles.closeBtn}>
              <Text style={{color: '#fff'}}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: 40},
  fab: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    backgroundColor: '#f04b60',
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerIcons: {flexDirection: 'row', marginLeft: 'auto'},
  icon: {marginRight: 12},
  storiesContainer: {paddingHorizontal: 10, marginBottom: 15},
  storyItem: {alignItems: 'center', marginRight: 14},
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'deeppink',
  },
  storyText: {marginTop: 5, fontSize: 12, color: '#333'},
  postContainer: {
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    marginHorizontal: 10,
    borderRadius: 12,
    padding: 10,
  },
  postHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 8},
  avatar: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  userName: {fontWeight: 'bold', fontSize: 14},
  time: {fontSize: 12, color: '#666'},
  postImage: {width: '100%', height: 180, borderRadius: 10, marginTop: 8},
  postImagePlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#ddd',
    borderRadius: 10,
    marginTop: 8,
  },
  postText: {fontSize: 13, color: '#333', marginTop: 8},
  reactions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  // ⚠️ Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  warningBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: 300,
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
  },
  closeBtn: {
    marginTop: 10,
    backgroundColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
