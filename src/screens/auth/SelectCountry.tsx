import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import {useQuery} from '@tanstack/react-query';
import {fetchCountries} from '../../api/country';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface SelectCountryProps {
  navigation: any;
}

const SelectCountry: React.FC<SelectCountryProps> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {update} = useSignupFlow();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const {
    data: countries,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  const filteredCountries =
    countries?.filter(item =>
      item.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  const handleConfirm = () => {
    if (!selected) {
      return;
    }
    update({country: selected});

    navigation.navigate('IdentityScreen2');
  };

  return (
    <ImageBackground
      source={require('../../assets/images/country.png')}
      style={styles.background}
      resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top || 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.flex}>
            {/* Content inside safe area so it avoids notch */}
            <SafeAreaView
              style={[styles.safeArea]}
              edges={['top', 'left', 'right']}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Basic Identity</Text>
                {/* Spacer to balance layout */}
                <View style={{width: 24}} />
              </View>

              <Text style={styles.subtitle}>Nationality</Text>

              {/* Search Input */}
              <View style={styles.searchBox}>
                <Icon
                  name="search"
                  size={20}
                  color="#f472b6"
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Search here..."
                  placeholderTextColor="#aaa"
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                  returnKeyType="search"
                />
              </View>

              {/* Country List */}
              <View style={styles.listBox}>
                {isLoading && (
                  <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.statusText}>Loading countries...</Text>
                  </View>
                )}

                {isError && !isLoading && (
                  <View style={styles.center}>
                    <Text style={styles.errorText}>
                      Failed to load countries. Please try again.
                    </Text>
                  </View>
                )}

                {!isLoading && !isError && (
                  <FlatList
                    data={filteredCountries}
                    keyExtractor={item => item}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => setSelected(item)}>
                        <Text style={styles.countryText}>{item}</Text>
                        <View style={styles.radioCircle}>
                          {selected === item && (
                            <View style={styles.selectedDot} />
                          )}
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
              </View>
            </SafeAreaView>

            {/* Confirm Button pinned to bottom, bg full-screen */}
            <TouchableOpacity
              disabled={!selected}
              onPress={handleConfirm}
              style={[
                styles.confirmButton,
                {
                  bottom: (insets.bottom || 16) + 16,
                  backgroundColor: selected ? '#f472b6' : '#ddd',
                },
              ]}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default SelectCountry;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    fontSize: 28,
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#000',
  },
  listBox: {
    flexShrink: 1,
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
  center: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    marginTop: 8,
    color: '#666',
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
});
