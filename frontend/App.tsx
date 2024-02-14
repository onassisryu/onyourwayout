/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';

//recoil&react-query
import {isLoggedInState, userDataState, fcmTokenState} from '@/recoil/atoms';
import {useRecoilValue, useSetRecoilState} from 'recoil';
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

//icon
import Ionic from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MainStack from '@/navigations/MainStack';
import AdminStack from '@/navigations/AdminStack';
import LoginStack from '@/navigations/LoginStack';

import {getStorage, setStorage} from '@/storage/common_storage';

interface Notice {
  id: string;
  title: string | undefined;
  body: string | undefined;
}

const App = () => {
  const queryClient = new QueryClient();

  const [isLogin, setIsLogin] = useState(false);
  const userData = useRecoilValue(userDataState);

  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setUserData = useSetRecoilState(userDataState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setFcmTokenState = useSetRecoilState(fcmTokenState);
  const admin = false;

  // FCM 토큰 발급
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    setFcmTokenState({fcmToken});
    console.log('[FCM Token] ', fcmToken);
  };
  
  const checkLogin = async () => {
    if (isLoggedIn) {
      console.log('로그인 상태입니다.======> 페이지 이동', isLoggedIn);
      if (admin) {
        console.log('관리자입니다.');
      }
    } else {
      getStorage('token').then(token => {
        console.log(token);
        if (token) {
          console.log('토큰이 있습니다.', token);
          getStorage('user').then(user => {
            setUserData(user);
            setIsLoggedIn(true);
          });
        }
      });
    }
  };
  useEffect(() => {
    checkLogin();
  }, [isLoggedIn]);

  PushNotification.createChannel(
    {
      channelId: 'channel-id',
      channelName: 'My channel',
      channelDescription: 'A channel to categorise your notifications',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`createChannel returned '${created}'`)
  );

  const sendNotification = (notice: Notice) => {
    const now = moment();
    const formattedTime = now.format('A hh:mm');
    const message = `${notice.body} (${formattedTime})`;

    PushNotification.localNotification({
      channelId: 'channel-id',
      id: notice.id,
      title: notice.title || '',
      message: message,
      playSound: true,
      soundName: 'default',
    });
  };

  const handleNotification = (remoteMessage: any) => {
    console.log('[Remote Message] ', JSON.stringify(remoteMessage));
    if (remoteMessage.data) {
      const notice: Notice = {
        id: String(remoteMessage.data.notificationId),
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
      };
      sendNotification(notice);
    }
  };

  useEffect(() => {
    getFcmToken();
    const unsubscribe = messaging().onMessage(handleNotification);
    messaging().onNotificationOpenedApp(handleNotification);
    messaging().getInitialNotification().then(handleNotification);

    return unsubscribe;

  }, []);


  
  // 사용 예
 
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" translucent={false} />
        <NavigationContainer>
          {isLoggedIn ? admin ? <AdminStack /> : <MainStack /> : <LoginStack />}
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
