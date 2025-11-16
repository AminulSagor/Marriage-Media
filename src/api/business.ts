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
