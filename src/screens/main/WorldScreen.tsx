import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Platform,
  PermissionsAndroid,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder-reborn';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {
  fetchBusinesses,
  Business,
  GetBusinessesResponse,
} from '../../api/business';
import {fetchProfile, UserProfile} from '../../api/profile';
import {API_BASE_URL} from '../../config/env';

const {width} = Dimensions.get('window');
const PAGE_LIMIT = 10;
const THEME_PINK = '#EC4D73';
const ICON_INACTIVE = '#bfbfbf';

const WorldScreen = ({navigation}: {navigation: any}) => {
  const [search, setSearch] = useState<string>('');
  const [useDeviceLocation, setUseDeviceLocation] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{lat: number; lon: number} | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>(''); // NEW

  // current user profile (for avatar)
  const {data: profile} = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const avatarUri = (profile as any)?.pro_path
    ? `${API_BASE_URL}/${(profile as any).pro_path}`
    : undefined;

  // Ask permission (Android foreground)
  const requestLocationPermission = async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const reverseGeocode = async (lat: number, lon: number) => {
    const res = await Geocoder.geocodePosition({lat, lng: lon});
    const a = res?.[0] || {};

    const city = a.locality || a.subAdminArea || a.adminArea || '';
    const country = a.country || '';

    return [city, country].filter(Boolean).join(', ');
  };

  const handleToggleLocation = async () => {
    // turning off — DO NOT touch search
    if (useDeviceLocation) {
      setUseDeviceLocation(false);
      setCoords(null);
      // keep locationLabel value; it will just not render when disabled
      return;
    }

    // turning on — DO NOT write into search; set label beside title
    try {
      setLocating(true);
      const ok = await requestLocationPermission();
      if (!ok) {
        Alert.alert('Permission needed', 'Location permission was denied.');
        setLocating(false);
        return;
      }

      Geolocation.getCurrentPosition(
        async pos => {
          try {
            const {latitude, longitude} = pos.coords;
            const label = await reverseGeocode(latitude, longitude);
            console.log(`LABEL: ${latitude} ${longitude}`);
            setCoords({lat: latitude, lon: longitude});
            setLocationLabel(label); // show beside title
            setUseDeviceLocation(true);
          } catch (e: any) {
            Alert.alert('Geocoding error', e?.message || 'Failed to geocode.');
          } finally {
            setLocating(false);
          }
        },
        err => {
          setLocating(false);
          Alert.alert(
            'Location error',
            err?.message || 'Failed to get location.',
          );
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } catch (e: any) {
      setLocating(false);
      Alert.alert('Error', e?.message || 'Unexpected error.');
    }
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<GetBusinessesResponse>({
    // include search, toggle state, and coords in the cache key so it refetches correctly
    queryKey: [
      'world-businesses',
      {
        search,
        useDeviceLocation,
        lat: coords?.lat ?? null,
        lon: coords?.lon ?? null,
      },
    ],
    initialPageParam: 1,
    queryFn: ({pageParam}) =>
      fetchBusinesses({
        page: typeof pageParam === 'number' ? pageParam : 1,
        limit: PAGE_LIMIT,
        search: search || undefined,
        // pass coords ONLY when toggle is on and coords exist
        ...(useDeviceLocation && coords
          ? {latitude: coords.lat, longitude: coords.lon}
          : {}),
      }),
    getNextPageParam: lastPage => {
      const {page, limit, businesses} = lastPage;
      if (!businesses || businesses.length < limit) return undefined;
      return page + 1;
    },
  });

  const businesses: Business[] = useMemo(
    () => data?.pages.flatMap(p => p.businesses ?? []) ?? [],
    [data],
  );

  const renderBizCard = ({item}: {item: Business}) => {
    const coverUri = item.cover_path
      ? `${API_BASE_URL}/${item.cover_path}`
      : undefined;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation?.navigate('WeddingServicesScreen', {business: item})
        }
        style={styles.serviceCard}>
        {coverUri ? (
          <Image source={{uri: coverUri}} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, {backgroundColor: '#eee'}]} />
        )}

        {/* ALWAYS show km tag when distance exists */}
        {typeof item.distance === 'number' ? (
          <View style={styles.likeBadge}>
            <Text style={styles.likeText}>{item.distance.toFixed(2)} km</Text>
          </View>
        ) : null}

        <Text style={styles.cardName} numberOfLines={1}>
          {item.shop_name || 'Business'}
        </Text>
        <Text style={styles.cardLocation} numberOfLines={1}>
          {(item.city || '') +
            (item.city && item.country ? ', ' : '') +
            (item.country || '')}
        </Text>
      </TouchableOpacity>
    );
  };

  const iconColor = locating
    ? ICON_INACTIVE
    : useDeviceLocation
    ? THEME_PINK
    : ICON_INACTIVE;

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? 'white' : undefined}
      />
      {/* Header: current user */}
      <View style={styles.header}>
        {avatarUri ? (
          <Image source={{uri: avatarUri}} style={styles.profileImage} />
        ) : (
          <Image
            source={require('../../assets/images/img1.png')}
            style={styles.profileImage}
          />
        )}

        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#aaa" />
          <TextInput
            placeholder="Search businesses"
            placeholderTextColor="#ccc"
            style={styles.locationInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            onSubmitEditing={() => refetch()}
          />
          <TouchableOpacity
            onPress={handleToggleLocation}
            disabled={locating}
            accessibilityLabel={
              useDeviceLocation ? 'Disable my location' : 'Use my location'
            }>
            {locating ? (
              <ActivityIndicator size="small" color={ICON_INACTIVE} />
            ) : (
              <Icon name="location-sharp" size={20} color={iconColor} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome text (kept) */}
      <Text style={styles.welcomeText}>Welcome, {profile?.name || 'User'}</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation?.navigate('BusinessSignup')}>
        <Text style={styles.addButtonText}>Add your Business</Text>
        <Text style={styles.addButtonPlus}>+</Text>
      </TouchableOpacity>

      {/* Title + optional location label */}
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>Business nearby</Text>
        {useDeviceLocation && !!locationLabel && (
          <>
            <Text style={styles.sectionTitleSep}> | </Text>
            <Text style={styles.sectionLocation}>{locationLabel}</Text>
          </>
        )}
      </View>

      <FlatList
        data={businesses}
        numColumns={2}
        keyExtractor={item => String(item.id)}
        renderItem={renderBizCard}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        contentContainerStyle={{paddingBottom: 40}}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && !isLoading) fetchNextPage();
        }}
        refreshing={isLoading}
        onRefresh={refetch}
        ListFooterComponent={
          <>
            {isFetchingNextPage && (
              <View style={styles.center}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>Loading more...</Text>
              </View>
            )}
            {!hasNextPage && businesses.length > 0 && (
              <View style={styles.center}>
                <Text style={styles.loadingText}>No more businesses.</Text>
              </View>
            )}
            {isError && !isLoading && businesses.length === 0 && (
              <View style={styles.center}>
                <Text style={styles.loadingText}>
                  Failed to load businesses. Pull to refresh.
                </Text>
              </View>
            )}
          </>
        }
      />
    </View>
  );
};

export default WorldScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEFF5',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {flexDirection: 'row', alignItems: 'center', marginBottom: 10},
  profileImage: {width: 40, height: 40, borderRadius: 20, marginRight: 10},
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 40,
    justifyContent: 'space-between',
  },
  locationInput: {flex: 1, paddingHorizontal: 10, color: '#000'},

  // Welcome (kept)
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
  },

  // Title row with location label
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  sectionTitleSep: {color: '#bbb', marginHorizontal: 4},
  sectionLocation: {color: '#999', fontSize: 14},

  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
  },
  cardImage: {width: '100%', height: 130, borderRadius: 12, marginBottom: 8},
  cardName: {fontWeight: 'bold', color: '#000', marginBottom: 2},
  cardLocation: {fontSize: 12, color: '#666'},
  likeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: THEME_PINK,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  likeText: {color: '#fff', fontSize: 10},
  center: {alignItems: 'center', justifyContent: 'center', paddingVertical: 12},
  loadingText: {marginTop: 4, fontSize: 12, color: '#666'},
  addButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: THEME_PINK,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {color: THEME_PINK, marginRight: 4},
  addButtonPlus: {color: THEME_PINK, fontSize: 16},
});
