import React, {useState, useCallback} from 'react';
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
  Modal,
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

interface Props {
  navigation: any;
}

const categories = [
  'Wedding Planning & Coordination',
  'Fashion & Beauty',
  'Religious & Legal Services',
  'Photography & Videography',
  'Venues & Locations',
  'Catering & Food',
  'Decor & Design',
  'Entertainment',
  'Transportation',
  'Stationery & Printing',
  'Post-Wedding & Honeymoon',
  'Gifts & Favors',
];

const BusinessListScreen: React.FC<Props> = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // TODO: plug real location; using sample coords for now
  const [latitude] = useState<number | undefined>(23.7985);
  const [longitude] = useState<number | undefined>(90.4124);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<GetBusinessesResponse>({
    queryKey: ['businesses-list', latitude, longitude, search],
    initialPageParam: 1,
    queryFn: ({pageParam}) =>
      fetchBusinesses({
        latitude,
        longitude,
        search: search || undefined,
        page: typeof pageParam === 'number' ? pageParam : 1,
        limit: PAGE_LIMIT,
      }),
    getNextPageParam: lastPage => {
      const {page, limit, businesses} = lastPage;
      if (!businesses || businesses.length < limit) {
        return undefined;
      }
      return page + 1;
    },
  });

  const businesses: Business[] =
    data?.pages.flatMap(p => p.businesses || []) ?? [];

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  };

  const onSelectCategory = (value: string) => {
    setSearch(value);
    setFilterModalVisible(false);
    refetch();
  };

  const renderBusiness = useCallback(({item}: {item: Business}) => {
    const coverUri = item.cover_path
      ? `${API_BASE_URL}/${item.cover_path}`
      : undefined;

    const distance =
      typeof item.distance === 'number' ? `${item.distance.toFixed(2)} km` : '';

    return (
      <View style={styles.businessCard}>
        {coverUri ? (
          <Image source={{uri: coverUri}} style={styles.businessImage} />
        ) : (
          <View style={[styles.businessImage, {backgroundColor: '#eee'}]} />
        )}

        <View style={styles.businessOverlay}>
          {item.owner_profile ? (
            <Image
              source={{uri: `${API_BASE_URL}/${item.owner_profile}`}}
              style={styles.overlayIcon}
            />
          ) : (
            <View style={[styles.overlayIcon, {backgroundColor: '#EC4D73'}]} />
          )}
          <Text
            style={styles.overlayLabel}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.shop_name?.trim() || 'Business'}
          </Text>
          {distance ? (
            <Text style={styles.distanceBadge}>{distance}</Text>
          ) : null}
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>All Businesses</Text>
        <View style={{width: 24}} />
      </View>

      {/* Search + filter */}
      <View style={styles.findBusinessBar}>
        <Icon name="search" size={18} color="#aaa" />
        <TextInput
          placeholder="Find businesses"
          placeholderTextColor="#ccc"
          style={styles.findInput}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={refetch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Icon name="options-outline" size={22} color="#3399FF" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={businesses}
        keyExtractor={item => String(item.id)}
        renderItem={renderBusiness}
        contentContainerStyle={{paddingBottom: 24}}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={handleEndReached}
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
            {!hasNextPage && businesses.length > 0 && !isFetchingNextPage && (
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

      {/* Filter Modal */}
      <Modal
        transparent
        visible={filterModalVisible}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterBox}>
            <FlatList
              data={categories}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.filterItem}
                  onPress={() => onSelectCategory(item)}>
                  <Text style={styles.filterText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BusinessListScreen; // <-- important

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEFF5',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  screenTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  findBusinessBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  findInput: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#000',
  },
  businessCard: {
    marginBottom: 16,
    alignItems: 'center',
  },
  businessImage: {
    width: width - 40,
    height: 180,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  businessOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: 30,
  },
  overlayIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: '#fff',
    borderWidth: 2,
  },
  overlayLabel: {
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    maxWidth: width - 80,
    textAlign: 'center',
  },
  distanceBadge: {
    backgroundColor: '#EC4D73',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 5,
    fontSize: 12,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBox: {
    width: '85%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  filterItem: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  filterText: {
    fontSize: 16,
    color: '#000',
  },
});
