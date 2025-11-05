import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

// Your screen components
import ProfileTab from './ProfileTab';
import ChatTab from './ChatTab';
import WorldTab from './WorldTab';
import HeartTab from './HeartTab';
import HomeTab from './HomeTab';
import {getFocusedRouteNameFromRoute, Route} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const getTabBarVisibility = (route: Partial<Route<string>>) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'EventsScreen';

  const hideTabBarRoutes = [
    'SettingScreen',
    'WeddingServicesScreen',
    'FilterScreen',
    'SingleChat',
    'OtherProfileScreen',
  ];

  return hideTabBarRoutes.includes(routeName) ? 'none' : 'flex';
};

const BottomTabs = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Platform.OS === 'android' ? 'white' : undefined}
      />
      <Tab.Navigator
        initialRouteName="HomeTab"
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: '#FF3E7DEB',
            marginHorizontal: 20,
            marginBottom: 20,
            borderRadius: 18,
            height: 60,
            position: 'absolute',
            left: 0,
            right: 0,
            shadowColor: '#FF3C7B6B',
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 10,
          },
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => {
            let iconSource;
            switch (route.name) {
              case 'ProfileTab':
                iconSource = require('../assets/images/bot1.png');
                break;
              case 'ChatTab':
                iconSource = require('../assets/images/bot4.png');
                break;
              case 'WorldTab':
                iconSource = require('../assets/images/bot3.png');
                break;
              case 'HeartTab':
                iconSource = require('../assets/images/bot5.png');
                break;
              case 'HomeTab':
                iconSource = require('../assets/images/bot2.png');
                break;
              default:
                iconSource = require('../assets/images/bot2.png');
            }
            return (
              <Image
                source={iconSource}
                style={{
                  width: 35,
                  height: 35,
                  top: 10,
                  tintColor: focused ? '#fff' : '#FFC0CB',
                }}
                resizeMode="contain"
              />
            );
          },
        })}>
        <Tab.Screen name="ProfileTab" component={ProfileTab} />
        <Tab.Screen name="ChatTab" component={ChatTab} />
        <Tab.Screen name="WorldTab" component={WorldTab} />
        <Tab.Screen name="HeartTab" component={HeartTab} />
        <Tab.Screen name="HomeTab" component={HomeTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FF3E7DEB',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 18,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    // elevation: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: '#FF3C7B6B',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabImage: {
    width: 35,
    height: 35,
  },
});
