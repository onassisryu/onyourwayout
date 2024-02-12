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
import {isLoggedInState, userDataState, apartDataState, fcmTokenState} from '@/recoil/atoms';
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

// import {NoticeTab, sendNotification} from '@/components/Noticepage/NoticeTab';

import {getStorage, setStorage} from '@/storage/common_storage';

const App = () => {
  const queryClient = new QueryClient();

  const [admin, setAdmin] = useState(false);
  const userData = useRecoilValue(userDataState);

  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setUserData = useSetRecoilState(userDataState);
  const setApartData = useSetRecoilState(apartDataState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setFcmTokenState = useSetRecoilState(fcmTokenState);

  // FCM 토큰 발급
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    setFcmTokenState({fcmToken});
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

  const checkLogin = async () => {
    if (isLoggedIn) {
      console.log('로그인 상태입니다.======> 페이지 이동', isLoggedIn);
      if (userData.roles == 'ADMIN') {
        setAdmin(true);
      }
    } else {
      getStorage('token').then(token => {
        console.log(token);
        if (token) {
          console.log('토큰이 있습니다.', token);
          getStorage('user').then(user => {
            setUserData(user);
            setIsLoggedIn(true);
            getStorage('adjDongs').then(adjDongs => {
              setApartData(adjDongs);
            });
          });
        }
      });
    }
  };
  useEffect(() => {
    checkLogin();
  }, [isLoggedIn]);

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
