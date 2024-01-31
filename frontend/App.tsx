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
import {RecoilRoot} from 'recoil';
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
import Notice from '@screens/Notice';
import NoticeSettings from '@screens/NoticeSettings';

//icon
import Ionic from 'react-native-vector-icons/Ionicons';

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const queryClient = new QueryClient();

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
          tabBarActiveTintColor: '#27D894',
          tabBarLabelStyle: {
            fontWeight: 'bold',
          },
          tabBarIcon: ({focused, size, color}) => {
            let iconName!: string;
            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Location') {
              iconName = focused ? 'search' : 'ios-search-outline';
            } else if (route.name === 'Apart') {
              iconName = focused ? 'caret-forward-circle' : 'caret-forward-circle-outline';
            } else if (route.name === 'Chat') {
              iconName = focused ? 'ios-heart' : 'ios-heart-outline';
            } else if (route.name === 'My') {
              iconName = focused ? 'ios-person-circle' : 'ios-person-outline';
            }

            return <Ionic name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="위치" component={Location} />
        <Tab.Screen name="아파트" component={Apart} />
        <Tab.Screen name="채팅" component={Chat} />
        <Tab.Screen name="내정보" component={My} />
      </Tab.Navigator>
    );
  };
  return (
    <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <ThemeProvider theme={theme}>
              <Stack.Navigator screenOptions={{headerShown: false}}> 
                <Stack.Screen name="Bottom" component={BottomTab} />
                <Stack.Screen name="Notice" component={Notice} />
                <Stack.Screen name="NoticeSettings" component={NoticeSettings} />
              </Stack.Navigator>
            </ThemeProvider>
          </NavigationContainer>
        </QueryClientProvider>
      </RecoilRoot>
    </React.StrictMode>
  );
};

export default App;
