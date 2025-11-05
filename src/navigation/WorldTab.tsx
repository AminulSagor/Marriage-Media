import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Platform, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import WorldScreen from '../screens/main/WorldScreen';
import WeddingServicesScreen from '../screens/main/WeddingServicesScreen';
import OtherProfileScreen from '../screens/main/OtherProfileScreen';

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
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default WorldTab;
