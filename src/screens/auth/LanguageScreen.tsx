import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import {RadioButton} from 'react-native-paper';

export default function LanguageScreen({navigation}) {
  const [selectedOption, setSelectedOption] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState(false);

  const isAuthorized = selectedOption && selectedOption2;

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/langBackground.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.content}>
          <View style={styles.radioGroup}>
            {/* <Text style={styles.heading}>Select your language</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>{selectedLanguage}</Text>
          </TouchableOpacity> */}

            {/* Language Modal */}
            {/* <Modal
            transparent={true}
            visible={modalVisible}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalHeading}>Choose Language</Text>
                <FlatList
                  data={languages}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={styles.languageOption}
                      onPress={() => {
                        setSelectedLanguage(item);
                        setModalVisible(false);
                      }}>
                      <Text style={styles.languageText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal> */}
            <RadioButton
              value="swear"
              status={selectedOption ? 'checked' : 'unchecked'}
              onPress={() => setSelectedOption(prev => !prev)}
              color="#ec407a"
            />
            <Text style={styles.radioText}>
              I swear by Allah that I will use this application only for
              honorable and respectful purposes, in accordance with Islamic
              values.
            </Text>
          </View>

          <View style={styles.radioGroup}>
            <RadioButton
              value="terms"
              status={selectedOption2 ? 'checked' : 'unchecked'}
              onPress={() => setSelectedOption2(prev => !prev)}
              color="#ec407a"
            />
            <Text style={styles.radioText}>
              By continuing you agree to our{' '}
              <Text style={styles.link}>Terms</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            disabled={!isAuthorized}
            onPress={() => {
              if (!isAuthorized) return;
              navigation.navigate('BismilaScreen');
            }}
            style={[
              styles.authButton,
              !isAuthorized && styles.authButtonDisabled,
            ]}>
            <Text style={styles.authText}>Authorization</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#fdfcfd',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    marginTop: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  radioText: {
    flex: 1,
    color: '#555',
    fontSize: 14,
  },
  link: {
    color: '#ec407a',
    textDecorationLine: 'underline',
  },
  authButton: {
    marginTop: 24,
    backgroundColor: '#DF3C71',
    paddingVertical: 14,
    borderRadius: 30,
    width: '90%',
    alignItems: 'center',
  },
  authButtonDisabled: {
    backgroundColor: '#E3B8C8', // lighter / disabled color
    opacity: 0.7,
  },
  authText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
