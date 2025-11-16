// src/api/auth.ts
import {api} from './client';
import {saveToken, deleteToken} from '../storage/secureToken';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginUser {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  user: LoginUser;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const res = await api.post<LoginResponse>('/users/login', payload);
    if (res.data?.token) {
      await saveToken(res.data.token);
    }
    return res.data;
  } catch (error) {
    if (__DEV__) {
      console.log('login error:', error);
    }
    throw error; // mutation.onError + error.message in UI
  }
}

export async function logout(): Promise<void> {
  try {
    await deleteToken();
    // optionally call backend logout endpoint here
  } catch (error) {
    if (__DEV__) {
      console.log('logout error:', error);
    }
    // usually you don't rethrow on logout; token is gone locally anyway
  }
}

export interface RegisterFile {
  uri: string; // file path from image picker / camera
  name?: string; // optional, we'll fallback
  type?: string; // e.g. 'image/jpeg'
}

export interface RegisterPayload {
  // required
  name: string;
  phone: number | string;
  email: string;
  password: string | number;
  gender: string;
  dob: string; // 'YYYY-MM-DD'
  country: string;
  city: string;
  partner_age_start: number;
  partner_age_end: number;
  pro_path: RegisterFile; // profile image

  // optional
  ethnicity?: string;
  education?: string;
  profession?: string;
  body_type?: string;
  height?: number;
  weight?: number;
  hair_color?: string;
  eye_color?: string;
  skin_color?: string;
  religion?: string;
  religion_section?: string;
  prayer_frequency?: string;
  dress_code?: string;
  dietary_preference?: string;
  marital_status?: string;
  marital_duration?: number;
  have_child?: number;
  want_child?: number;
  partner_distance_range?: number;
  partner_religion?: string;
  partner_religion_section?: string;
  partner_occupation?: string;
  partner_education?: string;
  image_one?: RegisterFile;
  image_two?: RegisterFile;
}

export interface RegisterResponse {
  status: string; // "success"
  message: string; // "User created successfully"
}

export const registerUser = async (
  payload: RegisterPayload,
  otp?: string,
): Promise<RegisterResponse> => {
  try {
    const formData = new FormData();

    // Helper to append images in RN-safe format
    const appendFile = (key: string, file?: RegisterFile) => {
      if (!file || !file.uri) return;
      formData.append(key, {
        uri: file.uri,
        name: file.name ?? `${key}.jpg`,
        type: file.type ?? 'image/jpeg',
      } as any);
    };

    // Required text/number fields
    formData.append('name', payload.name);
    formData.append('phone', String(payload.phone));
    formData.append('email', payload.email);
    formData.append('password', String(payload.password));
    formData.append('gender', payload.gender);
    formData.append('dob', payload.dob);
    formData.append('country', payload.country);
    formData.append('city', payload.city);
    formData.append('partner_age_start', String(payload.partner_age_start));
    formData.append('partner_age_end', String(payload.partner_age_end));

    // Required profile image
    appendFile('pro_path', payload.pro_path);

    // Optional scalar fields: only send if defined
    const optionalScalarFields: (keyof RegisterPayload)[] = [
      'ethnicity',
      'education',
      'profession',
      'body_type',
      'height',
      'weight',
      'hair_color',
      'eye_color',
      'skin_color',
      'religion',
      'religion_section',
      'prayer_frequency',
      'dress_code',
      'dietary_preference',
      'marital_status',
      'marital_duration',
      'have_child',
      'want_child',
      'partner_distance_range',
      'partner_religion',
      'partner_religion_section',
      'partner_occupation',
      'partner_education',
    ];

    optionalScalarFields.forEach(field => {
      const value = payload[field];
      if (
        value !== undefined &&
        value !== null &&
        field !== 'pro_path' &&
        field !== 'image_one' &&
        field !== 'image_two'
      ) {
        formData.append(field, String(value));
      }
    });

    // Optional images
    appendFile('image_one', payload.image_one);
    appendFile('image_two', payload.image_two);

    const res = await api.post<RegisterResponse>('/users/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(otp ? {otp} : {}), // attach verified OTP if you have it
      },
    });

    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || 'Registration failed';
    const wrapped = new Error(message);
    (wrapped as any).cause = err;
    throw wrapped;
  }
};
