// ChangePasswordScreen.tsx

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
import {changePassword} from '../../api/profile';

interface ChangePasswordScreenProps {
  navigation: any;
  route: any;
}

const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {email} = route?.params || {};

  const handleConfirm = async () => {
    if (!email) {
      console.log('Missing email param for change password');
      setError('Something went wrong. Please log in again.');
      return;
    }

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      console.log('All password fields are required');
      setError('All password fields are required');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      console.log('New passwords do not match');
      setError('New passwords do not match');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // TODO: call your change-password API here
      // e.g. await changePassword(currentPassword, newPassword);
      await changePassword({
        email,
        password: currentPassword,
        new_password: newPassword,
      });

      // For now just log + go back
      console.log('Password change submitted');
      navigation.goBack();
    } catch (err: any) {
      console.log('Change password failed', err);
      // optional: show error message
      const msg =
        err?.response?.data?.message ||
        'Failed to change password. Please try again.';
      setError(msg);
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

          <Text style={styles.heading}>Change your{'\n'}password</Text>
          <Text style={styles.subtext}>
            Update your password to keep your{'\n'}account secure
          </Text>

          {/* Current Password */}
          <View style={styles.inputContainer}>
            <Icon
              name="lock-closed-outline"
              size={20}
              color="#f15b84"
              style={styles.icon}
            />
            <TextInput
              placeholder="Current password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          {/* New Password */}
          <View style={[styles.inputContainer, {marginTop: 16}]}>
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
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          {/* Confirm New Password */}
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
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
            />
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>

        {/* Same themed button as Reset, text changed to Save */}
        <TouchableOpacity
          style={styles.recoverButton}
          onPress={handleConfirm}
          disabled={submitting}>
          <Text style={styles.recoverText}>
            {submitting ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>

        {/* No terms & privacy footer here */}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;

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
  errorText: {
    marginTop: 10,
    fontSize: 13,
    color: 'red',
  },
});
