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
import styled, {css} from '@emotion/native';
import {AppState} from 'react-native';

//recoil&react-query
import {isLoggedInState, userDataState, apartDataState, fcmTokenState} from '@/recoil/atoms';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {QueryClient, QueryClientProvider} from 'react-query';

import {ThemeProvider} from '@emotion/react';

import theme from '@/Theme';
import ProgressBarComponent from '@/components/ProgressBarComponent';
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
import {get} from 'axios';
const Scorebarbackground = styled.View`
  height: 15px;
  width: 100%;
  border-radius: 10px;
  background-color: #eaeaea;
  position: relative;
`;
const Scorebar = styled.View`
  height: 15px;
  border-radius: 10px;
  background-color: ${theme.color.primary};
  position: absolute;
`;

interface Notice {
  id: string;
  title: string | undefined;
  body: string | undefined;
}
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
        setModalVisible(false);
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
        setModalVisible(false);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }

  const CustomAlert: FC<CustomAlertProps> = ({
    visible,
    title,
    onClose,
    dealId,
    acceptId,
    nickname,
    dong,
    memberScore,
    time,
  }) => {
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
              height: 55%;
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
                margin-bottom: 20px;
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
              `}>
              <View
                style={css`
                  flex-direction: row;
                  align-items: center;
                  height: 100%;
                `}>
                <View
                  style={css`
                    height: 100px;
                    width: 40%;
                    border-radius: 100px;
                    margin: 10px;
                    background-color: ${theme.color.gray100};
                  `}></View>
                <View
                  style={css`
                    width: 50%;
                  `}>
                  <Text
                    style={css`
                      font-size: 20px;
                      font-weight: 700;
                    `}>
                    {nickname}
                  </Text>
                  <Text
                    style={css`
                      font-size: 15px;
                      font-weight: 700;
                      color: ${theme.color.gray300};
                      margin-bottom: 10px;
                    `}>
                    {dong}동
                  </Text>
                  <Text>이웃지수</Text>
                  <View
                    style={css`
                      width: 100%;
                      margin-top: 5px;
                    `}>
                    <Scorebarbackground>
                      <Scorebar
                        style={css`
                          width: ${memberScore}%;
                        `}></Scorebar>
                    </Scorebarbackground>
                  </View>
                </View>
              </View>
            </View>
            {/* 상대방 정보 카드 */}
            <ProgressBarComponent dealId={dealId} acceptId={acceptId} setModalVisible={setModalVisible} />

            {/* 타이머 */}
            <View
              style={css`
                flex-direction: row;
                justify-content: space-between;
                width: 90%;
              `}>
              <TouchableOpacity
                onPress={() => acceptGoOut(dealId, acceptId)}
                style={css`
                  width: 47%;
                  height: 50px;
                  background-color: ${theme.color.primary};
                  justify-content: center;
                  align-items: center;
                  border-radius: 10px;
                `}>
                <Text
                  style={css`
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                  `}>
                  수락하기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => cancelGoOut(dealId, acceptId)}
                style={css`
                  width: 47%;
                  height: 50px;
                  background-color: ${theme.color.gray};
                  justify-content: center;
                  align-items: center;
                  border-radius: 10px;
                `}>
                <Text
                  style={css`
                    color: white;
                    font-size: 20px;
                    font-weight: 700;
                  `}>
                  거절하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const checkLogin = async () => {
    console.log('데이터 세팅중이여!!!!!!!!');
    getStorage('token').then(token => {
      if (token) {
        console.log('토큰이 있습니다.', token);
        getStorage('user').then(user => {
          setUserData(user);
          getStorage('adjDongs').then(adjDongs => {
            setApartData(adjDongs);
            setIsLoggedIn(true);
          });
        });
      }
    });

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
  }, []);

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

      console.log('data', data);
      if (remoteMessage.notification?.title === '[나가요잉 신청]') {
        setData(remoteMessage.data);
        setModalVisible(true);
      }
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
            nickname={data.acceptMemberNickname}
            dong={data.acceptMemberDong}
            memberScore={data.acceptMemberScore}
            acceptId={data.acceptMemberId}
            dealId={data.dealId}
            time={minuteTimer}
          />
          {admin ? <AdminStack /> : <MainStack />}
        </NavigationContainer>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
