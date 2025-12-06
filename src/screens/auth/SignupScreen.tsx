import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import {useSignupFlow} from '../../context/SignupFlowContext';

interface SignupScreenProps {
  navigation: any;
}

const SignupScreen: React.FC<SignupScreenProps> = ({navigation}) => {
  const {update} = useSignupFlow();

  // const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    // Basic validation for this step only
    // if (!username.trim() || !email.trim() || !phone.trim() || !password) {  <- backup
    if (!email.trim() || !phone.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== passwordAgain) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    update({
      email,
      phone,
      password,
      // name: username || undefined, <- backup
    });

    navigation.navigate('VerifyEmail');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require('../../assets/images/signup.png')}
            style={styles.imageBackground}
            resizeMode="cover">
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {/* Title */}
              <Text style={styles.loginText}>Sign Up</Text>

              {/* Form */}
              <View style={styles.inputContainer}>
                {/* Username <- backup*/}
                {/* <View style={styles.inputWrapper}>
                  <Image
                    source={require('../../assets/images/user.png')}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                  <TextInput
                    placeholder="User name"
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                    returnKeyType="next"
                  />
                </View> */}

                {/* Email */}
                <View style={styles.inputWrapper}>
                  <Image
                    source={require('../../assets/images/mail.png')}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                  <TextInput
                    placeholder="Email"
                    style={styles.input}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="next"
                  />
                </View>

                {/* Phone */}
                <View style={styles.inputWrapper}>
                  <Image
                    source={require('../../assets/images/phone.png')}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                  <TextInput
                    placeholder="Phone"
                    style={styles.input}
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    returnKeyType="next"
                  />
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                  <Image
                    source={require('../../assets/images/lock.png')}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                  <TextInput
                    placeholder="Password"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    returnKeyType="next"
                  />
                </View>

                {/* Repeat Password */}
                <View style={styles.inputWrapper}>
                  <Image
                    source={require('../../assets/images/lock.png')}
                    style={styles.iconImage}
                    resizeMode="contain"
                  />
                  <TextInput
                    placeholder="Repeat Password"
                    secureTextEntry
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={passwordAgain}
                    onChangeText={setPasswordAgain}
                    returnKeyType="done"
                    onSubmitEditing={handleNext}
                  />
                </View>

                {/* Error message */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Next Button */}
                <TouchableOpacity
                  onPress={handleNext}
                  style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Next</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  loginText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 24,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
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
  iconImage: {
    width: 30,
    height: 30,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 12,
    color: '#000',
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
    width: '80%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    width: '80%',
  },
});
