// src/screens/auth/GenderScreen.tsx

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface GenderScreenProps {
  navigation: any;
}

const GenderScreen: React.FC<GenderScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {update} = useSignupFlow();

  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female'>(
    'Male',
  );

  const handleConfirm = () => {
    update({gender: selectedGender});
    navigation.navigate('IdentityScreen');
  };

  return (
    <View style={styles.root}>
      {/* Background under everything */}
      <ImageBackground
        source={require('../../assets/images/gender.png')}
        style={styles.background}
        resizeMode="cover"
      />

      {/* Top safe area + header */}
      <SafeAreaView style={styles.safeTop} edges={['top']}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="black" />
          </TouchableOpacity>

          <Text style={styles.title}>Basic Identity</Text>
        </View>
      </SafeAreaView>

      {/* Content */}
      <View
        style={[styles.content, {paddingBottom: (insets.bottom || 16) + 16}]}>
        <Text style={styles.subtitle}>Your gender?</Text>

        <View style={styles.genderContainer}>
          {['Female', 'Male'].map(gender => {
            const isSelected = selectedGender === gender;
            return (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderOption,
                  isSelected && styles.genderOptionSelected,
                ]}
                onPress={() => setSelectedGender(gender as 'Male' | 'Female')}>
                <Text
                  style={[
                    styles.genderText,
                    isSelected && styles.genderTextSelected,
                  ]}>
                  {gender}
                </Text>
                <View
                  style={[
                    styles.radioCircle,
                    isSelected && styles.radioSelected,
                  ]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.flexSpacer} />

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GenderScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeTop: {
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 80,
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    color: '#000',
  },
  genderContainer: {
    gap: 16,
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
  },
  flexSpacer: {
    flex: 1,
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
