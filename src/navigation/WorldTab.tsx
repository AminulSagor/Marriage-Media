import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Platform, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import WorldScreen from '../screens/main/WorldScreen';
import WeddingServicesScreen from '../screens/main/WeddingServicesScreen';
import OtherProfileScreen from '../screens/main/OtherProfileScreen';
import BusinessSignup from '../screens/auth/BusinessSignup';
import BusMobileScreen from '../screens/auth/BusMobileScreen';
import BusOtpScreen from '../screens/auth/BusOtpScreen';
import BusVerifyEmail from '../screens/auth/BusVerifyEmail';
import SubscriptionScreen from '../screens/auth/SubscriptionScreen';
import PaymentScreen from '../screens/auth/PaymentScreen';

const Stack = createStackNavigator();
const WorldTab = () => {
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
          component={WorldScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="WeddingServicesScreen"
          component={WeddingServicesScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="OtherProfileScreen"
          component={OtherProfileScreen}
        />
        {/* BUSINESS CREATE FLOW?? */}
        <Stack.Screen
          options={{headerShown: false}}
          name="BusinessSignup"
          component={BusinessSignup}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="BusMobileScreen"
          component={BusMobileScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="BusOtpScreen"
          component={BusOtpScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="BusVerifyEmail"
          component={BusVerifyEmail}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SubscriptionScreen"
          component={SubscriptionScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="PaymentScreen"
          component={PaymentScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default WorldTab;
