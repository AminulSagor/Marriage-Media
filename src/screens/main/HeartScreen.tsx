import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {useInfiniteQuery, useMutation, useQuery} from '@tanstack/react-query';

import {
  fetchFriendSuggestions,
  FriendSuggestion,
  sendFriendRequest,
  FriendSuggestionParams,
} from '../../api/friends';
import {fetchProfile} from '../../api/profile';
import {API_BASE_URL} from '../../config/env';
import {useFilterStore, FilterValues} from '../../state/filterStore';

const {width, height} = Dimensions.get('window');

type CardUser = {
  id: number;
  name: string;
  location: string;
  image: string;
};

const PAGE_SIZE = 20;

const mapSuggestionToCard = (s: FriendSuggestion): CardUser => ({
  id: s.id,
  name: s.name,
  location: `${s.city ?? ''}${s.city && s.country ? ', ' : ''}${
    s.country ?? ''
  }`,
  image: s.pro_path
    ? `${API_BASE_URL}/${s.pro_path}`
    : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
});

// Remove "Any"/empty values so queryKey/payload stay clean
const cleanFilters = (f?: FilterValues) => {
  if (!f) return {};
  const out: Record<string, any> = {};
  const put = (k: string, v: any, skipAny = true) => {
    if (v === undefined || v === null || v === '') return;
    if (skipAny && typeof v === 'string' && v.toLowerCase() === 'any') return;
    out[k] = v;
  };
  Object.entries(f).forEach(([k, v]) => put(k, v));
  return out;
};

// Map UI filter keys -> FriendSuggestionParams for API
const mapToApiParams = (
  f: Record<string, any>,
  page: number,
): FriendSuggestionParams => {
  const payload: FriendSuggestionParams = {
    page,
    limit: PAGE_SIZE,
    ...(f.gender && {gender: f.gender}),
    ...(f.country && {country: f.country}),
    ...(f.city && {city: f.city}),
    ...(f.religion && {religion: f.religion}),
    ...(f.sect && {religion_section: f.sect}),
    ...(f.maritalStatus && {marital_status: f.maritalStatus}),
    ...(f.occupation && {profession: f.occupation}),
    ...(f.education && {education: f.education}),
    ...(f.ethnicity && {ethnicity: f.ethnicity}),
    ...(f.bodyType && {body_type: f.bodyType}),
    ...(f.hair && {hair_color: f.hair}),
    ...(f.eye && {eye_color: f.eye}),
    ...(f.skin && {skin_color: f.skin}),
    // Not in API yet (left here for future):
    // age_min: f.ageMin,
    // age_max: f.ageMax,
    // distance_km: f.distance,
    // height_cm / height_ft via height + heightUnit
    // weight_kg / weight_lbs via weight + weightUnit
  };
  return payload;
};

const HeartScreen = ({navigation}: {navigation: any}) => {
  const [activeTab, setActiveTab] = useState<'Flame' | 'Discover' | 'Premium'>(
    'Flame',
  );
  const swiperRef = useRef<Swiper<CardUser> | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Shared persistent filters
  const {filters, hydrated} = useFilterStore();
  const cleaned = useMemo(() => cleanFilters(filters), [filters]);
  const cleanedKey = useMemo(() => JSON.stringify(cleaned), [cleaned]);

  // Profile (avatar)
  const {data: me} = useQuery({
    queryKey: ['me-profile'],
    queryFn: fetchProfile,
  });
  const myAvatarUri = me?.pro_path
    ? `${API_BASE_URL}/${me.pro_path}`
    : 'https://randomuser.me/api/portraits/men/40.jpg';

  // Send-request
  const sendReq = useMutation({
    mutationFn: (receiverId: number) => sendFriendRequest(receiverId),
  });

  // Suggestions with filters
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['friend-suggestions', PAGE_SIZE, cleanedKey],
    initialPageParam: 1,
    enabled: hydrated,
    queryFn: async ({pageParam}) => {
      const page = pageParam as number;
      const params = mapToApiParams(cleaned, page);
      return fetchFriendSuggestions(params);
    },
    getNextPageParam: last => {
      if (!last?.totalPages) return undefined;
      return last.page < last.totalPages ? last.page + 1 : undefined;
    },
  });

  const suggestions: FriendSuggestion[] =
    data?.pages.flatMap(p => p.data ?? []) ?? [];

  const flameCards = useMemo(
    () => suggestions.map(mapSuggestionToCard),
    [suggestions],
  );
  const discoverCards = useMemo(
    () => suggestions.map(mapSuggestionToCard),
    [suggestions],
  );
  const premiumCards = useMemo(
    () => suggestions.map(mapSuggestionToCard),
    [suggestions],
  );

  const cards =
    activeTab === 'Flame'
      ? flameCards
      : activeTab === 'Discover'
      ? discoverCards
      : premiumCards;

  // Reset index only when tab or filters change
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTab, cleanedKey]);

  const prefetchOnSwipe = (idx: number) => {
    if (hasNextPage && !isFetchingNextPage && idx >= cards.length - 5) {
      fetchNextPage();
    }
  };

  const onGridScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent;
    const nearEnd =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 400;
    if (nearEnd && hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const handleDislike = () => swiperRef.current?.swipeLeft();

  const handleLike = () => {
    const card = cards[currentIndex];
    if (card?.id) sendReq.mutate(card.id);
    swiperRef.current?.swipeRight();
  };

  const openFilters = () => {
    navigation?.navigate('FilterScreen');
  };

  const stackCount = Math.max(1, Math.min(5, cards.length || 1));
  const loop = cards.length > 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <Image source={{uri: myAvatarUri}} style={styles.avatar} />
        <Text style={styles.heading}>{}</Text>
        <TouchableOpacity
          onPress={() => navigation?.navigate('NearUser')}
          style={styles.scanBtn}>
          <Image
            source={require('../../assets/images/newAdd.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Tabs + Filters */}
      <View style={styles.subHeader}>
        <View></View>
        {/* <View style={styles.tabRow}>
          {(['Flame', 'Discover', 'Premium'] as const).map(tab => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text
                style={[styles.tabText, activeTab === tab && styles.activeTab]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
        <TouchableOpacity onPress={openFilters}>
          <Feather name="sliders" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        {activeTab === 'Flame' ? (
          <View style={styles.swiperContainer}>
            {!hydrated || (isLoading && cards.length === 0) ? (
              <View style={{alignItems: 'center', marginTop: 16}}>
                <Text style={{color: '#666'}}>Loading suggestions…</Text>
              </View>
            ) : isError ? (
              <View style={{alignItems: 'center', marginTop: 16}}>
                <Text style={{color: '#dc2626'}}>
                  Failed to load. Pull to refresh.
                </Text>
              </View>
            ) : cards.length === 0 ? (
              <View style={{alignItems: 'center', marginTop: 16}}>
                <Text style={{color: '#666'}}>No suggestions found.</Text>
              </View>
            ) : (
              <Swiper
                key={`swiper-${activeTab}-${stackCount}-${cleanedKey}`}
                ref={swiperRef}
                cards={cards}
                renderCard={(card, idx) => {
                  if (!card) {
                    return (
                      <View
                        style={[
                          styles.cardContainer,
                          {alignItems: 'center', justifyContent: 'center'},
                        ]}>
                        <Text style={{color: '#666'}}>…</Text>
                      </View>
                    );
                  }
                  return (
                    <View
                      key={`card-${card.id}-${idx}`}
                      style={styles.cardContainer}>
                      <Image
                        source={{uri: card.image}}
                        style={styles.cardImage}
                      />
                      <View style={styles.cardFooter}>
                        <Text style={styles.name}>{card.name}</Text>
                        <View style={styles.locationRow}>
                          <Ionicons
                            name="location-sharp"
                            size={16}
                            color="#fff"
                          />
                          <Text style={styles.location}>
                            {card.location || '—'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }}
                backgroundColor="transparent"
                cardVerticalMargin={20}
                stackSize={stackCount}
                showSecondCard={loop}
                infinite={loop}
                cardIndex={currentIndex}
                animateCardOpacity
                onSwiped={idx => {
                  prefetchOnSwipe(idx);
                  setCurrentIndex(idx + 1);
                }}
                onSwipedAll={() => {
                  if (hasNextPage && !isFetchingNextPage) fetchNextPage();
                }}
              />
            )}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.gridContainer}
            onScroll={onGridScroll}
            scrollEventThrottle={16}>
            {cards.map((user, i) => (
              <View key={`${user.id}-${i}`} style={styles.gridCard}>
                <Image source={{uri: user.image}} style={styles.gridImage} />
                <View style={styles.gridFooter}>
                  <Text style={styles.gridName}>{user.name}</Text>
                  <Text style={styles.gridLocation}>{user.location}</Text>
                </View>
              </View>
            ))}
            {isFetchingNextPage ? (
              <View style={{alignItems: 'center', width: '100%', marginTop: 8}}>
                <Text style={{color: '#666'}}>Loading more…</Text>
              </View>
            ) : null}
          </ScrollView>
        )}
      </View>

      {activeTab === 'Flame' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.crossButton} onPress={handleDislike}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartButton} onPress={handleLike}>
            <Ionicons name="heart" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default HeartScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  avatar: {width: 40, height: 40, borderRadius: 20},
  heading: {fontSize: 18, fontWeight: '700', color: '#000'},
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tabRow: {flexDirection: 'row', alignItems: 'center'},
  tabText: {marginRight: 20, fontSize: 16, color: '#888'},
  activeTab: {
    color: '#f1499d',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#f1499d',
    paddingBottom: 2,
  },
  scanBtn: {padding: 10, borderRadius: 12},
  swiperContainer: {height: height * 0.55},
  cardContainer: {
    height: height * 0.7,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ddd',
    position: 'relative',
  },
  cardImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  cardFooter: {position: 'absolute', bottom: 20, left: 20},
  name: {fontSize: 22, color: '#fff', fontWeight: 'bold'},
  locationRow: {flexDirection: 'row', alignItems: 'center', marginTop: 4},
  location: {color: '#fff', marginLeft: 5},
  actionButtons: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  crossButton: {
    width: 60,
    height: 60,
    backgroundColor: '#ccc',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  heartButton: {
    width: 60,
    height: 60,
    backgroundColor: '#f1499d',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 100,
  },
  gridCard: {
    width: width * 0.42,
    height: height * 0.28,
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  gridImage: {width: '100%', height: '100%', resizeMode: 'cover'},
  gridFooter: {position: 'absolute', bottom: 10, left: 10},
  gridName: {color: '#fff', fontWeight: 'bold', fontSize: 14},
  gridLocation: {color: '#fff', fontSize: 12},
});
