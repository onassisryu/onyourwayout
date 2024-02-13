import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AdminMain from '@/screens/Admin/AdminMain';
import AdminNonCerti from '@/screens/Admin/AdminNonCerti';
import AdminNonCertiDetail from '@/screens/Admin/AdminNonCertiDetail';
import AdminPaused from '@/screens/Admin/AdminPaused';

import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminStack = () => {
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
        <Tab.Screen name="홈" component={AdminMain} />
        <Tab.Screen name="위치" component={AdminNonCerti} />
        <Tab.Screen name="아파트" component={AdminNonCertiDetail} />
        <Tab.Screen name="채팅" component={AdminPaused} />
      </Tab.Navigator>
    );
  };

  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'AdminMain'}>
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="AdminMain" component={AdminMain} />
      <Stack.Screen name="AdminNonCerti" component={AdminNonCerti} />
      <Stack.Screen name="AdminNonCertiDetail" component={AdminNonCertiDetail} />
      <Stack.Screen name="AdminPaused" component={AdminPaused} />
    </Stack.Navigator>
  );
};
export default AdminStack;
