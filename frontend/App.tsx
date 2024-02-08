/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
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
import {Screens} from '@screens/Screens';
import Main from '@screens/Main';
import Location from '@screens/Location';
import Chat from '@screens/Chat';
import Apart from '@screens/Apart';
import My from '@screens/My';
import {NoticeTab, sendNotification} from '@/components/Noticepage/NoticeTab';
import DoItList from '@/screens/DoItList';

//icon
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const queryClient = new QueryClient();
  const isLoggedIn = useRecoilValue(isLoggedInState);
  console.log('App Loading....');
  // 토큰 발급
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('[FCM Token] ', fcmToken);
  };

  useEffect(() => {
    getFcmToken(); // 토큰 발급
    // 앱이 켜져있을때
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[Remote Message] ', JSON.stringify(remoteMessage));
      // 메시지 오면 띄우는 코드
      const notice = {
        id: remoteMessage.messageId,
        title: remoteMessage.notification?.title,
        content: remoteMessage.notification?.body,
      };
      sendNotification(notice);
    });
    return unsubscribe;
  }, []);

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
        <Tab.Screen name="채팅" component={Chat} />
        <Tab.Screen name="내정보" component={My} />
      </Tab.Navigator>
    );
  };
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <ThemeProvider theme={theme}>
          <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
          <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Bottom" component={BottomTab} />

            {Screens.map(screen => (
              <Stack.Screen key={screen.name} name={screen.name} component={screen.component} />
            ))}
          </Stack.Navigator>
        </ThemeProvider>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;
