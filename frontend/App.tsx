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
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import 'moment/locale/ko';

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
  
  PushNotification.createChannel(
    {
      channelId: 'channel-id', // 채널 ID
      channelName: 'My channel', // 채널 이름
      channelDescription: 'A channel to categorise your notifications', // 채널 설명
      soundName: 'default', // 기본 사운드 사용
      importance: 4, // 알림 중요도 설정. 4는 High를 의미함
      vibrate: true, // 진동 설정
    },
    created => console.log(`createChannel returned '${created}'`) // (optional) 채널 생성 성공 여부를 로그에 출력
  );
  
  const sendNotification = (notice: any) => {
    const now = moment();
    const formattedTime = now.format('A hh:mm');
    const message = `${notice.content} (${formattedTime})`;

    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'channel-id',
      /* iOS and Android properties */
      id: notice.id,
      title: notice.title,
      message: message,
      playSound: true,
      soundName: 'default',
    });
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
            <Stack.Screen name="ChatDetail" component={ChatDetail} />
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
