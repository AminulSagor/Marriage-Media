import { NavigationProp } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
};

export type AuthStackParamList = {
  Intro: undefined;
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RootNavigation = NavigationProp<RootStackParamList>;
export type AuthNavigation = NavigationProp<AuthStackParamList>;
export type TabNavigation = NavigationProp<TabParamList>;