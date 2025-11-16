import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'marriage-media-auth-token';

export async function saveToken(token: string): Promise<void> {
  await Keychain.setGenericPassword('auth', token, {
    service: TOKEN_SERVICE,
    accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK,
  });
}

export async function getToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({service: TOKEN_SERVICE});
  return creds ? creds.password : null;
}

export async function deleteToken(): Promise<void> {
  await Keychain.resetGenericPassword({service: TOKEN_SERVICE});
}
