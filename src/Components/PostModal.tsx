// PostModal.js
import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const PostModal = ({visible, onClose, onPost}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Create a post</Text>

          <TextInput
            placeholder="write something for your post.."
            placeholderTextColor="#aaa"
            style={styles.input}
            multiline
          />

          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconBox}>
              <Icon name="image" size={20} color="#f47ca0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox}>
              <Icon name="video" size={20} color="#f47ca0" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBox}>
              <Icon name="smile" size={20} color="#f47ca0" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.postButton} onPress={onPost}>
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PostModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 15,
    color: '#000',
  },
  input: {
    borderWidth: 0,
    borderColor: '#ddd',
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#000',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    gap: 12,
  },
  iconBox: {
    backgroundColor: '#fce9f0',
    padding: 12,
    borderRadius: 10,
  },
  postButton: {
    backgroundColor: '#f47ca0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  postText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
