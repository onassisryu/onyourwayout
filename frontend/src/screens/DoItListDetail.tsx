import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import styled, {css} from '@emotion/native';
import EditDeleteModal from '@/components/DoItListDetailModal/EditDeleteModal';
import ReportModal from '@/components/DoItListDetailModal/ReportModal';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-vector-icons/Feather';
import SvgIcon from '@/components/SvgIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GoBack from '@/components/Signup/GoBack';
import axiosAuth from '@/axios/axiosAuth';
import Feather from 'react-native-vector-icons/Feather';
import { getStorage } from '@/storage/common_storage';



const SubContainer = styled(GlobalContainer)`
  margin: 10px;
  margin-right: 20px;
  margin-left: 20px;
`;

const HeaderContainer = styled(Header)`
  width: 100%;
  height: 20px;
`;

const GoBackButton = styled(GlobalButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: transparent;
  margin: 30px 0px 30px 0px;
`;

const ShareButton = styled(GlobalButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  margin: 30px 0px 30px 0px;
`;

const DoItListImage = styled.Image`
  width: 410px;
  height: 450px;
  resize-mode: contain;
`;

const TotalComponent = styled(ScrollView)`
  height: 2000px;
`;

const SubHeader = styled(GlobalContainer)`
  flex-direction: row;
  align-items: center;
  height: 80px;
`;

const ProfileComponent = styled(GlobalContainer)`
  height: initial;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 7px 5px 0px 5px;
`;

const TextNickname = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  padding-bottom: 1px;
`;

const TextApart = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  font-weight: bold;
  padding-bottom: 12px;
`;

const DistinctLine = styled.View`
  width: 100%;
  border: 1px solid #b2b2b2;
`;

const ContentComponent = styled(GlobalContainer)`
  flex-direction: column;
  align-items: flex-start;
`;

const TextTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  padding: 30px 0px 0px 0px;
  font-weight: bold;
`;

const TextCategory = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.gray};
  padding: 10px 0px 0px 0px;
`;

const TextContent = styled(GlobalText)`
  width: 390px;
  line-height: 24px;
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  padding: 25px 0px 0px 0px;
`;

const InfoComponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: initial;
`;

const TextInfo = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  padding: 25px 0px 5px 0px;
`;

const TextPrice = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  font-weight: bold;
`;

const TextReport = styled(GlobalText)`
  margin-top: 10px;
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  padding: 0px 0px 5px 0px;
  text-decoration-line: underline;
`;

const ButtonComponent = styled(GlobalContainer)`
  position: absolute;
  top: 800px;
  display: flex;
  flex-direction: row;
  padding: 10px 20px 10px 20px;
  height: initial;
`;

const LikeButton = styled(GlobalButton)`
  width: 70px;
  height: 60px;
  border: white;
  background-color: ${props => props.theme.color.primary};
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const AgreeButton = styled(GlobalButton)`
  flex-direction: row;
  width: 150px;
  height: 60px;
  border: white;
  background-color: ${props => props.theme.color.primary};
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const ChatButton = styled(GlobalButton)`
  flex-direction: row;
  width: 150px;
  height: 60px;
  border: white;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: ${props => props.theme.color.primary};
`;

const ButtonText = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.white};
  font-weight: bold;
  margin-left: 5px;
  margin-bottom: 4px;
`;

interface DoListCard {
  id: number;
  category: string;
  image: ImageSourcePropType;
  title: string;
  apart: string;
  uptime: string;
  nickname: string;
  content: string;
  price: string;
  remaintime: string;
}

type RootStackParamList = {
  DoItListDetail: {card: DoListCard};
  // 여기서 DoListCard는 카드의 타입입니다.
  // 다른 라우트 이름들도 이곳에 추가해야 합니다.
};

const dealTypeTextMap = {
  PET: '애완동물 산책',
  RECYCLE: '분리수거',
  SHOP: '장보기',
  ETC: '기타',
};


const DoItListDetail = ({route, navigation}: any) => {
  const card = {
    id: 1,
    category: 'PET',
    title: '맛있는 김치를 구해요!',
    apart: '삼성아파트',
    uptime: '1시간 전',
    price: '10,000원',
    nickname: '호구팟',
    content: '나는김치맨김치파워',
  };

  const [userId, setUserId] = useState(null); // 로그인한 사용자의 ID를 저장하는 state
  const [requestUserId, setRequestUserId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 모달의 종류를 저장하는 state

  const param = route.params.card;
  console.log(param)

  const [responseData, setResponseData] = useState({});
  useEffect(() => {
    getStorage('user')
      .then(data => {
        setUserId(data?.id); // 로그인한 사용자의 ID를 state에 저장
        });

    axiosAuth
      .get(`/deal/${param.id}`)
      .then(resp => {
        setResponseData(resp.data);
        setRequestUserId(resp.data.requestId);
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  const handleIconPress = () => {
    if (requestUserId === userId) {
      setModalType('edit'); // 수정, 삭제 가능한 모달
    } else {
      setModalType('report'); // 신고 가능한 모달
    }
    setModalVisible(true); // 모달 열기
  };

  return (
    <View
      style={css`
        position: relative;
        height: 100%;
        width: 100%;
        align-items: center;
        background-color: white;
      `}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
      <View
        style={css`
          position: relative;
          height: 100%;
          width: 100%;
        `}>
        <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
          <View
            style={css`
              height: 1000px;
            `}>
            <View style={{zIndex: -99}}>
              {card.image ? (
                <DoItListImage source={card.image} />
              ) : (
                <View
                  style={css`
                    height: 400px;
                    width: 100%;
                    background-color: gray;
                  `}
                />
              )}
            </View>
            <SubContainer>
              <SubHeader>
                <SvgIcon name="profile" size={40} />
                <ProfileComponent>
                  <TextNickname> {card.nickname}</TextNickname>
                  <TextApart>
                    {' '}
                    {card.apart} / {card.uptime}{' '}
                  </TextApart>
                </ProfileComponent>
              </SubHeader>
              <DistinctLine></DistinctLine>
              <ContentComponent>
                <TextTitle numberOfLines={1}>{responseData.title}</TextTitle>
                <InfoComponent>
                  <TextCategory>{dealTypeTextMap[responseData.dealType]}</TextCategory>
                  {responseData.rewardType === 'CASH' && <TextPrice>{responseData.cash}원</TextPrice>}
                  {responseData.rewardType === 'ITEM' && <TextPrice>{responseData.item}</TextPrice>}
                </InfoComponent>
                <TextContent>{responseData.content}</TextContent>
                <TextReport>게시글 신고하기</TextReport>
              </ContentComponent>
            </SubContainer>
          </View>
        </ScrollView>
      </View>
      <View
        style={css`
          position: absolute;
          height: 60px;
          top: 30px;
          width: 100%;
          background-color: transparent;
          z-index: 1;
        `}>
        <View
          style={css`
            margin-left: 10px;
            margin-right: 5px;
          `}>
          <TouchableOpacity
            style={css`
              flex-direction: row;
              justify-content: space-between;
            `}>
              <Ant
                name="arrowleft"
                size={40}
                color="black"
                onPress={() => navigation.navigate('Bottom', {screen: '아파트'})}
              />
              <Feather
                name="more-vertical"
                size={40}
                onPress={handleIconPress}
              />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={css`
          flex-direction: row;
          position: absolute;
          height: 30px;
          bottom: 60px;
          z-index: 1;
        `}>
        <AgreeButton>
          <FontAwesome name="handshake-o" size={20} color="white"></FontAwesome>
          <ButtonText> 수락하기 </ButtonText>
        </AgreeButton>
        <ChatButton>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="white"></Ionicons>
          <ButtonText> 채팅하기 </ButtonText>
        </ChatButton>
      </View>
      { 
        modalVisible && (
          modalType === 'edit'
          ?  <EditDeleteModal 
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            navigation={navigation}
            data={param}
          />
          : <ReportModal 
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            navigation={navigation}
          />
        )
      }
    
    </View>
    
  );
};

export default DoItListDetail;
