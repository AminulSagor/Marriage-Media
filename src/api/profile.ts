// src/api/profile.ts
import {api} from './client';

export interface UserProfile {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  gender: string | null;
  dob: string | null;
  country: string | null;
  city: string | null;
  latitude?: number | null;
  longitude?: number | null;
  ethnicity?: string | null;
  education?: string | null;
  profession?: string | null;
  body_type?: string | null;
  height?: number | null;
  weight?: number | null;
  hair_color?: string | null;
  eye_color?: string | null;
  skin_color?: string | null;
  religion?: string | null;
  religion_section?: string | null;
  prayer_frequency?: string | null | number;
  dress_code?: string | null;
  dietary_preference?: string | null;
  marital_status?: string | null;
  have_child?: number | null;
  // add any other fields you need from the API
  pro_path?: string | null;
  image_one?: string | null;
  image_two?: string | null;
}

interface ProfileResponse {
  status: string;
  data: UserProfile;
}

export async function fetchProfile(): Promise<UserProfile> {
  try {
    const res = await api.get<ProfileResponse>('/users/profile');
    return res.data.data;
  } catch (error) {
    // Optional: extra logging specific to this call
    if (__DEV__) {
      console.log('fetchProfile error:', error);
    }
    // Important: rethrow so React Query / caller gets it
    throw error;
  }
}
