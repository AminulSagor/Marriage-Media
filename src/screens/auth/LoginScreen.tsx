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
import {useMutation} from '@tanstack/react-query';
import {login} from '../../api/auth';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    mutate: doLogin,
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      const rootNav = navigation.getParent();

      (rootNav ?? navigation).reset({
        index: 0,
        routes: [{name: 'BottomTabs' as never}],
      });
    },
  });

  const handleSubmit = () => {
    if (!email || !password || isPending) return;
    doLogin({email, password});
  };

  const errorMessage =
    (error as any)?.response?.data?.message ||
    (error ? 'Login failed. Please check your credentials.' : '');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require('../../assets/images/login.png')}
            style={styles.imageBackground}
            resizeMode="cover">
            <ScrollView
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {/* Log In Text */}
              <Text style={styles.loginText}>Log In</Text>

              {/* Form */}
              <View style={styles.inputContainer}>
                {/* Email Input */}
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
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                  />
                </View>

                {/* Password Input */}
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
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>

                {/* Forgot Password */}
                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('RecoverScreen')}>
                  <Text style={styles.forgotText}>forgot password ?</Text>
                </TouchableOpacity>

                {/* Error */}
                {errorMessage ? (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null}

                {/* Log In Button */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={!email || !password || isPending}
                  style={[
                    styles.loginButton,
                    (!email || !password || isPending) &&
                      styles.loginButtonDisabled,
                  ]}>
                  <Text style={styles.loginButtonText}>
                    {isPending ? 'Logging in...' : 'Log In'}
                  </Text>
                </TouchableOpacity>

                {/* Sign Up Prompt */}
                <TouchableOpacity
                  onPress={() => navigation?.navigate('SignupScreen')}>
                  <Text style={styles.footerText}>
                    Don’t have account ?{' '}
                    <Text style={styles.signUpText}>Sign up</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    justifyContent: 'flex-end', // keeps layout similar to design
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingBottom: 40, // gives bottom inset when keyboard opens
  },
  loginText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FF3C7B',
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginRight: '10%',
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
    width: '80%',
  },
  loginButtonDisabled: {
    backgroundColor: '#ffb3cf',
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
  errorText: {
    color: '#dc2626',
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
    width: '80%',
  },
});
