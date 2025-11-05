import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';

export default function SignupScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/signup.png')}
        style={styles.imageBackground}>
        {/* Log In Text */}
        <Text style={styles.loginText}>Sign Up</Text>

        {/* Form */}
        <View style={styles.inputContainer}>
          {/* Email/Phone Input */}
          <View style={styles.inputWrapper}>
            <Image
              source={require('../../assets/images/user.png')}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
            <TextInput
              placeholder="User name"
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Image
              source={require('../../assets/images/mail.png')}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              placeholderTextColor="#999"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Image
              source={require('../../assets/images/phone.png')}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Phone"
              style={styles.input}
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Image
              source={require('../../assets/images/lock.png')}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Image
              source={require('../../assets/images/lock.png')}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
            <TextInput
              placeholder="Repeat Password"
              secureTextEntry
              style={styles.input}
              placeholderTextColor="#999"
            />
          </View>

          {/* Log In Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('VerifyEmail')}
            style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  imageBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    backgroundColor: '#ccc',
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ff4081',
    width: 10,
    height: 10,
  },

  loginText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 180,
    color: '#000',
  },

  inputContainer: {
    marginTop: 20,
    paddingHorizontal: 25,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#C7C7C7',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    width: '80%',
    gap: 20,
    paddingVertical: 1,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    height: 45,
    fontSize: 12,
    color: '#000',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },

  forgotText: {
    fontSize: 12,
    color: '#ff4081',
    fontWeight: '500',
  },

  loginButton: {
    backgroundColor: '#FD6496',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#ff4081',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },

  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#666',
  },

  signUpText: {
    color: '#ff4081',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
