import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {ImageBackground} from 'react-native';
import {useMutation} from '@tanstack/react-query';
import {sendSignupOtp, sendResetOtp, verifyOtp} from '../../api/otp';
import {useSignupFlow} from '../../context/SignupFlowContext';

const CODE_LENGTH = 6;
const TIMER_SECONDS = 30;

interface OtpScreenProps {
  navigation: any;
  route: any;
}

const OtpScreen: React.FC<OtpScreenProps> = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const {data, update} = useSignupFlow();

  const flag = route?.params?.flag as string | undefined; // e.g. 'reset'
  const paramEmail = route?.params?.email as string | undefined;
  const isResetFlow = flag === 'reset';

  // email from signup flow OR passed from RecoverScreen
  const email = data?.email ?? paramEmail ?? '';

  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [timer, setTimer] = useState<number>(TIMER_SECONDS);
  const [localError, setLocalError] = useState<string>('');

  // ---------- Timer ----------
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(
      () => setTimer(prev => (prev > 0 ? prev - 1 : 0)),
      1000,
    );
    return () => clearInterval(id);
  }, [timer]);

  // ---------- Mutations ----------

  // Verify OTP
  const {
    mutate: doVerifyOtp,
    isPending: isVerifying,
    error: verifyError,
  } = useMutation({
    mutationFn: ({email, otp}: {email: string; otp: string}) =>
      verifyOtp({email, otp}),
    onSuccess: (_res, {email, otp}) => {
      update({email, otp}); // store verified email + otp

      if (isResetFlow) {
        navigation.navigate('ResetPasswordScreen', {
          email,
          otp,
        });
      } else {
        navigation.navigate('GenderScreen');
      }
    },
  });

  // Resend OTP
  const {
    mutate: doResend,
    isPending: isResending,
    error: resendError,
  } = useMutation({
    mutationFn: (emailArg: string) =>
      isResetFlow ? sendResetOtp(emailArg) : sendSignupOtp(emailArg),
    onSuccess: () => {
      setCode(Array(CODE_LENGTH).fill(''));
      setTimer(TIMER_SECONDS);
      setLocalError('');
    },
  });

  // ---------- Handlers ----------

  const handleKeyPress = (num: string) => {
    if (isVerifying || isResending) return;

    const idx = code.findIndex(v => v === '');
    if (idx === -1) return;

    const next = [...code];
    next[idx] = num;
    setCode(next);
    setLocalError('');
  };

  const handleDelete = () => {
    if (isVerifying || isResending) return;

    const lastIndex = [...code].reverse().findIndex(v => v !== '');
    if (lastIndex === -1) return;

    const realIndex = CODE_LENGTH - 1 - lastIndex;
    const next = [...code];
    next[realIndex] = '';
    setCode(next);
    setLocalError('');
  };

  const handleConfirm = () => {
    if (!email) {
      setLocalError('Missing email. Please go back to Sign Up.');
      return;
    }

    const otp = code.join('');
    if (otp.length !== CODE_LENGTH) {
      setLocalError(`Please enter the ${CODE_LENGTH}-digit code.`);
      return;
    }

    setLocalError('');
    doVerifyOtp({email, otp});
  };

  const handleResend = () => {
    if (!email || timer > 0 || isResending || isVerifying) return;
    doResend(email);
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const isSendAgainDisabled = !email || timer > 0 || isResending || isVerifying;
  const isConfirmDisabled = !email || code.some(d => d === '') || isVerifying;

  const mergedError =
    localError ||
    ((verifyError as any)?.response?.data?.message as string | undefined) ||
    ((resendError as any)?.response?.data?.message as string | undefined) ||
    '';

  return (
    <ImageBackground
      source={require('../../assets/images/otp.png')}
      style={styles.background}
      resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#E94057" />
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.flex}>
          <View style={styles.topContainer}>
            <Text style={styles.timer}>
              {`00:${timer < 10 ? `0${timer}` : timer}`}
            </Text>
            <Text style={styles.instructions}>
              Type your verification code here
            </Text>

            {/* OTP boxes */}
            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <View
                  key={index}
                  style={[
                    styles.codeBox,
                    {
                      borderColor:
                        digit !== '' ? '#FF2D7A' : 'rgba(0,0,0,0.15)',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.codeText,
                      digit !== '' && {color: '#FF2D7A'},
                    ]}>
                    {digit || ''}
                  </Text>
                </View>
              ))}
            </View>

            {/* Resend */}
            <TouchableOpacity
              onPress={handleResend}
              disabled={isSendAgainDisabled}>
              <Text
                style={[
                  styles.resendText,
                  isSendAgainDisabled && styles.resendDisabled,
                ]}>
                {!email
                  ? 'No email set'
                  : isResending
                  ? 'Sending...'
                  : 'Send again?'}
              </Text>
            </TouchableOpacity>

            {mergedError ? (
              <Text style={styles.errorText}>{mergedError}</Text>
            ) : null}
          </View>

          {/* Keypad */}
          <View style={styles.keypad}>
            {numbers.map(num => (
              <TouchableOpacity
                key={num}
                style={styles.key}
                onPress={() => handleKeyPress(num)}>
                <Text style={styles.keyText}>{num}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.key} onPress={handleDelete}>
              <Text style={styles.keyText}>⌫</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm button */}
          <View
            style={[styles.bottomArea, {paddingBottom: insets.bottom || 16}]}>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                isConfirmDisabled && {backgroundColor: '#f7a9c3'},
              ]}
              disabled={isConfirmDisabled}
              onPress={handleConfirm}>
              <Text style={styles.confirmText}>
                {isVerifying ? 'Verifying...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  flex: {
    flex: 1,
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
    marginTop: 4,
  },
  topContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  subEmailText: {
    fontSize: 13,
    color: '#555',
    marginBottom: 12,
  },
  missingEmailText: {
    fontSize: 13,
    color: '#b91c1c',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  codeBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    borderWidth: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 22,
    color: '#ccc',
    fontWeight: 'bold',
  },
  resendText: {
    marginTop: 6,
    fontSize: 14,
    color: '#FF2D7A',
    fontWeight: '500',
  },
  resendDisabled: {
    color: 'rgba(0,0,0,0.35)',
  },
  errorText: {
    marginTop: 6,
    fontSize: 12,
    color: '#dc2626',
  },
  keypad: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginHorizontal: 20,
  },
  key: {
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '1.5%',
    borderRadius: 10,
  },
  keyText: {
    fontSize: 26,
    fontWeight: '500',
  },
  bottomArea: {
    alignItems: 'center',
    marginTop: 12,
  },
  confirmBtn: {
    backgroundColor: '#FF2D7A',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    width: '90%',
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
