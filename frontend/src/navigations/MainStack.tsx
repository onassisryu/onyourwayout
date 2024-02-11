/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {createNativeStackNavigator, NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';

//recoil&react-query
import {userDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';

//page
import {Screens} from '@screens/Screens';
import Main from '@screens/Main';
import Location from '@screens/Location';
import ChatMain from '@screens/Chating/ChatMain';
import ChatDetail from '@screens/Chating/ChatDetail';
import My from '@screens/My';
import MySetting from '@screens/MySetting';
import Login from '@screens/Login';
import Notice from '@screens/Notice';
import NoticeSettings from '@screens/NoticeSettings';
import DoIt1 from '@/screens/DoIt/DoIt1';
import DoIt2 from '@/screens/DoIt/DoIt2';
import DoItListDetail from '@/screens/DoItListDetail';
import DoItList from '@/screens/DoItList';
import GoOut1 from '@/screens/GoOut/GoOut1';
import GoOut2 from '@/screens/GoOut/GoOut2';
import AdminStack from '@/navigations/AdminStack';
import ApartCertification from '@/screens/My/ApartCertification';
import BankAccount from '@/screens/My/BankAccount';
import InvitationCode from '@/screens/My/InvitationCode';
import ServiceCenter from '@/screens/My/ServiceCenter';
import MyDoList from '@/screens/My/MyDoList';

//icon
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MainStack = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const BottomTab = () => {
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarStyle: {
            paddingBottom: 5,
            height: 60,
            fontweight: 'bold',
          },
          tabBarActiveTintColor: '#27D894',
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
          tabBarIcon: ({focused, size, color}) => {
            let iconName!: string;

            if (route.name === '홈') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === '위치') {
              iconName = focused ? 'location' : 'location-outline';
            } else if (route.name === '채팅') {
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            } else if (route.name === '아파트') {
              iconName = focused ? 'office-building' : 'office-building-outline';
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            } else if (route.name === '내정보') {
              iconName = focused ? 'person' : 'person-outline';
            }
            return <Ionic name={iconName!} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="홈" component={Main} />
        <Tab.Screen name="위치" component={Location} />
        <Tab.Screen name="아파트" component={DoItList} />
        <Tab.Screen name="채팅" component={ChatMain} />
        <Tab.Screen name="내정보" component={My} />
      </Tab.Navigator>
    );
  };

  return (
    <Stack.Navigator initialRouteName={'Main'} screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTab} initialParams={{initialTab: '홈'}} />
      <Stack.Screen name="Bottom" component={BottomTab} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Notice" component={Notice} />
      <Stack.Screen name="NoticeSettings" component={NoticeSettings} />
      <Stack.Screen name="GoOut1" component={GoOut1} />
      <Stack.Screen name="GoOut2" component={GoOut2} />
      <Stack.Screen name="DoIt1" component={DoIt1} />
      <Stack.Screen name="DoIt2" component={DoIt2} />
      <Stack.Screen name="ChatMain" component={ChatMain} />
      <Stack.Screen name="ChatDetail" component={ChatDetail} />
      <Stack.Screen name="MySetting" component={MySetting} />
      <Stack.Screen name="AdminStack" component={AdminStack} />
      <Stack.Screen name="DoItListDetail" component={DoItListDetail} />
      <Stack.Screen name="ApartCertification" component={ApartCertification} />
      <Stack.Screen name="BankAccount" component={BankAccount} />
      <Stack.Screen name="InvitationCode" component={InvitationCode} />
      <Stack.Screen name="ServiceCenter" component={ServiceCenter} />
      <Stack.Screen name="MyDoList" component={MyDoList} />
    </Stack.Navigator>
  );
};

export default MainStack;
