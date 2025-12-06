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
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await deleteToken();
  } catch (error) {
    if (__DEV__) {
      console.log('logout error:', error);
    }
  }
}

export interface RegisterFile {
  uri: string;
  name?: string;
  type?: string;
}

export interface RegisterPayload {
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
  pro_path: RegisterFile;

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
  prefered_partner_marital_status?: string;
  prefered_partner_ethnicity?: string;
}

export interface RegisterResponse {
  status: string;
  message: string;
}

export const registerUser = async (
  payload: RegisterPayload,
  otp?: string,
): Promise<RegisterResponse> => {
  try {
    const formData = new FormData();

    const appendFile = (key: string, file?: RegisterFile) => {
      if (!file || !file.uri) return;
      formData.append(key, {
        uri: file.uri,
        name: file.name ?? `${key}.jpg`,
        type: file.type ?? 'image/jpeg',
      } as any);
    };

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

    appendFile('pro_path', payload.pro_path);

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
      'prefered_partner_marital_status',
      'prefered_partner_ethnicity',
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

    appendFile('image_one', payload.image_one);
    appendFile('image_two', payload.image_two);

    const res = await api.post<RegisterResponse>('/users/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(otp ? {otp} : {}),
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

export interface ResetPasswordResponse {
  status: string; // "success"
  message: string; // "Password reset successful"
}

/**
 * PUT /users/reset-password
 * body: { email, password }
 * header: otp
 */
export const resetPassword = async (
  email: string,
  password: string,
  otp: string,
): Promise<ResetPasswordResponse> => {
  try {
    const res = await api.put<ResetPasswordResponse>(
      '/users/reset-password',
      {
        email,
        password,
      },
      {
        headers: {
          otp,
        },
      },
    );
    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message || err?.message || 'Password reset failed';
    const wrapped = new Error(message);
    (wrapped as any).cause = err;
    throw wrapped;
  }
};
