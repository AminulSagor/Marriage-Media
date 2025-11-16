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
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useQuery} from '@tanstack/react-query';
import {fetchCitiesByCountry} from '../../api/country';
import {useSignupFlow} from '../../context/SignupFlowContext';

interface IdentityScreen2Props {
  navigation: any;
}

const IdentityScreen2: React.FC<IdentityScreen2Props> = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {data: signupData, update} = useSignupFlow();

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const country = signupData.country || '';

  const {
    data: cities,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cities', country],
    queryFn: () => fetchCitiesByCountry(country),
    enabled: !!country,
  });

  // Flatten to names for easier filtering / rendering
  const cityNames = cities?.map(c => c.city_name).filter(Boolean) ?? [];

  const filteredCities = cityNames.filter(name =>
    name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirm = () => {
    if (!selected) {
      return;
    }
    update({city: selected});
    navigation.navigate('IdentityScreen3');
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
            {/* Content inside safe area (header & list avoid notch) */}
            <SafeAreaView
              style={styles.safeArea}
              edges={['top', 'left', 'right']}>
              {/* Back + Title */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Basic Identity</Text>
                <View style={{width: 24}} />
              </View>

              <Text style={styles.subtitle}>Where do you live?</Text>

              {/* If somehow no country selected yet */}
              {!country && (
                <Text style={styles.helperText}>
                  Please select your country first.
                </Text>
              )}

              {/* Search Input */}
              <View style={styles.searchBox}>
                <Icon
                  name="search"
                  size={20}
                  color="#f472b6"
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Search city"
                  placeholderTextColor="#aaa"
                  value={search}
                  onChangeText={setSearch}
                  style={styles.searchInput}
                  returnKeyType="search"
                />
              </View>

              {/* Cities List */}
              <View style={styles.listBox}>
                {isLoading && (
                  <View style={styles.center}>
                    <ActivityIndicator />
                    <Text style={styles.statusText}>Loading cities...</Text>
                  </View>
                )}

                {isError && !isLoading && (
                  <View style={styles.center}>
                    <Text style={styles.errorText}>
                      Failed to load cities. Please try again.
                    </Text>
                  </View>
                )}

                {!isLoading && !isError && !!country && (
                  <FlatList
                    data={filteredCities}
                    keyExtractor={item => item}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => setSelected(item)}>
                        <Text style={styles.cityText}>{item}</Text>
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

            {/* Confirm Button pinned to bottom, respecting bottom inset */}
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

export default IdentityScreen2;

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
  helperText: {
    fontSize: 13,
    color: '#dc2626',
    marginBottom: 8,
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
  cityText: {
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
