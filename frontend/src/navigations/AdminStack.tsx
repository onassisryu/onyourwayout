import AdminComplainDeal from '@/screens/Admin/AdminComplainDeal';
import AdminComplainDealDetail from '@/screens/Admin/AdminComplainDealDetail';
import AdminMain from '@/screens/Admin/AdminMain';
import AdminNonCerti from '@/screens/Admin/AdminNonCerti';
import AdminNonCertiDetail from '@/screens/Admin/AdminNonCertiDetail';
import AdminPaused from '@/screens/Admin/AdminPaused';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';

import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AdminStack = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'AdminMain'}>
      <Stack.Screen name="AdminMain" component={AdminMain} />
      <Stack.Screen name="AdminNonCerti" component={AdminNonCerti} />
      <Stack.Screen name="AdminComplainDeal" component={AdminComplainDeal} />
      <Stack.Screen name="AdminComplainDealDetail" component={AdminComplainDealDetail} />
      <Stack.Screen name="AdminPaused" component={AdminPaused} />
    </Stack.Navigator>
  );
};
export default AdminStack;
