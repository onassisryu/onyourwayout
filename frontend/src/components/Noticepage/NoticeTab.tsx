// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import moment from 'moment';
import 'moment/locale/ko';
import {GlobalContainer} from '@/GlobalStyles';
import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {GlobalText} from '@/GlobalStyles';
import PushNotification from 'react-native-push-notification';
import axiosAuth from '@/axios/axiosAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  height: 30px;
`;

const Tab = styled.TouchableOpacity<{selected: boolean}>`
  align-items: center;
  width: 50%;
  border-bottom-width: 2.5px;
  border-bottom-color: ${({selected}) => (selected ? '#00D282' : '#d2d2d2')};
`;

const TabText = styled(GlobalText)<{selected: boolean}>`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: 900;
`;

const NoticeCard = styled.View`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 20px;
`;

const CardHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CardTitle = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: 900;
  margin-bottom: 15px;
`;

const CardContent = styled(GlobalText)`
  font-size: ${theme.fontSize.small};
  color: ${theme.color.black};
  font-weight: 900;
  margin-bottom: 20px;
`;

const XImage = styled.Image`
  width: 15px;
  height: 15px;
  resize-mode: contain;
  margin-right: 5px;
  margin-top: 5px;
`;

const NoticeTime = styled(GlobalText)`
  font-size: ${theme.fontSize.small};
  color: #727272;
  font-weight: 900;
  margin-bottom: 20px;
`;

const DistinctLine = styled.View`
  width: 100%;
  border: 1px solid #b2b2b2;
`;

const xImage: ImageSourcePropType = require('icons/x.png');

// 알림 채널 생성
PushNotification.createChannel(
  {
    channelId: "channel-id", // 채널 ID
    channelName: "My channel", // 채널 이름
    channelDescription: "A channel to categorise your notifications", // 채널 설명
    soundName: "default", // 기본 사운드 사용
    importance: 4, // 알림 중요도 설정. 4는 High를 의미함
    vibrate: true, // 진동 설정
  },
  (created) => console.log(`createChannel returned '${created}'`) // (optional) 채널 생성 성공 여부를 로그에 출력
);

const sendNotification = (notice: any) => {

  const now = moment();
  const formattedTime = now.format('A hh:mm');
  const message = `${notice.content} (${formattedTime})`

  PushNotification.localNotification({
  /* Android Only Properties */
    channelId: "channel-id", // 위에서 생성한 채널 ID를 지정
    /* iOS and Android properties */
    id: notice.id,
    title: notice.title,
    message: message,
    playSound: true,
    soundName: 'default',
  });
};

const NoticeTab = () => {
  const [selectedTab, setSelectedTab] = useState('새소식');
  const [currentTime, setCurrentTime] = useState(moment());

  // 테스트
  const notificationTime = new Date('2024-01-29T7:32:00');

  // 알림 카드 테스트
  const [notices, setNotices] = useState([
    {id: 1, title: '[나가요잉]', content: '응응 뿡뿡뿡ㅃㅉ오라ㅃ쪼아라로빠쫑ㄹ짜ㅗㄹ'},
    {id: 2, title: '[나가요잉]', content: '응응 뿡뿡뿡까까ㅃ까ㅃㅉㅇ롸ㅃㅇ롸ㅃㅉㅇ롸ㅃㅉ오라ㅃ쪼아라로빠쫑ㄹ짜ㅗㄹ'}
  ]);


  // X 누르면 삭제
  const deleteNotice = (id: number) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  useEffect(() => {
    // 앱이 시작될 때 각 알림에 대해 푸시 알림을 보냅니다.
    notices.forEach(sendNotification);

    // 1분마다 화면을 갱신
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    // 컴포넌트가 언마운트될 때 interval을 정리
    return () => {
      clearInterval(interval);
    };
  }, [notices]);

  return (
    <GlobalContainer>
      <TabContainer>
        <Tab selected={selectedTab === '새소식'} onPress={() => setSelectedTab('새소식')}>
          <TabText selected={selectedTab === '새소식'}>새소식</TabText>
        </Tab>
        <Tab selected={selectedTab === '키워드 알림'} onPress={() => setSelectedTab('키워드 알림')}>
          <TabText selected={selectedTab === '키워드 알림'}>키워드 알림</TabText>
        </Tab>
      </TabContainer>

      {notices.map(notice => (
        <NoticeCard key={notice.id}>
          <CardHeader>
            <CardTitle> {notice.title} </CardTitle>
            <TouchableOpacity onPress={() => deleteNotice(notice.id)}>
              <XImage source={xImage}></XImage>
            </TouchableOpacity>
          </CardHeader>
          <CardContent>{notice.content}</CardContent>
          <NoticeTime>{moment.duration(currentTime.diff(notificationTime)).humanize() + ' 전'}</NoticeTime>
          <DistinctLine></DistinctLine>
        </NoticeCard>
      ))}
    </GlobalContainer>
  );
};

export default {NoticeTab, sendNotification};