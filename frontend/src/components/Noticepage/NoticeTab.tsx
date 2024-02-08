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

const NoticeTab = () => {
  const [selectedTab, setSelectedTab] = useState('새소식');
  const [currentTime, setCurrentTime] = useState(moment());

  // 테스트
  const notificationTime = new Date('2024-01-29T7:32:00');

  // 알림 카드 테스트
  const [notices, setNotices] = useState([
    {id: 1, title: '[나가요잉]', content: '응응 뿡뿡뿡까까ㅃ까ㅃㅉㅇ롸ㅃㅇ롸ㅃㅉㅇ롸ㅃㅉ오라ㅃ쪼아라로빠쫑ㄹ짜ㅗㄹ'},
    {id: 2, title: '[두번째 알림]', content: '두번째 알림 내용...'},
    {id: 3, title: '[세번째 알림]', content: '세번째 알림 내용...'},
    {id: 4, title: '[세번째 알림]', content: '세번째 알림 내용...'},
    {id: 5, title: '[세번째 알림]', content: '세번째 알림 내용...'},
    {id: 6, title: '[세번째 알림]', content: '세번째 알림 내용...'},
  ]);

  // X 누르면 삭제
  const deleteNotice = (id: number) => {
    setNotices(notices.filter(notice => notice.id !== id));
  };

  useEffect(() => {
    // 1분마다 화면을 갱신
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 60000);

    // 컴포넌트가 언마운트될 때 interval을 정리
    return () => {
      clearInterval(interval);
    };
  }, []);

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

export default NoticeTab;
