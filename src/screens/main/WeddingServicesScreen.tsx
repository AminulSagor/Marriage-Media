import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  Business,
  BusinessReview,
  fetchBusinessReviewList,
  addBusinessReview,
} from '../../api/business';
import {fetchProfile, UserProfile} from '../../api/profile';
import {API_BASE_URL} from '../../config/env';

type Props = {
  route: {params?: {business?: Business}};
  navigation: any;
};

const WeddingServicesScreen: React.FC<Props> = ({route, navigation}) => {
  const business = route?.params?.business;

  // current user profile
  const {data: profile} = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const userAvatar = (profile as any)?.pro_path
    ? `${API_BASE_URL}/${(profile as any).pro_path}`
    : 'https://randomuser.me/api/portraits/men/1.jpg';

  const userLocation =
    ((profile as any)?.city || '') +
    ((profile as any)?.city && (profile as any)?.country ? ', ' : '') +
    ((profile as any)?.country || '');

  // reviews
  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
    refetch: refetchReviews,
  } = useQuery<BusinessReview[]>({
    queryKey: ['business-reviews', business?.id],
    queryFn: () => fetchBusinessReviewList(business!.id),
    enabled: !!business?.id,
  });

  // average stars from loaded reviews
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.star || 0), 0) / reviews.length
      : 0;

  // --- Add review modal state ---
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rating, setRating] = useState<number>(0); // must be >= 1
  const [text, setText] = useState<string>('');

  const {mutate: submitReview, isPending: isSubmitting} = useMutation({
    mutationFn: () =>
      addBusinessReview({
        business_id: business!.id,
        review_text: text.trim(),
        star: rating,
      }),
    onSuccess: () => {
      setReviewOpen(false);
      setRating(0);
      setText('');
      refetchReviews();
    },
  });

  const canSubmit = rating >= 1 && text.trim().length > 0 && !isSubmitting;

  if (!business) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{padding: 16}}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{marginBottom: 12}}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={[styles.sectionTitle, {marginBottom: 8}]}>
            No business selected
          </Text>
          <Text style={{color: '#555'}}>
            Go back and choose a business from the World screen.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const coverUri = business.cover_path
    ? `${API_BASE_URL}/${business.cover_path}`
    : 'https://picsum.photos/800/400';

  const locationLine =
    (business.city || '') +
    (business.city && business.country ? ', ' : '') +
    (business.country || '');

  const renderStars = (n = 0) => {
    const clamped = Math.max(0, Math.min(5, Math.round(n)));
    return '⭐'.repeat(clamped) + '☆'.repeat(5 - clamped);
  };

  const Stars = ({
    rating = 0,
    size = 14,
    color = '#FDCC0D',
    gap = 2,
  }: {
    rating?: number;
    size?: number;
    color?: string;
    gap?: number;
  }) => {
    const clamped = Math.max(0, Math.min(5, Math.round(rating)));
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {[1, 2, 3, 4, 5].map(i => (
          <Ionicons
            key={i}
            name={i <= clamped ? 'star' : 'star-outline'}
            size={size}
            color={color}
            style={{marginLeft: i === 1 ? 0 : gap}}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header — current user */}
        <View style={styles.header}>
          <Image source={{uri: userAvatar}} style={styles.avatar} />
          <View style={{flex: 1}}>
            <Text style={styles.welcome}>
              Welcome, {profile?.name || 'User'}
            </Text>
            <Text style={styles.location}>📍 {userLocation || '—'}</Text>
          </View>
          {/* (Commented For now) */}
          {/* <TouchableOpacity>
            <Ionicons name="notifications-outline" size={22} color="#000" />
          </TouchableOpacity> */}
        </View>

        {/* Search (Commented For now) */}
        {/* <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            placeholder="What are you looking for?"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
          <TouchableOpacity>
            <Ionicons name="options-outline" size={20} color="#E91E63" />
          </TouchableOpacity>
        </View> */}

        {/* Section Title */}
        {/* (Commented For now) */}
        {/* <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Business Details</Text>
            <Text style={styles.subText}>
              {business.one_liner || 'Where every bite tells a story!'}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.linkText}>See all</Text>
          </TouchableOpacity>
        </View> */}

        {/* Business card */}
        <View style={styles.card}>
          <Image source={{uri: coverUri}} style={styles.cardImage} />

          {typeof business.distance === 'number' && (
            <View style={styles.likeBadge}>
              <Ionicons name="navigate" size={14} color="#fff" />
              <Text style={styles.likeText}>
                {business.distance.toFixed(2)} km
              </Text>
            </View>
          )}

          <View style={{marginTop: 10}}>
            <Text style={styles.cardTitle}>
              {business.shop_name || 'Business'}
            </Text>
            <Text style={styles.subText}>
              {business.one_liner || 'Where every bite tells a story!'}
            </Text>
            <Text style={styles.cardLocation}>📍 {locationLine || '—'}</Text>
          </View>

          {/* Calculated average for now */}
          <View style={styles.ratingRow}>
            <Stars rating={avgRating} size={16} />
            <Text style={styles.rating}>({avgRating.toFixed(1)})</Text>
          </View>

          {!!business.about_us && (
            <Text style={styles.cardSubtitle}>About us:</Text>
          )}
          <Text style={styles.cardText}>
            {business.about_us || 'No description available.'}
          </Text>

          {!!business.website && (
            <Text style={styles.cardSubtitle}>Contact:</Text>
          )}
          {!!business.website && (
            <Text style={styles.contact}>🔗 {business.website}</Text>
          )}

          {!!business.services && (
            <Text style={styles.cardSubtitle}>Our services:</Text>
          )}
          <Text style={styles.cardText}>{business.services || '—'}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryText}>Contact Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Customer Reviews :</Text>
          <TouchableOpacity
            style={styles.reviewBtn}
            onPress={() => setReviewOpen(true)}>
            <Text style={styles.reviewBtnText}>Add review</Text>
          </TouchableOpacity>
        </View>

        {isReviewsLoading && (
          <View style={{alignItems: 'center', paddingVertical: 16}}>
            <ActivityIndicator />
            <Text style={{marginTop: 6, color: '#555'}}>Loading reviews…</Text>
          </View>
        )}

        {isReviewsError && !isReviewsLoading && (
          <View style={{alignItems: 'center', paddingVertical: 16}}>
            <Text style={{color: '#d00'}}>Failed to load reviews.</Text>
          </View>
        )}

        {!isReviewsLoading && !isReviewsError && reviews.length === 0 && (
          <View style={{alignItems: 'center', paddingVertical: 16}}>
            <Text style={{color: '#555'}}>No reviews yet.</Text>
          </View>
        )}

        {reviews.map((rev, idx) => {
          const avatar = rev.pro_path
            ? `${API_BASE_URL}/${rev.pro_path}`
            : 'https://randomuser.me/api/portraits/lego/1.jpg';
          return (
            <View key={`${rev.name}-${idx}`} style={styles.reviewCard}>
              <Image source={{uri: avatar}} style={styles.reviewAvatar} />
              <View style={{flex: 1}}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
                  <Text style={styles.reviewName}>{rev.name}</Text>
                  <Stars rating={rev.star} size={12} />
                </View>
                <Text style={styles.reviewText}>{rev.review_text}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* --- Add Review Modal --- */}
      <Modal transparent visible={reviewOpen} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add your review</Text>

            {/* star selector */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map(n => (
                <TouchableOpacity
                  key={n}
                  onPress={() => setRating(n)}
                  style={{padding: 4}}>
                  <Ionicons
                    name={n <= rating ? 'star' : 'star-outline'}
                    size={26}
                    color="#FDCC0D"
                  />
                </TouchableOpacity>
              ))}
            </View>
            {rating < 1 && (
              <Text style={styles.warnText}>
                Please select at least 1 star.
              </Text>
            )}

            {/* text box */}
            <TextInput
              style={styles.reviewInput}
              placeholder="Write your review..."
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={4}
            />

            {/* actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.noBtn}
                onPress={() => {
                  setReviewOpen(false);
                  setRating(0);
                  setText('');
                }}>
                <Text style={{color: '#000', fontWeight: '600'}}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!canSubmit}
                onPress={() => submitReview()}
                style={[styles.yesBtn, {opacity: canSubmit ? 1 : 0.5}]}>
                <Text style={{color: '#fff', fontWeight: '600'}}>
                  {isSubmitting ? 'Submitting…' : 'Submit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default WeddingServicesScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFEFF4'},
  header: {flexDirection: 'row', alignItems: 'center', padding: 16},
  avatar: {width: 45, height: 45, borderRadius: 25, marginRight: 12},
  welcome: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  location: {fontSize: 13, color: '#555'},
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
  },
  searchInput: {flex: 1, fontSize: 14, marginLeft: 6, color: '#000'},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  sectionTitle: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  subText: {fontSize: 13, color: '#555'},
  linkText: {fontSize: 13, color: '#E91E63', fontWeight: 'bold'},
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 14,
    elevation: 3,
  },
  cardImage: {width: '100%', height: 200, borderRadius: 12},
  likeBadge: {
    position: 'absolute',
    top: 25,
    right: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  likeText: {color: '#fff', marginLeft: 4, fontSize: 12},
  cardTitle: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  cardLocation: {fontSize: 13, color: '#555', marginTop: 6},
  ratingRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  stars: {fontSize: 14},
  rating: {fontSize: 13, marginLeft: 5, color: '#555'},
  cardSubtitle: {marginTop: 10, fontWeight: 'bold', color: '#000'},
  cardText: {fontSize: 13, color: '#555', marginTop: 2},
  contact: {fontSize: 13, color: '#333', marginTop: 2},
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  primaryBtn: {
    backgroundColor: '#E91E63',
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  primaryText: {color: '#fff', fontWeight: 'bold'},
  secondaryBtn: {
    backgroundColor: '#f2f2f2',
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  secondaryText: {color: '#000', fontWeight: 'bold'},
  reviewBtn: {
    backgroundColor: '#E91E63',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  reviewBtnText: {fontSize: 12, color: '#fff'},
  reviewCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 12,
    elevation: 2,
  },
  reviewAvatar: {width: 40, height: 40, borderRadius: 20, marginRight: 12},
  reviewName: {fontWeight: 'bold', color: '#000', marginBottom: 4},
  reviewText: {fontSize: 13, color: '#555'},

  // modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8},
  starRow: {flexDirection: 'row', justifyContent: 'center', marginBottom: 8},
  warnText: {textAlign: 'center', color: '#d00', marginBottom: 8},
  reviewInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 10,
    minHeight: 90,
    textAlignVertical: 'top',
    color: '#000',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  noBtn: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  yesBtn: {
    backgroundColor: '#E91E63',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
});
