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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useInfiniteQuery} from '@tanstack/react-query';
import {
  fetchBusinesses,
  Business,
  GetBusinessesResponse,
} from '../../api/business';
import {API_BASE_URL} from '../../config/env';

const {width} = Dimensions.get('window');
const PAGE_LIMIT = 10;

const WorldScreen = ({navigation}: {navigation: any}) => {
  // This input drives API search; the location icon only toggles this value.
  const [search, setSearch] = useState<string>('');

  // Toggle button: set text to "Afghanistan" (again to clear)
  const handleToggleLocation = () => {
    setSearch(prev =>
      prev.trim().toLowerCase() === 'afghanistan' ? '' : 'Afghanistan',
    );
  };

  // Fetch businesses with pagination; filters by `search` only
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<GetBusinessesResponse>({
    queryKey: ['world-businesses', search],
    initialPageParam: 1,
    queryFn: ({pageParam}) =>
      fetchBusinesses({
        page: typeof pageParam === 'number' ? pageParam : 1,
        limit: PAGE_LIMIT,
        search: search || undefined,
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
        onPress={() => navigation?.navigate('WeddingServicesScreen')}
        style={styles.serviceCard}>
        {coverUri ? (
          <Image source={{uri: coverUri}} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, {backgroundColor: '#eee'}]} />
        )}
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

  return (
    <View style={styles.container}>
      {/* Header search (filters API) + simple location toggle */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/img1.png')}
          style={styles.profileImage}
        />
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
          <TouchableOpacity onPress={handleToggleLocation}>
            <Icon
              name="location-sharp"
              size={20}
              color={
                search.trim().toLowerCase() === 'afghanistan'
                  ? '#2ecc71'
                  : '#EC9BEE'
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.welcomeText}>Welcome, Jhon</Text>

      {/* Business nearby */}
      <Text style={styles.sectionTitle}>Business nearby</Text>

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
          if (hasNextPage && !isFetchingNextPage && !isLoading) {
            fetchNextPage();
          }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
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
  locationInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  serviceCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    padding: 10,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: 130,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardName: {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  cardLocation: {
    fontSize: 12,
    color: '#666',
  },
  likeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EC4D73',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  likeText: {
    color: '#fff',
    fontSize: 10,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
});
