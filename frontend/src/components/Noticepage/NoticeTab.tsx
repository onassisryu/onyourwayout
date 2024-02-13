// import 내용
import React, {useState, useEffect} from 'react';
import styled, {css} from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import moment from 'moment';
import 'moment/locale/ko';
import {GlobalContainer} from '@/GlobalStyles';
import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {GlobalText} from '@/GlobalStyles';
import SvgIcon from '@components/SvgIcon';
import PushNotification from 'react-native-push-notification';
import axiosAuth from '@/axios/axiosAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TabContainer = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-around;
  height: 35px;
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

const NoticeCard = styled(GlobalContainer)`
  width: 85%;
  height: initial;
  margin-left: 30px;

  margin-top: 20px;
`;

const CardHeader = styled(GlobalContainer)`
  height: initial;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CardTitle = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: 900;

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
  background-color: #b2b2b2;
`;

const xImage: ImageSourcePropType = require('icons/x.png');


const NoticeTab = () => {
  const [selectedTab, setSelectedTab] = useState('새소식');
  const [currentTime, setCurrentTime] = useState(moment());

  // 테스트
  const notificationTime = new Date('2024-01-29T7:32:00');

  // 알림 카드 테스트
  const [notices, setNotices] = useState([
    {id: 1, category: 'PET', title: '[나가요잉]', content: '응응 뿡뿡뿡ㅃㅉ오라ㅃ쪼아라로빠쫑ㄹ짜ㅗㄹ'},
    {id: 2, category: 'SHOP', title: '[나가요잉]', content: '응응 뿡뿡뿡까까ㅃ까ㅃㅉㅇ롸ㅃㅇ롸ㅃㅉㅇ롸ㅃㅉ오라ㅃ쪼아라로빠쫑ㄹ짜ㅗㄹ'},
    {id: 3, category: 'RECYCLE', title: '[나가요잉]', content: '응응 뿡뿡뿡까까ㅃ까ㅃㅉㅇ롸ㅃㅇ롸ㅃㅉㅇ롸ㅃㅉ오라ㅃ쪼아라로빠쫑ㄹ짜ㅗㄹ'},
  ]);

  const categoryToDealType = (category: string) => {
    switch (category) {
      case '반려동물 산책':
        return 'PET';
      case '심부름':
        return 'SHOP';
      case '분리수거':
        return 'RECYCLE';
      case '기타':
        return 'ETC';
      default:
        return '';
    }
  };

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
           
            <View style={css`flex-direction: row; align-items: center;`}>
              {notice.category === 'PET' && <SvgIcon name="puppy" size={30} />}
              {notice.category === 'RECYCLE' && <SvgIcon name="shopping" size={30} />}
              {notice.category === 'SHOP' && <SvgIcon name="bags" size={30}/>}
              {notice.category === 'ETC' && <SvgIcon name="building" size={30} />}
              <CardTitle>  {notice.title}</CardTitle>
            </View>
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
