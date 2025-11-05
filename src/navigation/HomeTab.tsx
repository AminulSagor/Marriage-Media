import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Platform, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import HomeScreen from '../screens/main/HomeScreen';
import NearUser from '../screens/main/NearUser';
import MatchScreen from '../screens/main/MatchScreen';
import OtherProfileScreen from '../screens/main/OtherProfileScreen';
import ChatScreen from '../screens/main/ChatScreen';

const Stack = createStackNavigator();
const HomeTab = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" backgroundColor={'blue'} />
        ) : (
          <StatusBar barStyle="light-content" backgroundColor={'blue'} />
        )}
      </View>

      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          options={{headerShown: false}}
          name="HomeScreen"
          component={HomeScreen}
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
          name="OtherProfileScreen"
          component={OtherProfileScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ChatScreen"
          component={ChatScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default HomeTab;
