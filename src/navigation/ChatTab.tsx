import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {Platform, StatusBar, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import ChatScreen from '../screens/main/ChatScreen';
import SingleChat from '../screens/main/SingleChat';
import OtherProfileScreen from '../screens/main/OtherProfileScreen';

const Stack = createStackNavigator();
const ChatTab = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        {Platform.OS === 'ios' ? (
          <StatusBar barStyle="dark-content" backgroundColor={'blue'} />
        ) : (
          <StatusBar barStyle="light-content" backgroundColor={'blue'} />
        )}
      </View>

      <Stack.Navigator initialRouteName="ChatScreen">
        <Stack.Screen
          options={{headerShown: false}}
          name="ChatScreen"
          component={ChatScreen}
        />
        <Stack.Screen
          options={{tabBarStyle: {display: 'none'}, headerShown: false}}
          name="SingleChat"
          component={SingleChat}
        />
        <Stack.Screen
          options={{tabBarStyle: {display: 'none'}, headerShown: false}}
          name="OtherProfileScreen"
          component={OtherProfileScreen}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
};

export default ChatTab;
