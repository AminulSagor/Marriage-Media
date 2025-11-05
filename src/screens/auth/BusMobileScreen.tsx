import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const BusMobileScreen = ({navigation}) => {
  const [countryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    console.log(`${countryCode} ${phoneNumber}`);
    navigation?.navigate('SubscriptionScreen');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/intro.png')}
      style={styles.background}
      resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#E94057" />
        </TouchableOpacity>

        <Text style={styles.title}>Mobile Number</Text>
        <Text style={styles.subTitle}>
          Please enter your valid phone number. We will send you a 4-digit code
          to verify your account.
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.countryCodeBox}>
            <Text style={styles.codeText}>{countryCode}</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="331 234 2152"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <Text style={styles.link}>Terms of use</Text>
          <Text style={styles.link}>Privacy Policy</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default BusMobileScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    marginTop: 10,
  },
  subTitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    height: 56,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  countryCodeBox: {
    paddingRight: 12,
    borderRightWidth: 1,
    borderColor: '#ccc',
    marginRight: 12,
  },
  codeText: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  continueBtn: {
    backgroundColor: '#FF3B6A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  link: {
    fontSize: 14,
    color: '#FF3B6A',
    textDecorationLine: 'underline',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'grey',
    borderWidth: 0.5,
  },
});
