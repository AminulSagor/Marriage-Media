import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const GenderScreen = ({navigation}) => {
  const [selectedGender, setSelectedGender] = useState<
    'Male' | 'Female' | null
  >('Male');

  const handleConfirm = () => {
    console.log('Selected Gender:', selectedGender);
    // Navigate or submit the gender
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/images/gender.png')}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 30,
              gap: 80,
            }}>
            <TouchableOpacity style={styles.backButton}>
              <Icon name="chevron-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Basic Identity</Text>
          </View>

          <Text style={styles.subtitle}>Your gender ?</Text>

          <View style={styles.genderContainer}>
            {['Female', 'Male'].map(gender => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderOption,
                  selectedGender === gender && styles.genderOptionSelected,
                ]}
                onPress={() => setSelectedGender(gender as 'Male' | 'Female')}>
                <Text
                  style={[
                    styles.genderText,
                    selectedGender === gender && styles.genderTextSelected,
                  ]}>
                  {gender}
                </Text>
                <View
                  style={[
                    styles.radioCircle,
                    selectedGender === gender && styles.radioSelected,
                  ]}>
                  {selectedGender === gender && (
                    <View style={styles.radioDot} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => navigation.navigate('IdentityScreen')}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default GenderScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    flex: 1,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
  },
  genderContainer: {
    gap: 20,
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#f6f6f6',
  },
  genderOptionSelected: {
    borderColor: '#FF2D7A',
    backgroundColor: '#fff',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#aaa',
  },
  genderTextSelected: {
    color: '#000',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#FF2D7A',
  },
  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#FF2D7A',
  },
  confirmBtn: {
    marginTop: 'auto',
    backgroundColor: '#FF2D7A',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
