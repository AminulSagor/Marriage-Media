import {NavigationProp} from '@react-navigation/native';

export type RootStackParamList = {
  Auth: undefined;
  BottomTabs: undefined; // was MainTabs
};

export type AuthStackParamList = {
  Intro: undefined;
  Login: undefined;
  Signup: undefined;
};

export type BottomTabParamList = {
  ProfileTab: undefined;
  ChatTab: undefined;
  WorldTab: undefined;
  HeartTab: undefined;
  HomeTab: undefined;
};

export type RootNavigation = NavigationProp<RootStackParamList>;
export type AuthNavigation = NavigationProp<AuthStackParamList>;
export type TabNavigation = NavigationProp<BottomTabParamList>;
