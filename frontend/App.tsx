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
import ChatMain from '@screens/Chating/ChatMain';
import ChatDetail from '@screens/Chating/ChatDetail';
import Apart from '@screens/Apart';
import My from '@screens/My';
import MySetting from '@screens/MySetting';
import Login from '@screens/Login';
import Notice from '@screens/Notice';
import NoticeSettings from '@screens/NoticeSettings';
import DoIt1 from '@/screens/DoIt/DoIt1';
import DoIt2 from '@/screens/DoIt/DoIt2';
import Signup0 from '@/screens/Signup/Signup0';
import Signup1 from '@/screens/Signup/Signup1';
import Signup2 from '@/screens/Signup/Signup2';
import Signup3 from '@/screens/Signup/Signup3';
import Signup4 from '@/screens/Signup/Signup4';
import Signup5 from '@/screens/Signup/Signup5';
import Signup5a from '@/screens/Signup/Signup5a';
import Signup6 from '@/screens/Signup/Signup6';
import GoOut1 from '@/screens/GoOut/GoOut1';
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
        <Tab.Screen name="아파트" component={Apart} />
        <Tab.Screen name="채팅" component={ChatMain} />
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
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Notice" component={Notice} />
            <Stack.Screen name="NoticeSettings" component={NoticeSettings} />
            <Stack.Screen name="GoOut1" component={GoOut1} />
            <Stack.Screen name="DoIt1" component={DoIt1} />
            <Stack.Screen name="DoIt2" component={DoIt2} />
            <Stack.Screen name="Signup0" component={Signup0} />
            <Stack.Screen name="Signup1" component={Signup1} />
            <Stack.Screen name="Signup2" component={Signup2} />
            <Stack.Screen name="Signup3" component={Signup3} />
            <Stack.Screen name="Signup4" component={Signup4} />
            <Stack.Screen name="Signup5" component={Signup5} />
            <Stack.Screen name="Signup5a" component={Signup5a} />
            <Stack.Screen name="Signup6" component={Signup6} />
            <Stack.Screen name="ChatDetail" component={ChatDetail} />
            <Stack.Screen name="MySetting" component={MySetting} />
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
