import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import type {PostImageFile} from '../api/posts'; // adjust path

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  onPost: (caption: string, image?: PostImageFile | null) => void;
  isPosting?: boolean;
}

const PostModal: React.FC<PostModalProps> = ({
  visible,
  onClose,
  onPost,
  isPosting = false,
}) => {
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<PostImageFile | null>(
    null,
  );

  // 🔥 Reset fields whenever modal is closed (including after successful post)
  useEffect(() => {
    if (!visible) {
      setCaption('');
      setSelectedImage(null);
    }
  }, [visible]);

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, res => {
      if (res.didCancel || res.errorCode) return;
      const asset: Asset | undefined = res.assets?.[0];
      if (asset?.uri) {
        setSelectedImage({
          uri: asset.uri,
          name: asset.fileName ?? 'post.jpg',
          type: asset.type ?? 'image/jpeg',
        });
      }
    });
  };

  const handlePost = () => {
    if (isPosting) return;
    onPost(caption.trim(), selectedImage);
  };

  const handleClose = () => {
    onClose(); // state reset handled by useEffect when visible -> false
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Create a post</Text>

              <TextInput
                placeholder="write something for your post.."
                placeholderTextColor="#aaa"
                style={styles.input}
                multiline
                value={caption}
                onChangeText={setCaption}
              />

              {selectedImage?.uri ? (
                <Image
                  source={{uri: selectedImage.uri}}
                  style={styles.preview}
                />
              ) : null}

              <View style={styles.iconRow}>
                <TouchableOpacity
                  style={styles.iconBox}
                  onPress={handlePickImage}>
                  <Icon name="image" size={20} color="#f47ca0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBox}>
                  <Icon name="video" size={20} color="#f47ca0" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBox}>
                  <Icon name="smile" size={20} color="#f47ca0" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.postButton}
                onPress={handlePost}
                disabled={isPosting}>
                <Text style={styles.postText}>
                  {isPosting ? 'Posting...' : 'Post'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
  preview: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 4,
    resizeMode: 'cover',
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
