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
import Login from '@/screens/Login';
import Signup0 from '@/screens/Signup/Signup0';
import Signup1 from '@/screens/Signup/Signup1';
import Signup2 from '@/screens/Signup/Signup2';
import Signup3 from '@/screens/Signup/Signup3';
import Signup4 from '@/screens/Signup/Signup4';
import Signup5 from '@/screens/Signup/Signup5';
import Signup5a from '@/screens/Signup/Signup5a';
import Signup6 from '@/screens/Signup/Signup6';
import Signup7 from '@/screens/Signup/Signup7';
import Signup8 from '@/screens/Signup/Signup8';
import Signup9 from '@/screens/Signup/Signup9';
import Signup10 from '@/screens/Signup/Signup10';
import Main from '@screens/Main';
import Location from '@/screens/Map/Location';
import ChatMain from '@screens/Chating/ChatMain';
import ChatDetail from '@screens/Chating/ChatDetail';
import My from '@screens/My';
import MySetting from '@screens/MySetting';
import Notice from '@screens/Notice';
import NoticeSettings from '@screens/NoticeSettings';
import DoIt1 from '@/screens/DoIt/DoIt1';
import DoIt2 from '@/screens/DoIt/DoIt2';
import DoItListDetail from '@/screens/DoItListDetail';
import DoItList from '@/screens/DoItList';
import GoOut1 from '@/screens/GoOut/GoOut1';
import GoOut2 from '@/screens/GoOut/GoOut2';
import ApartCertification from '@/screens/My/ApartCertification';
import BankAccount from '@/screens/My/BankAccount';
import InvitationCode from '@/screens/My/InvitationCode';
import ServiceCenter from '@/screens/My/ServiceCenter';
import MyDoList from '@/screens/My/MyDoList';
import DoItPut from '@/screens/DoItPut';
import Report from '@/screens/Report';
import AdminMain from '@/screens/Admin/AdminMain';
import AdminNonCerti from '@/screens/Admin/AdminNonCerti';
import AdminComplainDeal from '@/screens/Admin/AdminComplainDeal';
import AdminComplainDealDetail from '@/screens/Admin/AdminComplainDealDetail';
import AdminPaused from '@/screens/Admin/AdminPaused';
import {useNavigation} from '@react-navigation/native';

//icon
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const MainStack = ({room, navigation}: any) => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const navigationRef = useNavigation();
  useEffect(() => {
    StatusBar.setBackgroundColor('#ffffff');
    StatusBar.setBarStyle('dark-content');
  }, []);
  useEffect(() => {
    if (room.id) {
      navigation.navigate('ChatDetail', {roomId: room.id, userId: room.userId, name: room.name, dong: room.dong});
    }
  }, [room]);

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
    <Stack.Navigator initialRouteName={'Login'} screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup0" component={Signup0} />
      <Stack.Screen name="Signup1" component={Signup1} />
      <Stack.Screen name="Signup2" component={Signup2} />
      <Stack.Screen name="Signup3" component={Signup3} />
      <Stack.Screen name="Signup4" component={Signup4} />
      <Stack.Screen name="Signup5" component={Signup5} />
      <Stack.Screen name="Signup5a" component={Signup5a} />
      <Stack.Screen name="Signup6" component={Signup6} />
      <Stack.Screen name="Signup7" component={Signup7} />
      <Stack.Screen name="Signup8" component={Signup8} />
      <Stack.Screen name="Signup9" component={Signup9} />
      <Stack.Screen name="Signup10" component={Signup10} />
      <Stack.Screen name="Main" component={BottomTab} initialParams={{initialTab: '홈'}} />
      <Stack.Screen name="Bottom" component={BottomTab} />
      <Stack.Screen name="Notice" component={Notice} />
      <Stack.Screen name="NoticeSettings" component={NoticeSettings} />
      <Stack.Screen name="GoOut1" component={GoOut1} />
      <Stack.Screen name="GoOut2" component={GoOut2} />
      <Stack.Screen name="DoIt1" component={DoIt1} />
      <Stack.Screen name="DoIt2" component={DoIt2} />
      <Stack.Screen name="ChatMain" component={ChatMain} />
      <Stack.Screen name="ChatDetail" component={ChatDetail} />
      <Stack.Screen name="MySetting" component={MySetting} />
      <Stack.Screen name="DoItListDetail" component={DoItListDetail} />
      <Stack.Screen name="ApartCertification" component={ApartCertification} />
      <Stack.Screen name="BankAccount" component={BankAccount} />
      <Stack.Screen name="InvitationCode" component={InvitationCode} />
      <Stack.Screen name="ServiceCenter" component={ServiceCenter} />
      <Stack.Screen name="MyDoList" component={MyDoList} />
      <Stack.Screen name="DoItPut" component={DoItPut} />
      <Stack.Screen name="Report" component={Report} />
      <Stack.Screen name="AdminMain" component={AdminMain} />
      <Stack.Screen name="AdminNonCerti" component={AdminNonCerti} />
      <Stack.Screen name="AdminComplainDeal" component={AdminComplainDeal} />
      <Stack.Screen name="AdminComplainDealDetail" component={AdminComplainDealDetail} />
      <Stack.Screen name="AdminPaused" component={AdminPaused} />
    </Stack.Navigator>
  );
};

export default MainStack;
