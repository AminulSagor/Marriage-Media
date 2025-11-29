// ResetPasswordScreen.tsx

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {resetPassword} from '../../api/auth';

interface ResetPasswordScreenProps {
  navigation: any;
  route: any;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {email, otp} = route.params || {}; // email is required, otp optional

  const handleConfirm = async () => {
    if (!email) {
      console.log('Missing email param for reset password');
      return;
    }

    if (!password || !confirmPassword || password !== confirmPassword) {
      // you can swap this for proper UI error / toast later
      console.log('Passwords do not match or are empty');
      return;
    }

    try {
      setSubmitting(true);
      await resetPassword(email, password, otp ?? '');
      // Clear stack and go to LoginScreen, passing email
      navigation.reset({
        index: 0,
        routes: [{name: 'LoginScreen', params: {email}}],
      });
    } catch (err) {
      console.log('Reset password failed', err);
      // optional: show error message
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ImageBackground
        source={require('../../assets/images/intro.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={{padding: 20}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="#E94057" />
          </TouchableOpacity>

          <Text style={styles.heading}>Reset your{'\n'}password</Text>
          <Text style={styles.subtext}>
            Enter a new password and confirm it to{'\n'}secure your account
          </Text>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#f15b84"
              style={styles.icon}
            />
            <TextInput
              placeholder="New password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Confirm Password */}
          <View style={[styles.inputContainer, {marginTop: 16}]}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#f15b84"
              style={styles.icon}
            />
            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
        </View>

        {/* Same themed button as Recover, text changed to Confirm */}
        <TouchableOpacity
          style={styles.recoverButton}
          onPress={handleConfirm}
          disabled={submitting}>
          <Text style={styles.recoverText}>
            {submitting ? 'Confirming...' : 'Confirm'}
          </Text>
        </TouchableOpacity>

        {/* No terms & privacy footer here */}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

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
    color: '#000',
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
});
