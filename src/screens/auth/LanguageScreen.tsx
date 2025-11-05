import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Modal,
  FlatList,
} from 'react-native';
import {RadioButton} from 'react-native-paper';

export default function LanguageScreen({navigation}) {
  const [selectedOption, setSelectedOption] = useState(false);
  const [selectedOption2, setSelectedOption2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Select Language');

  // 20+ dummy languages
  const languages = [
    'English',
    'Urdu',
    'Arabic',
    'Turkish',
    'French',
    'German',
    'Spanish',
    'Russian',
    'Chinese (Mandarin)',
    'Japanese',
    'Korean',
    'Hindi',
    'Bengali',
    'Persian',
    'Malay',
    'Indonesian',
    'Swahili',
    'Tamil',
    'Pashto',
    'Punjabi',
    'Sindhi',
    'Italian',
    'Portuguese',
    'Dutch',
    'Greek',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/langBackground.png')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.content}>
          <Text style={styles.heading}>Select your language</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.buttonText}>{selectedLanguage}</Text>
          </TouchableOpacity>

          {/* Language Modal */}
          <Modal
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
          </Modal>

          <View style={styles.radioGroup}>
            <RadioButton
              value="swear"
              status={selectedOption === true ? 'checked' : 'unchecked'}
              onPress={() => setSelectedOption(!selectedOption)}
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
              status={selectedOption2 === true ? 'checked' : 'unchecked'}
              onPress={() => setSelectedOption2(!selectedOption2)}
              color="#ec407a"
            />
            <Text style={styles.radioText}>
              By continuing you agree to our{' '}
              <Text style={styles.link}>Terms</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('BismilaScreen')}
            style={styles.authButton}>
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
    marginTop: '80%',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#FF83AB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginVertical: 6,
    width: '85%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  authText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  languageOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
});
