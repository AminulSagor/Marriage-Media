import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to Home (or any screen) after 3 seconds
      navigation.replace('LanguageScreen');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
});

export default SplashScreen;
