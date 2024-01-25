/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ThemeProvider} from 'styled-components/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Theme from '@/Theme';
import Home from '@screens/Home';
import Location from '@screens/Location';
import Chat from '@screens/Chat';
import Apart from '@screens/Apart';
import My from '@screens/My';

//icon
import Ionic from 'react-native-vector-icons/Ionicons';

import {NavigationContainer} from '@react-navigation/native';

const App = () => {
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
            tabBarActiveTinitColor: '#27D894',
            height: 60,
          },
          tabBarIcon: ({focused, color, size}) => {
            let iconName!: string;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Location') {
              iconName = focused ? 'location' : 'location-outline';
            }
            return <Ionic name={iconName!} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="홈" component={Home} />
        <Tab.Screen name="위치" component={Location} />
        <Tab.Screen name="아파트" component={Apart} />
        <Tab.Screen name="채팅" component={Chat} />
        <Tab.Screen name="내정보" component={My} />
      </Tab.Navigator>
    );
  };
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Bottom" component={BottomTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
