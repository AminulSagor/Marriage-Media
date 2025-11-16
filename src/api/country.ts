import {api} from './client';

interface GetCountriesResponse {
  status: string;
  total: number;
  countries: string[];
}

export async function fetchCountries(): Promise<string[]> {
  const res = await api.get<GetCountriesResponse>('/users/countries');
  return res.data.countries || [];
}

export interface City {
  city_id: number;
  city_name: string;
}

export interface CitiesResponse {
  status: string; // "success"
  total: number;
  country: string;
  cities: City[];
}

export const fetchCitiesByCountry = async (
  country: string,
): Promise<City[]> => {
  if (!country) {
    throw new Error('Country is required to fetch cities');
  }

  const encoded = encodeURIComponent(country);
  const res = await api.get<CitiesResponse>(`/users/cities/${encoded}`);

  if (res.data?.status !== 'success' || !Array.isArray(res.data.cities)) {
    throw new Error('Failed to load cities');
  }

  return res.data.cities;
};
