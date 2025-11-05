// RecoverScreen.tsx

import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BusVerifyEmail = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/intro.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={{padding: 20}}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#E94057" />
          </TouchableOpacity>

          <Text style={styles.heading}>Verify your email</Text>
          <Text style={styles.subtext}>
            Enter your existing email or phone number by which you created your
            account
          </Text>

          <View style={styles.inputContainer}>
            <Icon name="search" size={20} color="#f15b84" style={styles.icon} />
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#999"
              style={styles.input}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation?.navigate('BusOtpScreen')}
          style={styles.recoverButton}>
          <Text style={styles.recoverText}>Verify</Text>
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <Text style={styles.linkText}>Terms of use</Text>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BusVerifyEmail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#000',
  },
  subtext: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 0.5,
    borderColor: 'grey',
    borderRadius: 12,
    backgroundColor: '#fafafa',
    paddingHorizontal: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: 'white',
  },
  recoverButton: {
    backgroundColor: '#f15b84',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: 65,
    width: '90%',
    alignSelf: 'center',
  },
  recoverText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLinks: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  linkText: {
    fontSize: 13,
    color: '#f15b84',
  },
});
