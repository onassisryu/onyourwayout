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
import {isLoggedInState, userDataState} from '@/recoil/atoms';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {QueryClient, QueryClientProvider} from 'react-query';

import {ThemeProvider} from '@emotion/react';
import theme from '@/Theme';

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

const App = () => {
  const queryClient = new QueryClient();

  const [isLogin, setIsLogin] = useState(false);

  const user = useRecoilValue(userDataState);
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setUserData = useSetRecoilState(userDataState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);

  const admin = false;
  // useEffect(() => {
  //   getStorage('token').then(token => {
  //     if (token) {
  //       console.log('토큰이 있습니다.', token);
  //       getStorage('user').then(user => {
  //         setIsLogin(true);
  //       });
  //     }
  //   });
  // }, []);
  // FCM 토큰 발급
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
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

  useEffect(() => {
    getFcmToken(); // 토큰 발급
    // 앱이 켜져있을때
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[Remote Message] ', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <NavigationContainer>
          {isLoggedIn ? admin ? <AdminStack /> : <MainStack /> : <LoginStack />}
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
