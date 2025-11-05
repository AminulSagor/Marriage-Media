import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BismilaScreen({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/bismila.png')}
        style={styles.background}
        resizeMode="contain">
        <View style={styles.bottomContent}>
          <Text style={styles.heading}>
            Let’s meeting new{'\n'}people around you
          </Text>

          {/* Google Button */}
          <TouchableOpacity style={[styles.button, styles.googleButton]}>
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.icon}
            />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple Button */}
          <TouchableOpacity style={[styles.button, styles.appleButton]}>
            <Icon
              name="logo-apple"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.appleText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Phone Button */}
          <TouchableOpacity style={[styles.button, styles.phoneButton]}>
            <Icon
              name="call-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.phoneText}>Continue with Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation?.navigate('LoginScreen')}
            style={styles.authButton}>
            <Text style={styles.phoneText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <TouchableOpacity
        onPress={() => navigation.navigate('SignupScreen')}
        style={styles.bottomContent2}>
        <Text style={styles.footerText}>
          Don’t have an account? <Text style={styles.signUp}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  bottomContent: {
    alignItems: 'center',
    marginTop: '50%',
    width: '100%',
    paddingHorizontal: 20,
  },
  bottomContent2: {alignItems: 'center', marginBottom: 40},
  heading: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 30,
    marginTop: 30,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 6,
    width: '100%',
  },

  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  googleButton: {
    backgroundColor: '#F8F1FA',
    gap: 20,
  },
  googleText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
  },

  appleButton: {
    backgroundColor: '#000',
    gap: 20,
  },
  appleText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },

  phoneButton: {
    backgroundColor: '#5E0C74',
    gap: 20,
  },
  phoneText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },

  footerText: {fontSize: 14, color: '#888'},
  signUp: {
    color: '#DF3C71',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  authButton: {
    marginTop: 10,
    backgroundColor: '#DF3C71',
    paddingVertical: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
});
