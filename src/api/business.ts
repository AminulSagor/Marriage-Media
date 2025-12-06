import {api} from './client';

export interface Business {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  city: string | null;
  country: string | null;
  shop_name: string;
  one_liner?: string | null;
  cover_path?: string | null; // relative path
  about_us?: string | null;
  services?: string | null;
  created_at?: string;
  updated_at?: string;
  category?: string | null;
  website?: string | null;
  owner_name?: string | null;
  owner_profile?: string | null; // relative path
  distance?: number; // when lat/lng supplied

  // new optional fields
  postal_code?: string | null;
  street?: string | null;
  email?: string | null;
  phone?: string | null;
}

export interface GetBusinessesResponse {
  status: string; // "success"
  page: number;
  limit: number;
  businesses: Business[];
}

export interface GetBusinessesParams {
  latitude?: number;
  longitude?: number;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * GET & filter businesses:
 * /business/get-businesses?latitude=&longitude=&search=&page=&limit=
 */
export async function fetchBusinesses(
  params: GetBusinessesParams = {},
): Promise<GetBusinessesResponse> {
  const {latitude, longitude, search, page, limit} = params;

  const res = await api.get<GetBusinessesResponse>('/business/get-businesses', {
    params: {
      ...(latitude !== undefined ? {latitude} : {}),
      ...(longitude !== undefined ? {longitude} : {}),
      ...(search ? {search} : {}),
      ...(page !== undefined ? {page} : {}),
      ...(limit !== undefined ? {limit} : {}),
    },
  });

  return res.data;
}

/**
 * Convenience: returns just array of businesses (if that’s all you need).
 */
export async function fetchBusinessList(
  params: GetBusinessesParams = {},
): Promise<Business[]> {
  const data = await fetchBusinesses(params);
  return data.businesses || [];
}

export interface BusinessReview {
  review_text: string;
  star: number; // 1..5
  name: string; // reviewer name
  pro_path?: string | null; // relative path to reviewer photo (if any)
}

export interface GetBusinessReviewsResponse {
  status: string; // "success"
  data: BusinessReview[]; // list of reviews
}

/**
 * GET business reviews
 * Endpoint: /business/reviews/{business_id}
 */
export async function fetchBusinessReviews(
  businessId: number,
): Promise<GetBusinessReviewsResponse> {
  const res = await api.get<GetBusinessReviewsResponse>(
    `/business/reviews/${businessId}`,
  );
  return res.data;
}

/**
 * Convenience: returns just the array of reviews.
 */
export async function fetchBusinessReviewList(
  businessId: number,
): Promise<BusinessReview[]> {
  const data = await fetchBusinessReviews(businessId);
  return data.data || [];
}

export interface PostBusinessReviewPayload {
  business_id: number;
  review_text: string;
  star?: number; // optional per API
}

export interface PostBusinessReviewResponse {
  status: string; // "success"
  message?: string; // e.g., "Review created successfully"
}

// POST /business/add-review
export async function addBusinessReview(
  payload: PostBusinessReviewPayload,
): Promise<PostBusinessReviewResponse> {
  const res = await api.post<PostBusinessReviewResponse>(
    '/business/add-review',
    payload,
  );
  return res.data;
}

export interface CreateBusinessInput {
  // one of (city+country) OR (latitude+longitude) is enough (per API docs)
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;

  shop_name: string; // required
  one_liner: string; // required
  about_us: string; // required
  services: string; // required
  category: string; // required
  website?: string; // optional

  // new optional fields
  postal_code?: string;
  street?: string;
  email?: string;
  phone?: string;

  /**
   * Image file for cover.
   * For React Native, pass { uri, name, type }.
   * Example: { uri: 'file:///...', name: 'cover.jpg', type: 'image/jpeg' }
   */
  cover: {uri: string; name?: string; type?: string} | any;
}

export interface CreateBusinessResponse {
  status: string; // "success"
  message: string; // e.g., "Business profile created successfully"
  business?: Business; // if backend returns the created object (optional)
}

export async function createBusinessProfile(
  input: CreateBusinessInput,
): Promise<CreateBusinessResponse> {
  const fd = new FormData();

  // Coordinates / location (optional)
  if (input.latitude != null) fd.append('latitude', String(input.latitude));
  if (input.longitude != null) fd.append('longitude', String(input.longitude));
  if (input.city) fd.append('city', input.city);
  if (input.country) fd.append('country', input.country);

  // Required fields
  fd.append('shop_name', input.shop_name);
  fd.append('one_liner', input.one_liner);
  fd.append('about_us', input.about_us);
  fd.append('services', input.services);
  fd.append('category', input.category);

  // Optional
  if (input.website) fd.append('website', input.website);

  // new optional fields
  if (input.postal_code) fd.append('postal_code', input.postal_code);
  if (input.street) fd.append('street', input.street);
  if (input.email) fd.append('email', input.email);
  if (input.phone) fd.append('phone', input.phone);

  // Image file (required) — API expects key `cover_path`
  const file = input.cover?.uri
    ? {
        uri: input.cover.uri,
        name: input.cover.name || 'cover.jpg',
        type: input.cover.type || 'image/jpeg',
      }
    : input.cover; // fallback if already a File/Blob in web
  fd.append('cover_path', file);

  const res = await api.post<CreateBusinessResponse>('/business/create', fd, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

  return res.data;
}
