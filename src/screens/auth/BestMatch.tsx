import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation} from '@tanstack/react-query';
import {
  registerUser,
  RegisterPayload,
  login,
  LoginPayload,
} from '../../api/auth';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface BestMatchProps {
  navigation: any;
}

const BestMatch: React.FC<BestMatchProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {data, reset} = useSignupFlow(); // <- use your context
  const [submitting, setSubmitting] = useState(false);

  console.log(data);

  const {
    mutate: doRegister,
    error: registerError,
    isPending: isRegistering,
  } = useMutation({
    mutationFn: ({payload, otp}: {payload: RegisterPayload; otp?: string}) =>
      registerUser(payload, otp),
    onSuccess: async (_res, variables) => {
      try {
        // Auto-login with same credentials we registered with
        const {email, password} = variables.payload as any;

        if (!email || !password) {
          throw new Error(
            'Account created but missing credentials for auto login.',
          );
        }

        const loginPayload: LoginPayload = {
          email: String(email),
          password: String(password),
        };

        await login(loginPayload);

        // Clear signup flow data
        reset();

        // Go into main app
        navigation.reset({
          index: 0,
          routes: [{name: 'BottomTabs' as never}],
        });
      } catch (err: any) {
        const msg =
          err?.message ||
          err?.response?.data?.message ||
          'Account created, but auto login failed. Please login manually.';
        Alert.alert('Login', msg, [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{name: 'LoginScreen' as never}],
              });
            },
          },
        ]);
      } finally {
        setSubmitting(false);
      }
    },
    onError: (err: any) => {
      setSubmitting(false);
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        'Failed to complete signup. Please try again.';
      Alert.alert('Signup failed', msg);
    },
  });

  const handleStart = () => {
    if (submitting || isRegistering) return;

    // data already includes everything collected + otp
    const {otp, ...rest} = data;
    const payload = rest as Partial<RegisterPayload>;

    // Validate required fields based on your /users/create spec
    const missing: string[] = [];
    if (!payload.name) missing.push('name');
    if (!payload.phone) missing.push('phone');
    if (!payload.email) missing.push('email');
    if (!payload.password) missing.push('password');
    if (!payload.gender) missing.push('gender');
    if (!payload.dob) missing.push('dob');
    if (!payload.country) missing.push('country');
    if (!payload.city) missing.push('city');
    if (payload.partner_age_start === undefined)
      missing.push('partner_age_start');
    if (payload.partner_age_end === undefined) missing.push('partner_age_end');
    if (!payload.pro_path || !payload.pro_path.uri)
      missing.push('pro_path (profile image)');

    if (missing.length) {
      Alert.alert(
        'Missing information',
        `Some required fields are missing:\n- ${missing.join(
          '\n- ',
        )}\n\nPlease go back and complete all steps.`,
      );
      return;
    }

    setSubmitting(true);

    doRegister({
      payload: payload as RegisterPayload,
      otp:
        typeof otp === 'string' && otp.trim().length > 0
          ? otp.trim()
          : undefined,
    });
  };

  const isBusy = submitting || isRegistering;

  const inlineError =
    (registerError as any)?.message ||
    (registerError as any)?.response?.data?.message ||
    '';

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/best.png')}
        style={styles.background}
        resizeMode="cover">
        {/* Center message */}
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Begin your halal journey to Nikah</Text>
          <Text style={styles.subtitle}>with our app</Text>
        </View>

        {/* Inline error if register failed */}
        {!!inlineError && !isBusy && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{inlineError}</Text>
          </View>
        )}

        {/* Final "Start" (finish signup) button */}
        <TouchableOpacity
          onPress={handleStart}
          disabled={isBusy}
          style={[
            styles.confirmButton,
            {bottom: (insets.bottom || 16) + 14},
            isBusy && {opacity: 0.7},
          ]}>
          {isBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmText}>Start</Text>
          )}
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default BestMatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    paddingHorizontal: 24,
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 140,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    width: 230,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  confirmButton: {
    position: 'absolute',
    left: 24,
    right: 24,
    backgroundColor: '#FF3C7B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorBox: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 100,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(248,113,113,0.12)',
    borderRadius: 8,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 12,
    textAlign: 'center',
  },
});
