import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const COUNTRIES = [
  'High School',
  'Bachelor’s Degree',
  'Master’s Degree',
  'PhD',
  'Other',
];

const BestMatch = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filteredCountries = COUNTRIES.filter(item =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/best.png')}
        style={styles.background}
        resizeMode="cover">
        {/* <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
          <Text style={styles.title}>Security</Text>
        </TouchableOpacity> */}
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '130%',
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'black',
              width: 230,
              textAlign: 'center',
            }}>
            Begin your halal journey to Nikah{' '}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              textAlign: 'center',
              marginTop: 10,
            }}>
            with our app
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation?.navigate('BusinessSignup')}
          style={styles.confirmButton}>
          <Text style={styles.confirmText}>Start</Text>
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 70,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
    marginTop: 100,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#000',
  },
  listBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  countryText: {
    fontSize: 16,
    color: '#000',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#f472b6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#f472b6',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 30,
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
});
