import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation} from '@tanstack/react-query';
import {sendSignupOtp} from '../../api/otp';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface VerifyEmailProps {
  navigation: any;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const {data, update} = useSignupFlow();
  const [email, setEmail] = useState(data.email || '');
  const [errorText, setErrorText] = useState('');

  const {
    mutate: requestOtp,
    isPending,
    error,
  } = useMutation({
    mutationFn: sendSignupOtp,
    onSuccess: (_data, usedEmail) => {
      update({email});

      navigation.navigate('OtpScreen');
    },
  });

  useEffect(() => {
    if (data.email && !email) {
      setEmail(data.email);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.email]);

  const handleVerify = () => {
    if (!email.trim()) {
      setErrorText('Please enter your email.');
      return;
    }
    setErrorText('');
    requestOtp(email.trim());
  };

  const displayError =
    errorText || ((error as any)?.message as string | undefined) || '';

  return (
    <View style={styles.root}>
      {/* Fullscreen background under everything */}
      <ImageBackground
        source={require('../../assets/images/intro.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            {/* Top content inside safe area */}
            <SafeAreaView style={styles.safeTop} edges={['top']}>
              <View style={styles.contentWrapper}>
                {/* Back */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}>
                  <Icon name="chevron-back" size={24} color="#E94057" />
                </TouchableOpacity>

                {/* Title + subtitle */}
                <Text style={styles.heading}>Verify your email</Text>
                <Text style={styles.subtext}>
                  Enter the email you used to create your account so we can send
                  you a verification code.
                </Text>

                {/* Email input */}
                <View style={styles.inputContainer}>
                  <Icon
                    name="mail-outline"
                    size={20}
                    color="#f15b84"
                    style={styles.icon}
                  />
                  <TextInput
                    placeholder="Enter your email"
                    placeholderTextColor="#999"
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="done"
                    onSubmitEditing={handleVerify}
                  />
                </View>

                {/* Error */}
                {displayError ? (
                  <Text style={styles.errorText}>{displayError}</Text>
                ) : null}
              </View>
            </SafeAreaView>

            {/* Bottom button & footer pinned with bottom inset */}
            <View
              style={[styles.bottomArea, {paddingBottom: insets.bottom || 16}]}>
              <TouchableOpacity
                onPress={handleVerify}
                disabled={isPending}
                style={[
                  styles.verifyButton,
                  isPending && {backgroundColor: '#f7a9c3'},
                ]}>
                <Text style={styles.verifyText}>
                  {isPending ? 'Sending...' : 'Verify'}
                </Text>
              </TouchableOpacity>

              <View style={styles.footerLinks}>
                <Text style={styles.linkText}>Terms of use</Text>
                <Text style={styles.linkText}>Privacy Policy</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flex: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject, // fill under notch/status bar
  },
  safeTop: {
    paddingHorizontal: 20,
  },
  contentWrapper: {
    // no big manual marginTop; SafeArea handles notch
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
    marginBottom: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  subtext: {
    marginTop: 6,
    fontSize: 14,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
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
  errorText: {
    marginTop: 8,
    fontSize: 12,
    color: '#dc2626',
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  verifyButton: {
    backgroundColor: '#f15b84',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  verifyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLinks: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  linkText: {
    fontSize: 13,
    color: '#f15b84',
  },
});
