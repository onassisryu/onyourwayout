/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, FC} from 'react';
import {Alert, TouchableOpacity} from 'react-native';
import {StatusBar} from 'react-native';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {Text, View, Button} from 'react-native';
import {css} from '@emotion/native';

//recoil&react-query
import {isLoggedInState, userDataState, apartDataState, fcmTokenState} from '@/recoil/atoms';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {QueryClient, QueryClientProvider} from 'react-query';

import {ThemeProvider} from '@emotion/react';
import theme from '@/Theme';

import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import 'moment/locale/ko';
import Modal from 'react-native-modal';
import {Platform, PermissionsAndroid} from 'react-native';

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

import {getStorage, setStorage} from '@/storage/common_storage';
import axiosAuth from '@/axios/axiosAuth';

interface Notice {
  id: string;
  title: string | undefined;
  body: string | undefined;
}

const App = () => {
  const queryClient = new QueryClient();

  const [admin, setAdmin] = useState(false);
  const userData = useRecoilValue(userDataState);

  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setUserData = useSetRecoilState(userDataState);
  const setApartData = useSetRecoilState(apartDataState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setFcmTokenState = useSetRecoilState(fcmTokenState);
  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }
  useEffect(() => {
    console.log('지도 인증할게요');
    requestPermissions();
  }, []);

  // FCM 토큰 발급
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    setFcmTokenState({fcmToken});
    console.log('[FCM Token] ', fcmToken);
  };

  interface CustomAlertProps {
    visible: boolean;
    title: string;
    onClose: () => void;
    dealId: string;
    acceptId: string;
  }

  function acceptGoOut(dealId: string, acceptId: string) {
    axiosAuth
      .put(`deal/out-recommend/${dealId}/${acceptId}`)
      .then(resp => {
        console.log('나가요잉 매칭 성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }
  const CustomAlert: FC<CustomAlertProps> = ({visible, title, onClose, dealId, acceptId}) => {
    return (
      <Modal isVisible={visible}>
        <View
          style={css`
            flex: 1;
            justify-content: center;
            align-items: center;
          `}>
          <View
            style={css`
              background-color: white;
              padding: 20px;
              border-radius: 10px;
              width: 95%;
              height: 50%;
              align-items: center;
            `}>
            <Text
              style={css`
                font-size: 20px;
                font-weight: 700;
                margin-bottom: 5px;
              `}>
              [{title}]
            </Text>
            <Text
              style={css`
                font-size: 17px;
                margin-bottom: 10px;
                color: gray;
              `}>
              매칭을 기다리고 있습니다
            </Text>
            <View
              style={css`
                width: 80%;
                height: 150px;
                border: 1px solid gray;
                border-radius: 10px;
                margin-bottom: 20px;
              `}></View>
            {/* 상대방 정보 카드 */}
            <View
              style={css`
                height: 30px;
                width: 80%;
                background-color: green;
                margin-bottom: 20px;
              `}></View>
            {/* 타이머 */}
            <View
              style={css`
                flex-direction: row;
                justify-content: space-between;
                width: 80%;
              `}>
              <TouchableOpacity
                onPress={() => acceptGoOut(dealId, acceptId)}
                style={css`
                  width: 45%;
                  background-color: green;
                `}>
                <Text>수락하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                style={css`
                  width: 45%;
                  background-color: green;
                `}>
                <Text>거절하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
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

  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<{[key: string]: string | object}>({});

  const handleCloseModal = () => {
    setModalVisible(false); // 모달을 닫습니다.
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
      setData(remoteMessage.data);
      console.log('data', data);
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
          <CustomAlert
            visible={isModalVisible}
            onClose={handleCloseModal}
            title={data.title}
            acceptId={data.acceptMemberId}
            dealId={data.dealId}
          />
          {admin ? <AdminStack /> : <MainStack />}
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
