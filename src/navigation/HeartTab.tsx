import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Platform, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import HeartScreen from '../screens/main/HeartScreen';
import NearUser from '../screens/main/NearUser';
import MatchScreen from '../screens/main/MatchScreen';
import FilterScreen from '../screens/main/FilterScreen';
import OtherProfileScreen from '../screens/main/OtherProfileScreen';

const Stack = createStackNavigator();
const HeartTab = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" backgroundColor={'blue'} />
        ) : (
          <StatusBar barStyle="light-content" backgroundColor={'blue'} />
        )}
      </View>

      <Stack.Navigator initialRouteName="HeartScreen">
        <Stack.Screen
          options={{headerShown: false}}
          name="HeartScreen"
          component={HeartScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="NearUser"
          component={NearUser}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="MatchScreen"
          component={MatchScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="FilterScreen"
          component={FilterScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="OtherProfileScreen"
          component={OtherProfileScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default HeartTab;
