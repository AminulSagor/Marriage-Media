import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';

const PhotoUpload = ({navigation}) => {
  const [images, setImages] = useState([null, null, null]);
  const [blur, setBlur] = useState(false);
  const [privacy, setPrivacy] = useState('public'); // public | private

  const pickImage = index => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage);
        } else {
          const newImages = [...images];
          newImages[index] = response.assets[0];
          setImages(newImages);
        }
      },
    );
  };

  const confirmUpload = () => {
    const uploaded = images.filter(img => img !== null);
    if (uploaded.length < 3) {
      Alert.alert('Please upload at least 3 photos');
      return;
    }
    Alert.alert(
      'Success',
      `Photos uploaded (${privacy === 'public' ? 'Public' : 'Private'})!`,
    );
    navigation?.navigate('FaceVerify');
  };

  const renderUploadBox = (index, style) => (
    <TouchableOpacity
      key={index}
      style={[styles.uploadBox, style]}
      onPress={() => pickImage(index)}
      activeOpacity={0.9}>
      {images[index] ? (
        <Image
          source={{uri: images[index].uri}}
          style={styles.image}
          blurRadius={blur ? 8 : 0}
        />
      ) : (
        <>
          <Icon name="cloud-upload-outline" size={28} color="#999" />
          <Text style={styles.uploadText}>upload at least 3 photo</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blurToggle}
          onPress={() => setBlur(!blur)}>
          <Icon
            name={blur ? 'checkbox' : 'square-outline'}
            size={18}
            color="#f43f5e"
          />
          <Text style={styles.blurText}>Blur photos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 120}}>
        {/* Title */}
        <Text style={styles.title}>Upload your photo</Text>

        {/* Upload Boxes */}
        {renderUploadBox(0, styles.largeBox)}

        {/* Privacy options */}
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setPrivacy('public')}>
            <Icon
              name={
                privacy === 'public' ? 'radio-button-on' : 'radio-button-off'
              }
              size={18}
              color="#f43f5e"
            />
            <Text style={styles.radioText}>This photo will be public</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          {renderUploadBox(1, styles.smallBox)}
          {renderUploadBox(2, styles.smallBox)}
        </View>

        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioOption}
            onPress={() => setPrivacy('private')}>
            <Icon
              name={
                privacy === 'private' ? 'radio-button-on' : 'radio-button-off'
              }
              size={18}
              color="#f43f5e"
            />
            <Text style={styles.radioText}>Keep these photos private</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={confirmUpload}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PhotoUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {padding: 5},
  blurToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blurText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#000',
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 20,
    alignSelf: 'flex-start',
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: '#f43f5e',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  largeBox: {
    width: '100%',
    height: 160,
  },
  smallBox: {
    width: '48%',
    height: 120,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  uploadText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
  },
  radioContainer: {
    marginVertical: 8,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#000',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f43f5e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
