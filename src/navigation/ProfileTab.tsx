// ProfileTabNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {Platform, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native';

import ProfileScreen from '../screens/main/ProfileScreen';
import SettingScreen from '../screens/main/SettingScreen';
import GernalScreen from '../screens/main/GernalScreen';
import OtherProfileScreen from '../screens/main/OtherProfileScreen';
import LocationSettingScreen from '../screens/main/LocationSettingScreen';
import ProfileVisitedScreen from '../screens/main/ProfileVisitedScreen';
import BlockUnblockUsersScreen from '../screens/main/BlockUnblockUsersScreen';
import PaymentScreen from '../screens/auth/PaymentScreen';
import EditAppearanceScreen from '../screens/main/EditAppearanceScreen';
import EditReligionScreen from '../screens/main/EditReligionScreen';
import EditPersonalInfo from '../screens/main/EditPersonalInfo';

const Stack = createStackNavigator();

const ProfileTab = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" backgroundColor={'blue'} />
        ) : (
          <StatusBar barStyle="light-content" backgroundColor={'blue'} />
        )}
      </View>

      <Stack.Navigator initialRouteName="ProfileScreen">
        <Stack.Screen
          options={{headerShown: false}}
          name="ProfileScreen"
          component={ProfileScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SettingScreen"
          component={SettingScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="GernalScreen"
          component={GernalScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="OtherProfileScreen"
          component={OtherProfileScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="LocationSetting"
          component={LocationSettingScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ProfileVisited"
          component={ProfileVisitedScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="BlockUnblockUsers"
          component={BlockUnblockUsersScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="PaymentScreen"
          component={PaymentScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditAppearance"
          component={EditAppearanceScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditReligionDetails"
          component={EditReligionScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditPersonalInfo"
          component={EditPersonalInfo}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default ProfileTab;
