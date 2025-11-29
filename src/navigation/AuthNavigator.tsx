import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LanguageScreen from '../screens/auth/LanguageScreen';
import BismilaScreen from '../screens/auth/BismilaScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RecoverScreen from '../screens/auth/RecoverScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import VerifyEmail from '../screens/auth/VerifyEmail';
import OtpScreen from '../screens/auth/OtpScreen';
import GenderScreen from '../screens/auth/GenderScreen';
import IdentityScreen from '../screens/auth/IdentityScreen';
import DobScreen from '../screens/auth/DobScreen';
import SelectCountry from '../screens/auth/SelectCountry';
import IdentityScreen2 from '../screens/auth/IdentityScreen2';
import IdentityScreen3 from '../screens/auth/IdentityScreen3';
import IdentityScreen4 from '../screens/auth/IdentityScreen4';
import IdentityScreen5 from '../screens/auth/IdentityScreen5';
import BodyType from '../screens/auth/BodyType';
import ReligionType from '../screens/auth/ReligionType';
import MetrialType from '../screens/auth/MetrialType';
import BodyTypeTwo from '../screens/auth/BodyTypeTwo';
import BodyTypeThree from '../screens/auth/BodyTypeThree';
import BodyTypeFour from '../screens/auth/BodyTypeFour';
import PhotoUpload from '../screens/auth/PhotoUpload';
import FaceVerify from '../screens/auth/FaceVerify';
import FaceVerifyTwo from '../screens/auth/FaceVerifyTwo';
import BestMatch from '../screens/auth/BestMatch';
import BusinessSignup from '../screens/auth/BusinessSignup';
import BusOtpScreen from '../screens/auth/BusOtpScreen';
import BusVerifyEmail from '../screens/auth/BusVerifyEmail';
import BusMobileScreen from '../screens/auth/BusMobileScreen';
import BusOtpScreen2 from '../screens/auth/BusOtpScreen2';
import SubscriptionScreen from '../screens/auth/SubscriptionScreen';
import BottomTabs from './BottomTabs';
import PaymentScreen from '../screens/auth/PaymentScreen';

import {SignupFlowProvider} from '../context/SignupFlowContext';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <SignupFlowProvider>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
        <Stack.Screen name="BismilaScreen" component={BismilaScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RecoverScreen" component={RecoverScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="GenderScreen" component={GenderScreen} />
        <Stack.Screen name="IdentityScreen" component={IdentityScreen} />
        <Stack.Screen name="DobScreen" component={DobScreen} />
        <Stack.Screen name="SelectCountry" component={SelectCountry} />
        <Stack.Screen name="IdentityScreen2" component={IdentityScreen2} />
        <Stack.Screen name="IdentityScreen3" component={IdentityScreen3} />
        <Stack.Screen name="IdentityScreen4" component={IdentityScreen4} />
        <Stack.Screen name="IdentityScreen5" component={IdentityScreen5} />
        <Stack.Screen name="BodyType" component={BodyType} />
        <Stack.Screen name="BodyTypeTwo" component={BodyTypeTwo} />
        <Stack.Screen name="ReligionType" component={ReligionType} />
        <Stack.Screen name="MetrialType" component={MetrialType} />
        <Stack.Screen name="BodyTypeThree" component={BodyTypeThree} />
        <Stack.Screen name="BodyTypeFour" component={BodyTypeFour} />
        <Stack.Screen name="PhotoUpload" component={PhotoUpload} />
        <Stack.Screen name="FaceVerify" component={FaceVerify} />
        <Stack.Screen name="FaceVerifyTwo" component={FaceVerifyTwo} />
        <Stack.Screen name="BestMatch" component={BestMatch} />
        <Stack.Screen name="BusinessSignup" component={BusinessSignup} />
        <Stack.Screen name="BusOtpScreen" component={BusOtpScreen} />
        <Stack.Screen name="BusVerifyEmail" component={BusVerifyEmail} />
        <Stack.Screen name="BusMobileScreen" component={BusMobileScreen} />
        <Stack.Screen name="BusOtpScreen2" component={BusOtpScreen2} />
        <Stack.Screen
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name="SubscriptionScreen"
          component={SubscriptionScreen}
        />
        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />

        <Stack.Screen name="BottomTabs" component={BottomTabs} />
      </Stack.Navigator>
    </SignupFlowProvider>
  );
}
