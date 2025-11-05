import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const BusinessSignupScreen = ({navigation}) => {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>

        {/* Heading */}
        <Text style={styles.heading}>
          Create an account{'\n'}for your{' '}
          <Text style={styles.bold}>Business</Text>
        </Text>
        <Text style={styles.subText}>
          Join us today and make your shopping{'\n'}experience smoother and
          sweeter!
        </Text>

        {/* Input Fields */}
        <TextInput
          placeholderTextColor={'grey'}
          style={styles.input}
          placeholder="Your Business name"
        />

        <View style={styles.row}>
          {/* Country Picker */}
          <View style={[styles.pickerWrapper, styles.half]}>
            <Picker
              selectedValue={selectedCountry}
              onValueChange={itemValue => setSelectedCountry(itemValue)}
              style={[
                styles.picker,
                {
                  color: selectedCountry === '' ? '#999' : '#000',
                  fontSize: 10,
                },
              ]}>
              <Picker.Item label="Select Country" value="" enabled={false} />
              <Picker.Item label="Pakistan" value="Pakistan" />
              <Picker.Item label="United States" value="USA" />
              <Picker.Item label="Canada" value="Canada" />
            </Picker>
          </View>

          {/* City Picker */}
          <View style={[styles.pickerWrapper, styles.half]}>
            <Picker
              selectedValue={selectedCity}
              onValueChange={itemValue => setSelectedCity(itemValue)}
              style={[
                styles.picker,
                {
                  color: selectedCountry === '' ? '#999' : '#000',
                  fontSize: 10,
                },
              ]}>
              <Picker.Item label="Select City" value="" enabled={false} />
              <Picker.Item label="Lahore" value="Lahore" />
              <Picker.Item label="Karachi" value="Karachi" />
              <Picker.Item label="Islamabad" value="Islamabad" />
            </Picker>
          </View>
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Postal code"
            placeholderTextColor={'grey'}
          />
          <TextInput
            style={[styles.input, styles.half]}
            placeholderTextColor={'grey'}
            placeholder="Street"
          />
        </View>

        <TextInput
          style={styles.input}
          placeholderTextColor={'grey'}
          placeholder="email"
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Phone number"
            placeholderTextColor={'grey'}
          />
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="web link"
            placeholderTextColor={'grey'}
          />
        </View>

        {/* Buy Premium */}
        <TouchableOpacity style={styles.premiumBtn}>
          <Text style={styles.premiumText}>Buy Primium</Text>
        </TouchableOpacity>

        {/* Create Button */}
        <TouchableOpacity
          onPress={() => navigation?.navigate('BusVerifyEmail')}
          style={styles.confirmButton}>
          <Text style={styles.confirmText}>Create</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footer}>
          <Text style={styles.footerLink}>Terms of use</Text>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusinessSignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 20,
  },
  pickerWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  picker: {
    paddingHorizontal: 10,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4d6d',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
  },
  bold: {
    fontWeight: '800',
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 14,
    flex: 1,
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  half: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    height: Platform.OS === 'ios' ? 120 : 50,
    borderColor: 'grey',
    borderWidth: 0.5,
  },
  premiumBtn: {
    borderWidth: 1,
    borderColor: '#ff4d6d',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 12,
  },
  premiumText: {
    color: '#ff4d6d',
    fontWeight: '600',
  },
  createBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  createText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  footerLink: {
    fontSize: 12,
    color: '#999',
  },
  confirmButton: {
    backgroundColor: '#FF3C7B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    marginTop: 10,
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
