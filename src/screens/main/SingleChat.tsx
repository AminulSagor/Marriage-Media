import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Switch,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SingleChat = ({navigation}) => {
  const [popupVisible, setPopupVisible] = useState(false);

  // toggle states
  const [mute, setMute] = useState(false);
  const [block, setBlock] = useState(false);
  const [unblur, setUnblur] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const tabNavigator = navigation.getParent()?.getParent();
      tabNavigator?.setOptions({tabBarStyle: {display: 'none'}});
      return () => {
        tabNavigator?.setOptions({tabBarStyle: undefined});
      };
    }, [navigation]),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Image
          source={{uri: 'https://placehold.co/32x32'}}
          style={styles.avatar}
        />
        <Text style={styles.username}>Andrew adam</Text>
        <View style={styles.headerIcons}>
          <Icon name="call" size={22} color="#ff4f91" style={styles.icon} />
          <Icon name="videocam" size={22} color="#ff4f91" style={styles.icon} />
          <TouchableOpacity onPress={() => setPopupVisible(true)}>
            <Icon name="information-circle" size={22} color="#ff4f91" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Body */}
      <View style={styles.chatBody}>
        <View style={styles.messageContainer}>
          <Image
            source={{uri: 'https://placehold.co/28x28'}}
            style={styles.msgAvatar}
          />
          <View style={styles.msgBubble}>
            <Text style={styles.msgText}>Hi how are you</Text>
          </View>
        </View>
      </View>

      {/* Accept/Decline Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.acceptBtn}>
          <Text style={styles.actionText}>Accept ✓</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.declineBtn}>
          <Text style={styles.actionText}>Decline ✕</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Input */}
      <View style={styles.inputArea}>
        <Icon name="camera" size={22} color="#ff4f91" />
        <Icon name="images" size={22} color="#ff4f91" />
        <Icon name="mic" size={22} color="#ff4f91" />
        <TextInput placeholder="Aa" style={styles.input} />
        <TouchableOpacity>
          <Icon name="send" size={22} color="#ff4f91" />
        </TouchableOpacity>
      </View>

      {/* Popup Modal */}
      <Modal
        visible={popupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setPopupVisible(false)}>
          <View style={styles.popup}>
            <View style={styles.row}>
              <Text style={styles.text}>Mute audio / video calls</Text>
              <Switch value={mute} onValueChange={setMute} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Block this person</Text>
              <Switch value={block} onValueChange={setBlock} />
            </View>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.text}>Delete Conversation</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={[styles.text, {color: 'red', marginLeft: 6}]}>
                Report technical problems
              </Text>
              <Icon name="alert-circle-outline" size={18} color="red" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
              <Text style={[styles.text, {color: 'red', marginLeft: 6}]}>
                Report this person
              </Text>
              <Icon name="warning-outline" size={18} color="red" />
            </TouchableOpacity>
            <View style={styles.row}>
              <Text style={styles.text}>Unblur my photo</Text>
              <Switch value={unblur} onValueChange={setUnblur} />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#ffe6f0'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffb6c9',
    padding: 12,
    paddingTop: 40,
  },
  avatar: {width: 32, height: 32, borderRadius: 16, marginHorizontal: 6},
  username: {flex: 1, fontWeight: '600', fontSize: 16, color: '#000'},
  headerIcons: {flexDirection: 'row', alignItems: 'center', gap: 8},
  icon: {marginHorizontal: 6},
  chatBody: {flex: 1, padding: 16},
  messageContainer: {flexDirection: 'row', alignItems: 'flex-start'},
  msgAvatar: {width: 28, height: 28, borderRadius: 14, marginRight: 6},
  msgBubble: {
    backgroundColor: '#ff8fc5',
    borderRadius: 18,
    padding: 10,
    maxWidth: '70%',
  },
  msgText: {color: '#fff'},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 10,
  },
  acceptBtn: {
    backgroundColor: '#ff8fc5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  declineBtn: {
    backgroundColor: '#ff8fc5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: {color: '#fff', fontWeight: '600'},
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 300,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // ensures toggle is on right
    marginVertical: 12,
  },
  text: {fontSize: 15, color: '#000'},
});

export default SingleChat;
