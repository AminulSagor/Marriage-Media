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
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Congo-Brazzaville)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czechia (Czech Republic)',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini (fmr. Swaziland)',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Holy See',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine State',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const IdentityScreen2 = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filteredCountries = COUNTRIES.filter(item =>
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

        <Text style={styles.subtitle}>Where do you live ?</Text>

        {/* Search Input */}
        <View style={styles.searchBox}>
          <Icon
            name="search"
            size={20}
            color="#f472b6"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search Location"
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
          onPress={() => navigation?.navigate('IdentityScreen3')}
          style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default IdentityScreen2;

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
