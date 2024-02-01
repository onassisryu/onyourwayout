/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

//recoil&react-query
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '@/recoil/atoms';
import {QueryClient, QueryClientProvider} from 'react-query';

import {ThemeProvider} from '@emotion/react';
import theme from '@/Theme';

//fcm
import messaging from '@react-native-firebase/messaging';
// 앱이 백그라운드에 있을때
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[Background Remote Message]', remoteMessage);
});

//page
import Home from '@screens/Home';
import Location from '@screens/Location';
import Chat from '@screens/Chat';
import Apart from '@screens/Apart';
import My from '@screens/My';
import Login from '@screens/Login';
import Notice from '@screens/Notice';
import NoticeSettings from '@screens/NoticeSettings';
import DoIt1 from '@/screens/DoIt/DoIt1';
import Signup1 from '@/screens/Signup/Signup1';
import Signup2 from '@/screens/Signup/Signup2';
import Signup3 from '@/screens/Signup/Signup3';
import Signup4 from '@/screens/Signup/Signup4';
import Signup5 from '@/screens/Signup/Signup5';
import Signup6 from '@/screens/Signup/Signup6';

//icon
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const queryClient = new QueryClient();
  const isLoggedIn = useRecoilValue(isLoggedInState);
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
        <Tab.Screen name="홈" component={Home} />
        <Tab.Screen name="위치" component={Location} />
        <Tab.Screen name="아파트" component={Apart} />
        <Tab.Screen name="채팅" component={Chat} />
        <Tab.Screen name="내정보" component={My} />
      </Tab.Navigator>
    );
  };
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <ThemeProvider theme={theme}>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Bottom" component={BottomTab} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="홈" component={Home} />
            <Stack.Screen name="Notice" component={Notice} />
            <Stack.Screen name="NoticeSettings" component={NoticeSettings} />
            <Stack.Screen name="DoIt1" component={DoIt1} />
            <Stack.Screen name="Signup1" component={Signup1} />
            <Stack.Screen name="Signup2" component={Signup2} />
            <Stack.Screen name="Signup3" component={Signup3} />
            <Stack.Screen name="Signup4" component={Signup4} />
            <Stack.Screen name="Signup5" component={Signup5} />
            <Stack.Screen name="Signup6" component={Signup6} />
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
