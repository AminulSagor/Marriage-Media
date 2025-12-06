import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useMutation, useQuery} from '@tanstack/react-query';
import {launchImageLibrary} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {fetchCountries, fetchCitiesByCountry, City} from '../../api/country';
import {createBusinessProfile} from '../../api/business';

const BusinessSignupScreen = ({navigation}: {navigation: any}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [shopName, setShopName] = useState<string>('');
  const [postal, setPostal] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [web, setWeb] = useState<string>('');

  // new optional latitude/longitude inputs
  const [lat, setLat] = useState<string>('');
  const [lng, setLng] = useState<string>('');

  // 🔹 NEW business info fields
  const [oneLiner, setOneLiner] = useState<string>('');
  const [aboutUs, setAboutUs] = useState<string>('');
  const [services, setServices] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  // cover image (same approach as PhotoUpload)
  const [cover, setCover] = useState<any | null>(null);
  const pickCover = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 1}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.log('Image pick failed:', response.errorMessage || response);
        return;
      }
      const asset = response.assets?.[0];
      if (!asset?.uri) return;
      setCover(asset);
    });
  };

  // Countries
  const {data: countries = [], isLoading: loadingCountries} = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  // Cities (depends on country)
  const {data: cities = [], isLoading: loadingCities} = useQuery<City[]>({
    queryKey: ['cities', selectedCountry],
    queryFn: () => fetchCitiesByCountry(selectedCountry),
    enabled: !!selectedCountry,
  });
  const cityNames = useMemo(() => cities.map(c => c.city_name), [cities]);

  // Create business
  const {mutateAsync: doCreate, isPending: creating} = useMutation({
    mutationFn: createBusinessProfile,
    onSuccess: data => {
      console.log('Business profile created successfully:', data);
      navigation?.goBack();
    },
    onError: (e: any) => {
      console.log('Failed to create business:', e?.response?.data ?? e);
    },
  });

  const handleCreate = async () => {
    if (!shopName.trim()) {
      console.warn('Missing info: Please enter your Business name.');
      return;
    }
    if (!cover?.uri) {
      console.warn('Cover required: Please select a cover image.');
      return;
    }

    // Convert picked asset to file object the API helper expects
    const file = {
      uri: cover.uri,
      name:
        cover.fileName ||
        `cover_${Date.now()}.${(cover.type || 'image/jpeg').split('/').pop()}`,
      type: cover.type || 'image/jpeg',
    };

    const parsedLat =
      lat.trim().length > 0 && !Number.isNaN(Number(lat))
        ? Number(lat)
        : undefined;
    const parsedLng =
      lng.trim().length > 0 && !Number.isNaN(Number(lng))
        ? Number(lng)
        : undefined;

    await doCreate({
      city: selectedCity || '',
      country: selectedCountry || '',
      latitude: parsedLat,
      longitude: parsedLng,
      shop_name: shopName || '',
      one_liner: oneLiner || '',
      about_us: aboutUs || '',
      services: services || '',
      category: category || '',
      website: web || '',

      // new fields
      postal_code: postal || '',
      street: street || '',
      email: email || '',
      phone: phone || '',

      cover: file,
    });
  };

  // ---- LOCATION HANDLERS (mirroring WorldScreen style) ----
  const [locating, setLocating] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Location permission error:', err);
      return false;
    }
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    const res = await Geocoder.geocodePosition({lat, lng: lon});
    // cast to any so we can safely access optional fields without TS errors
    return (res?.[0] || {}) as any;
  };

  const handleUseCurrentLocation = async () => {
    const allowed = await requestLocationPermission();
    if (!allowed) {
      console.warn('Location permission denied');
      return;
    }

    setLocating(true);

    Geolocation.getCurrentPosition(
      async position => {
        try {
          const {latitude: cLat, longitude: cLng} = position.coords;

          // fill the lat/lng textboxes
          setLat(String(cLat));
          setLng(String(cLng));

          // same geocoding style as WorldScreen
          const addr = await reverseGeocode(cLat, cLng);

          const city =
            addr.locality || addr.subAdminArea || addr.adminArea || '';

          if (!selectedCountry && addr.country) {
            setSelectedCountry(addr.country);
          }
          if (!selectedCity && city) {
            setSelectedCity(city);
          }
          if (!postal && addr.postalCode) {
            setPostal(String(addr.postalCode));
          }

          const streetName = (addr.streetName ||
            addr.feature || // keep simple; thoroughfare is not typed
            '') as string;
          if (!street && streetName) {
            setStreet(streetName);
          }
        } catch (e) {
          console.log('Reverse geocoding failed:', e);
        } finally {
          setLocating(false);
        }
      },
      error => {
        console.warn('Failed to get current position:', error);
        setLocating(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack()}>
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

          {/* 🔹 Business cover (moved to top) */}
          <Text style={[styles.subText, {marginTop: 6}]}>Business cover</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickCover}
            activeOpacity={0.9}>
            {cover?.uri ? (
              <Image source={{uri: cover.uri}} style={styles.image} />
            ) : (
              <>
                <Text style={styles.uploadIcon}>☁️</Text>
                <Text style={styles.uploadText}>
                  Tap to upload a cover photo
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Business name */}
          <TextInput
            placeholderTextColor={'grey'}
            style={styles.input}
            placeholder="Your Business name"
            value={shopName}
            onChangeText={setShopName}
          />

          {/* 🔹 One liner */}
          <TextInput
            placeholderTextColor={'grey'}
            style={styles.input}
            placeholder="One-liner about your business"
            value={oneLiner}
            onChangeText={setOneLiner}
          />

          {/* 🔹 About us (multiline) */}
          <TextInput
            placeholderTextColor={'grey'}
            style={[styles.input, {minHeight: 80, textAlignVertical: 'top'}]}
            placeholder="About us"
            value={aboutUs}
            onChangeText={setAboutUs}
            multiline
          />

          {/* 🔹 Services */}
          <TextInput
            placeholderTextColor={'grey'}
            style={styles.input}
            placeholder="Services (e.g. wedding planning, catering)"
            value={services}
            onChangeText={setServices}
          />

          {/* 🔹 Category */}
          <TextInput
            placeholderTextColor={'grey'}
            style={styles.input}
            placeholder="Category (e.g. Photography, Venue, Makeup)"
            value={category}
            onChangeText={setCategory}
          />

          <View style={styles.row}>
            {/* Country */}
            <View style={[styles.pickerWrapper, styles.half]}>
              <Picker
                enabled={!loadingCountries}
                selectedValue={selectedCountry}
                onValueChange={val => {
                  setSelectedCountry(val);
                  setSelectedCity('');
                }}
                style={[
                  styles.picker,
                  {
                    color: selectedCountry === '' ? '#999' : '#000',
                    fontSize: 10,
                  },
                ]}>
                <Picker.Item
                  label={
                    loadingCountries ? 'Loading countries…' : 'Select Country'
                  }
                  value=""
                />
                {countries.map(c => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>

            {/* City */}
            <View style={[styles.pickerWrapper, styles.half]}>
              <Picker
                enabled={!!selectedCountry && !loadingCities}
                selectedValue={selectedCity}
                onValueChange={val => setSelectedCity(val)}
                style={[
                  styles.picker,
                  {
                    color: selectedCity === '' ? '#999' : '#000',
                    fontSize: 10,
                  },
                ]}>
                <Picker.Item
                  label={
                    !selectedCountry
                      ? 'Select Country first'
                      : loadingCities
                      ? 'Loading cities…'
                      : 'Select City'
                  }
                  value=""
                />
                {cityNames.map(name => (
                  <Picker.Item key={name} label={name} value={name} />
                ))}
              </Picker>
            </View>
          </View>

          {/* latitude & longitude row (above postal/street) */}
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="Latitude (optional)"
              placeholderTextColor={'grey'}
              value={lat}
              onChangeText={setLat}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="Longitude (optional)"
              placeholderTextColor={'grey'}
              value={lng}
              onChangeText={setLng}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity
              style={styles.locButton}
              onPress={handleUseCurrentLocation}
              disabled={locating}>
              {locating ? (
                <ActivityIndicator size="small" color="#FF3C7B" />
              ) : (
                <Ionicons name="location-sharp" size={20} color="#FF3C7B" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="Postal code"
              placeholderTextColor={'grey'}
              value={postal}
              onChangeText={setPostal}
            />
            <TextInput
              style={[styles.input, styles.half]}
              placeholderTextColor={'grey'}
              placeholder="Street"
              value={street}
              onChangeText={setStreet}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholderTextColor={'grey'}
            placeholder="email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="Phone number"
              placeholderTextColor={'grey'}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <TextInput
              style={[styles.input, styles.half]}
              placeholder="web link"
              placeholderTextColor={'grey'}
              value={web}
              onChangeText={setWeb}
              autoCapitalize="none"
            />
          </View>

          {/* 🔹 Create (only new flow) */}
          <TouchableOpacity
            onPress={handleCreate}
            style={styles.confirmButton}
            disabled={creating}>
            <Text style={styles.confirmText}>
              {creating ? 'Creating…' : 'Create'}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerLink}>Terms of use</Text>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BusinessSignupScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  scroll: {
    padding: 20,
    paddingBottom: 32,
    flexGrow: 1, // 🔹 important for keyboard avoiding
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
  picker: {paddingHorizontal: 10},
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {fontSize: 20, fontWeight: 'bold', color: '#ff4d6d'},
  heading: {fontSize: 24, fontWeight: '600', marginBottom: 10},
  bold: {fontWeight: '800'},
  subText: {fontSize: 14, color: '#777', marginBottom: 12},
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
    alignItems: 'center',
  },
  half: {flex: 1},
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  footerLink: {fontSize: 12, color: '#999'},
  confirmButton: {
    backgroundColor: '#FF3C7B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    marginTop: 10,
  },
  confirmText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  uploadBox: {
    borderWidth: 1,
    borderColor: '#f43f5e',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    width: '100%',
    height: 160,
  },
  uploadIcon: {fontSize: 28},
  uploadText: {fontSize: 12, color: '#999', textAlign: 'center', marginTop: 5},
  image: {width: '100%', height: '100%', resizeMode: 'cover'},
  locButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
  },
});
