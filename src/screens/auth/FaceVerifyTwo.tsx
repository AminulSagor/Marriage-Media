import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface FaceVerifyTwoProps {
  navigation: any;
}

const COUNTRIES = [
  'High School',
  'Bachelor’s Degree',
  'Master’s Degree',
  'PhD',
  'Other',
];

const FaceVerifyTwo: React.FC<FaceVerifyTwoProps> = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const {data} = useSignupFlow();
  console.log(data);

  // (Search bits are currently unused visually; keeping for future if needed)
  const filteredCountries = COUNTRIES.filter(item =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirm = () => {
    navigation?.navigate('BestMatch');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/face1.png')}
        style={styles.background}
        resizeMode="cover">
        {/* Back + Title */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Icon name="chevron-back" size={24} color="#000" />
          <Text style={styles.title}>Security</Text>
        </TouchableOpacity>

        {/* Confirm */}
        <TouchableOpacity onPress={handleConfirm} style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default FaceVerifyTwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: '#FF3C7B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
