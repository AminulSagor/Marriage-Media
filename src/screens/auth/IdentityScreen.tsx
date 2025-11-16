import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface IdentityScreenProps {
  navigation: any;
}

const IdentityScreen: React.FC<IdentityScreenProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {update} = useSignupFlow();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please provide your first name and last name');
      return;
    }
    update({name: `${firstName.trim()} ${lastName.trim()}`});

    navigation.navigate('DobScreen');
  };

  const canContinue = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ImageBackground
            source={require('../../assets/images/identy.png')}
            style={[
              styles.backgroundImage,
              {
                paddingTop: (insets.top || 12) + 8, // small + safe-area
              },
            ]}
            resizeMode="cover">
            {/* Header */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backIconWrapper}
                onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.title}>Basic Identity</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.subtitle}>Your name ?</Text>

              <TextInput
                placeholder="First name"
                placeholderTextColor="#f472b6"
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                returnKeyType="next"
              />

              <TextInput
                placeholder="Last name"
                placeholderTextColor="#f472b6"
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </View>
            {/* Error message */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Continue button pinned to bottom, respecting bottom inset */}
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!canContinue}
              style={[
                styles.continueButton,
                {
                  bottom: (insets.bottom || 16) + 16,
                  backgroundColor: canContinue ? '#FD6496' : '#ffb3cf',
                },
              ]}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default IdentityScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
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
    color: '#000',
  },
  continueButton: {
    position: 'absolute',
    left: 24,
    right: 24,
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
