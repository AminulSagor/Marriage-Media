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
    if (__DEV__) console.log('fetchProfile error:', error);
    throw error;
  }
}

/** ---------- UPDATE PROFILE ---------- **/

export interface UpdateProfilePayload {
  name?: string;
  gender?: string;
  dob?: string;
  country?: string;
  city?: string;
  latitude?: string | number;
  longitude?: string | number;
  ethnicity?: string;
  education?: string;
  profession?: string;
  body_type?: string;
  height?: string | number;
  weight?: string | number;
  hair_color?: string;
  eye_color?: string;
  skin_color?: string;
  religion?: string;
  religion_section?: string;
  prayer_frequency?: string | number;
  dress_code?: string;
  dietary_preference?: string;
  marital_status?: string;
  marital_duration?: number;
  have_child?: string; // API expects string per spec
  want_child?: string;
  prefered_partner_age_start?: number;
  prefered_partner_age_end?: number;
  prefered_partner_distance_range?: number;
  prefered_partner_religion?: string;
  prefered_partner_religion_section?: string;
  prefered_partner_occupation?: string;
  prefered_partner_education?: string;
}

export interface UpdateProfileResponse {
  status: string; // "success"
  message: string; // "user details updated"
}

/**
 * Update profile.
 * Endpoint: /users/update
 * Note: Docs show GET, but server accepts a body; send as POST JSON.
 * The payload is cleaned so undefined/empty-string fields aren’t sent.
 */
export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<UpdateProfileResponse> {
  const body: Record<string, unknown> = {};
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') body[k] = v;
  });

  const {data} = await api.put<UpdateProfileResponse>('/users/update', body);
  return data;
}
