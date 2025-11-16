import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSignupFlow} from '../../context/SignupFlowContext';

const INDUSTRIES = [
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

interface IdentityScreen5Props {
  navigation: any;
}

const IdentityScreen5: React.FC<IdentityScreen5Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {update} = useSignupFlow();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const filteredList =
    INDUSTRIES.filter(item =>
      item.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const handleConfirm = () => {
    if (!selected) {
      return;
    }
    update({profession: selected});
    navigation.navigate('BodyType');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/country.png')}
      style={styles.background}
      resizeMode="cover">
      {/* Content inside safe area */}
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Basic Identity</Text>
          <View style={{width: 24}} />
        </View>

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
            returnKeyType="search"
          />
        </View>

        {/* List */}
        <View style={styles.listBox}>
          <FlatList
            data={filteredList}
            keyExtractor={item => item}
            keyboardShouldPersistTaps="handled"
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
      </SafeAreaView>

      {/* Confirm Button pinned to bottom */}
      <TouchableOpacity
        onPress={handleConfirm}
        disabled={!selected}
        style={[
          styles.confirmButton,
          {
            bottom: (insets.bottom || 16) + 16,
            backgroundColor: selected ? '#f472b6' : '#ddd',
          },
        ]}>
        <Text style={styles.confirmText}>Confirm</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default IdentityScreen5;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 20,
    color: '#000',
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
  searchIcon: {marginRight: 8},
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
    left: 24,
    right: 24,
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
