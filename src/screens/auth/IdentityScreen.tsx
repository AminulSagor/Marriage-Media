import React from 'react';
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

const IdentityScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/identy.png')} // Replace with your curved pink image
        style={styles.backgroundImage}
        resizeMode="cover">
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
          <Text style={styles.title}>Basic Identity</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.subtitle}>Your name ?</Text>

          <TextInput
            placeholder="First name"
            placeholderTextColor="#f472b6"
            style={styles.input}
          />
          <TextInput
            placeholder="Last name"
            placeholderTextColor="#f472b6"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation?.navigate('DobScreen')}
          style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default IdentityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
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
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    // textAlign: 'center',
    color: '#000',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  continueButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: '#FD6496',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 5,
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
