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

// import {NoticeTab, sendNotification} from '@/components/Noticepage/NoticeTab';

import {getStorage, setStorage} from '@/storage/common_storage';
import axiosAuth from '@/axios/axiosAuth';

const App = () => {
  const queryClient = new QueryClient();

  const [admin, setAdmin] = useState(false);
  const userData = useRecoilValue(userDataState);
  const [minuteTimer, setMinuteTimer] = useState(60);
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
    nickname: string;
    dong: string;
    memberScore: number;
    time: number;
  }
  const startTimer = () => {
    const timer = setInterval(() => {
      setMinuteTimer(prevTime => prevTime - 1);
    }, 1000);

    // 0초가 되면 타이머 종료
    setTimeout(() => clearInterval(timer), 60000);
  };
  function acceptGoOut(dealId: string, acceptId: string) {
    console.log('dealId', dealId);
    console.log('acceptId', acceptId);
    axiosAuth
      .put(`deal/out-recommend/${dealId}/${acceptId}`)
      .then(resp => {
        console.log('나가요잉 매칭 성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }

  function cancelGoOut(dealId: string, acceptId: string) {
    console.log('dealId', dealId);
    console.log('acceptId', acceptId);
    axiosAuth
      .get(`deal/out-recommend/${dealId}/${acceptId}/cancel`)
      .then(resp => {
        console.log('나가요잉 매칭 실패', resp.data);
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
    // if (userData.roles.includes('ADMIN')) {
    //   console.log('관리자유');
    //   setAdmin(true);
    // }
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<{[key: string]: string | object}>({});

  const handleCloseModal = () => {
    setModalVisible(false); // 모달을 닫습니다.
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
        title: remoteMessage.notification?.title || 'No Title',
        content: remoteMessage.notification?.body || 'No content',
      };
      setData(remoteMessage.data);
      console.log('data', data);
      sendNotification(notice);
      if (remoteMessage.notification.title === '[나가요잉 신청]') {
        setModalVisible(true);
      }
    });
    return unsubscribe;
  }, []);

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
