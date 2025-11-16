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
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface PhotoUploadProps {
  navigation: any;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {data, update} = useSignupFlow();

  const [images, setImages] = useState<(any | null)[]>([null, null, null]);
  const [blur, setBlur] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');

  const pickImage = (index: number) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Image pick failed');
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) return;

        const next = [...images];
        next[index] = asset;
        setImages(next);
      },
    );
  };
  console.log(data);
  const confirmUpload = () => {
    const uploaded = images.filter(Boolean);
    if (uploaded.length < 3) {
      Alert.alert('Hold on', 'Please upload at least 3 photos.');
      return;
    }

    update({
      pro_path: images[0],
      image_one: images[1],
      image_two: images[2],
      // blur_photos: blur,
      // privacy: privacy,
    });
    navigation.navigate('FaceVerify');
  };

  const renderUploadBox = (index: number, style?: any) => (
    <TouchableOpacity
      key={index}
      style={[styles.uploadBox, style]}
      onPress={() => pickImage(index)}
      activeOpacity={0.9}>
      {images[index] ? (
        <Image
          source={{uri: (images[index] as any).uri}}
          style={styles.image}
          blurRadius={blur ? 8 : 0}
        />
      ) : (
        <>
          <Icon name="cloud-upload-outline" size={28} color="#999" />
          <Text style={styles.uploadText}>Upload at least 3 photos</Text>
        </>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.blurToggle}
            onPress={() => setBlur(prev => !prev)}>
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
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: (insets.bottom || 16) + 90}, // space for button
          ]}>
          {/* Title */}
          <Text style={styles.title}>Upload your photo</Text>

          {/* Main large photo */}
          {renderUploadBox(0, styles.largeBox)}

          {/* Public option */}
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

          {/* Two smaller photos */}
          <View style={styles.row}>
            {renderUploadBox(1, styles.smallBox)}
            {renderUploadBox(2, styles.smallBox)}
          </View>

          {/* Private option */}
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

        {/* Confirm Button pinned above bottom inset */}
        <TouchableOpacity
          style={[styles.confirmButton, {bottom: (insets.bottom || 16) + 16}]}
          onPress={confirmUpload}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PhotoUpload;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 10,
  },
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
  scrollContent: {
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    alignSelf: 'flex-start',
    color: '#000',
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
    left: 20,
    right: 20,
    backgroundColor: '#f43f5e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
