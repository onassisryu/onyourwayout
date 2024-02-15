import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import styled, {css} from '@emotion/native';
import EditDeleteModal from '@/components/DoItListDetailModal/EditDeleteModal';
import ReportModal from '@/components/DoItListDetailModal/ReportModal';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
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
import {getStorage} from '@/storage/common_storage';
import {useRecoilState, useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';

const SubContainer = styled(GlobalContainer)`
  width: 100%;
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

const DoItListImage = styled.ImageBackground`
  height: 400px;
  width: 100%;
  padding: 0;
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
  width: 90%;
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
  align-items: flex-end;
  width: 90%;
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

type ResponseData = {
  id: number;
  title: string;
  dealType: 'PET' | 'RECYCLE' | 'SHOP' | 'ETC';
  rewardType: 'CASH' | 'ITEM';
  cash: number;
  item: string;
  content: string;
  createdAt: string;
  dealStatus: 'OPEN' | 'CLOSED'; // 등등...
};

type UserInfo = {
  id: number;
  nickname: string;
  dongName: string;
  // 등등...
};

const dealTypeTextMap = {
  PET: '애완동물 산책',
  RECYCLE: '분리수거',
  SHOP: '장보기',
  ETC: '기타',
};


const getBackgroundColor = (dealType: string): string => {
  switch (dealType) {
    case 'PET':
      return 'yellow';
    case 'SHOP':
      return 'blue';
    case 'RECYCLE':
      return '#00D282';
    case 'ETC':
      return 'gray';
    default:
      return 'gray'; // 기본값
  }
};

type User = {
  id: number;
  nickname: string;
  username: string;
  score: number;
  dongId: number;
  dongName: string;
};

const DoItListDetail = ({route, navigation}: any) => {
  const [requestUserId, setRequestUserId] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(''); // 모달의 종류를 저장하는 state

  const [responseData, setResponseData] = useState({});
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [detailImage, setDetailImage] = useState([]);
  const loginuser = useRecoilValue(userDataState);

  useEffect(() => {
    console.log('param', route.params.id);
    axiosAuth
      .get(`/deal/${route.params.id}`)
      .then(resp => {
        setResponseData(resp.data);
        setRequestUserId(resp.data.requestId);
        setUserInfo(resp.data.requestInfo);
        setDetailImage(resp.data.dealImages);
        console.log('게시글 상세===================유저', resp.data.requestInfo);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  const handleIconPress = () => {
    if (userInfo?.id === loginuser.id) {
      setModalType('edit'); // 수정, 삭제 가능한 모달
    } else {
      setModalType('report'); // 신고 가능한 모달
    }
    setModalVisible(true); // 모달 열기
  };

  const calculateTimeAgo = (createdAt: string) => {
    const now = new Date(); // 현재 시간
    const created = new Date(createdAt); // createdAt을 Date 객체로 변환
    const diff = now.getTime() - created.getTime(); // 현재 시간과 createdAt 사이의 차이(밀리초)
    const minutesAgo = Math.floor(diff / (1000 * 60)); // 밀리초를 분으로 변환하여 계산
    const hoursAgo = Math.floor(minutesAgo / 60); // 분을 시간으로 변환하여 계산
    const daysAgo = Math.floor(hoursAgo / 24); // 시간을 일로 변환하여 계산

    if (daysAgo > 30) {
      // 30일 이상인 경우 한 달 전을 반환
      const monthsAgo = Math.floor(daysAgo / 30);
      return `${monthsAgo}달 전`;
    } else if (daysAgo > 7) {
      // 7일 이상인 경우 일주일 전을 반환
      const weeksAgo = Math.floor(daysAgo / 7);
      return `${weeksAgo}주일 전`;
    } else if (daysAgo > 0) {
      // 1일 이상인 경우 일수로 반환
      return `${daysAgo}일 전`;
    } else if (hoursAgo > 0) {
      // 1시간 이상인 경우 시간으로 반환
      return `${hoursAgo}시간 전`;
    } else {
      // 1시간 미만인 경우 분으로 반환
      return `${minutesAgo}분 전`;
    }
  };
  function acceptDoit(id: number) {
    console.log(id);
    axiosAuth
      .put(`deal/accept/${id}`)
      .then(resp => {
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }
  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');

      return () => {
        // 페이지를 벗어날 때 StatusBar 설정을 원래대로 복원
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor('white');
      };
    }, [])
  );
  return (
    <View
      style={css`
        position: relative;
        height: 100%;
        width: 100%;
        align-items: center;
        background-color: white;
      `}>
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
              {detailImage.length > 0 ? (
                <DoItListImage src={detailImage[0].imgUrl} />
              ) : (
                <View
                  style={css`
                    height: 400px;
                    width: 100%;
                    background-color: ${getBackgroundColor(responseData.dealType)};
                  `}
                >
                  {responseData.dealType === 'PET' && <SvgIcon name="puppy" size={415} style={css`justify-content: center; align-items: center;`} />}
                  {responseData.dealType === 'SHOP' && <SvgIcon name="shopping" size={400} style={css`justify-content: center; align-items: center;`} />}
                  {responseData.dealType === 'RECYCLE' && <SvgIcon name="bags" size={415} style={css`justify-content: center; align-items: center;`} />}
                  {responseData.dealType === 'ETC' && <SvgIcon name="building" size={415} style={css`justify-content: center; align-items: center;`}/>}
                </View>
              )}
            </View>
            <SubContainer>
              <SubHeader>
                <SvgIcon name="profile" size={40} />
                <ProfileComponent>
                  <TextNickname> {userInfo?.nickname}</TextNickname>
                  <TextApart>
                    {' '}
                    {userInfo?.dongName}동 / {calculateTimeAgo(responseData.createdAt)}
                  </TextApart>
                </ProfileComponent>
              </SubHeader>
              <DistinctLine></DistinctLine>
              <ContentComponent>
                <TextTitle numberOfLines={1}>{responseData.title}</TextTitle>
                <InfoComponent>
                  {responseData.dealType === 'PET' && <SvgIcon name="puppy" size={20} />}
                  {responseData.dealType === 'RECYCLE' && <SvgIcon name="bags" size={23} />}
                  {responseData.dealType === 'SHOP' && <SvgIcon name="shopping" size={20} />}
                  {responseData.dealType === 'ETC' && <SvgIcon name="building" size={20} />}
                  <TextCategory> {dealTypeTextMap[responseData.dealType]}</TextCategory>
                </InfoComponent>
                <InfoComponent
                  style={css`
                    justify-content: flex-end;
                  `}>
                  {responseData.rewardType === 'CASH' && <TextPrice>{responseData.cash.toLocaleString()}원</TextPrice>}
                  {responseData.rewardType === 'ITEM' && <TextPrice>{responseData.item}</TextPrice>}
                </InfoComponent>

                <TextContent>{responseData.content}</TextContent>

                {userInfo?.id === loginuser.id ? (
                  <></>
                ) : (
                  <TouchableOpacity onPress={() => navigation.navigate('Report', {card: responseData})}>
                    <TextReport>게시글 신고하기</TextReport>
                  </TouchableOpacity>
                )}
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
            <GoBack />
            <Feather name="more-vertical" size={40} onPress={handleIconPress} />
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
        {userInfo?.id === loginuser.id ? (
          <View>
            <Text>내 작성글 입니다</Text>
          </View>
        ) : (
          <View
            style={css`
              flex-direction: row;
            `}>
            <AgreeButton
              onPress={() => {
                acceptDoit(responseData.id);
              }}>
              <FontAwesome name="handshake-o" size={20} color="white"></FontAwesome>
              <ButtonText> 수락하기 </ButtonText>
            </AgreeButton>
            <ChatButton onPress={() => navigation.navigate()}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color="white"></Ionicons>
              <ButtonText> 채팅하기 </ButtonText>
            </ChatButton>
          </View>
        )}
      </View>
      {modalVisible &&
        (modalType === 'edit' && responseData.dealStatus === 'OPEN' ? (
          <EditDeleteModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            navigation={navigation}
            data={param}
          />
        ) : (
          <ReportModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            navigation={navigation}
            responseData={responseData}
          />
        ))}
    </View>
  );
};

export default DoItListDetail;
