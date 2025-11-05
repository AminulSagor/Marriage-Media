import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const OtpScreen = ({navigation}) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  // Countdown timer effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleKeyPress = (num: string) => {
    const index = code.findIndex(val => val === '');
    if (index !== -1) {
      const newCode = [...code];
      newCode[index] = num;
      setCode(newCode);
    }
  };

  const handleDelete = () => {
    const index = code
      .slice()
      .reverse()
      .findIndex(val => val !== '');
    if (index !== -1) {
      const deleteIndex = 3 - index;
      const newCode = [...code];
      newCode[deleteIndex] = '';
      setCode(newCode);
    }
  };

  const handleConfirm = () => {
    const enteredCode = code.join('');
    console.log('Entered Code:', enteredCode);
    navigation.navigate('GenderScreen');
    // API Call or navigation
  };

  const handleResend = () => {
    if (timer === 0) {
      setCode(['', '', '', '']);
      setTimer(30);
      // Resend code logic here
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../../assets/images/otp.png')}
        style={styles.background}
        resizeMode="cover">
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#E94057" />
        </TouchableOpacity>
        <View style={styles.topContainer}>
          <Text style={styles.timer}>{`00:${
            timer < 10 ? '0' + timer : timer
          }`}</Text>
          <Text style={styles.instructions}>
            Type your verification code here
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.codeBox,
                  {
                    borderColor: digit !== '' ? '#FF2D7A' : '#ccc',
                  },
                ]}>
                <Text
                  style={[styles.codeText, digit !== '' && {color: '#FF2D7A'}]}>
                  {digit || '0'}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText}>Send again?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.keypad}>
          {numbers.map((num, index) => (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={() => handleKeyPress(num)}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.key} onPress={handleDelete}>
            <Text style={styles.keyText}>⌫</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  topContainer: {
    paddingTop: 60,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
  },
  codeBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 28,
    color: '#ccc',
    fontWeight: 'bold',
  },
  resendText: {
    color: '#FF2D7A',
    fontWeight: '500',
    marginTop: 5,
  },
  keypad: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
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
  confirmBtn: {
    backgroundColor: '#FF2D7A',
    margin: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    bottom: 120,
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    top: 30,
    borderColor: 'grey',
    borderWidth: 0.5,
    left: 20,
  },
});
