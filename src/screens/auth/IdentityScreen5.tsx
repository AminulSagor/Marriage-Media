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

const Industries = [
  'Healthcare',
  'Technology',
  'Education',
  'Business',
  'Finance',
  'Engineering',
  'Arts & Design',
  'Media & Communication',
  'Science & Research',
  'Law & Legal Services',
  'Government & Public Administration',
  'Agriculture & Farming',
  'Hospitality & Tourism',
  'Transportation & Logistics',
  'Construction & Real Estate',
  'Energy & Utilities',
  'Manufacturing',
  'Retail & Sales',
  'Non-Profit & NGOs',
  'Other',
];

const IdentityScreen5 = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filteredCountries = Industries.filter(item =>
    item.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/country.png')}
        style={styles.background}
        resizeMode="cover">
        <TouchableOpacity style={styles.backButton}>
          <Icon name="chevron-back" size={24} color="#000" />
          <Text style={styles.title}>Basic Identity</Text>
        </TouchableOpacity>
        <Text style={styles.subtitle}>Select your profession</Text>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={20}
            color="#f472b6"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Select your occupation"
            placeholderTextColor="#aaa"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Country List */}
        <View style={styles.listBox}>
          <FlatList
            data={filteredCountries}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => setSelected(item)}>
                <Text style={styles.countryText}>{item}</Text>
                <View style={styles.radioCircle}>
                  {selected === item && <View style={styles.selectedDot} />}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('BodyType')}
          style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default IdentityScreen5;
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
    backgroundColor: '#f472b6',
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
