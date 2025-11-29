import {api} from './client';

export interface SendOtpResponse {
  status: string; // "success"
  message: string; // "Verification email sent successfully"
}

/**
 * Send signup OTP to given email.
 */
export const sendSignupOtp = async (
  email: string,
): Promise<SendOtpResponse> => {
  try {
    const res = await api.post<SendOtpResponse>('/users/send-otp', {
      email,
      otp_method: 'signup',
    });
    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Failed to send verification code';
    const wrapped = new Error(message);
    (wrapped as any).cause = err;
    throw wrapped;
  }
};

export const sendResetOtp = async (email: string): Promise<SendOtpResponse> => {
  try {
    const res = await api.post<SendOtpResponse>('/users/send-otp', {
      email,
      otp_method: 'reset',
    });
    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      'Failed to send verification code';
    const wrapped = new Error(message);
    (wrapped as any).cause = err;
    throw wrapped;
  }
};

export const verifyOtp = async (payload: {email: string; otp: string}) => {
  const res = await api.post('/users/verify-otp', payload);
  return res.data;
};
