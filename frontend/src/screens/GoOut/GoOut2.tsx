import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
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

const Container = styled(GlobalContainer)``;

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

type DoItListDetailRouteProp = RouteProp<RootStackParamList, 'DoItListDetail'>;

interface Props {
  route: DoItListDetailRouteProp;
  navigation: NavigationProp<any>;
  // 필요하다면 다른 props들도 추가할 수 있습니다.
}

const dealTypeTextMap = {
  PET: '애완동물 산책',
  RECYCLE: '분리수거',
  SHOP: '장보기',
  ETC: '기타',
};

const dealTypeTextMapReverse = {
  '애완동물 산책': 'PET',
  '분리수거': 'RECYCLE',
  '장보기': 'SHOP',
  '기타': 'ETC',
};

const GoOut2 = ({route, navigation}: any) => {
  const [responseData, setResponseData] = useState([]);
  const selectedTitles: string[] = route.params.selectedButton
    .filter((button: {status: boolean; title: string}) => button.status === true)
    .map((button: {status: boolean; title: string}) => button.title);
  console.log('selectedTitles', selectedTitles);
  const queryString = selectedTitles.map(title => `dealType=${title}`).join('&');
  const url = `deal/out-recommend?${queryString}`;

  useEffect(() => {
    axiosAuth
      .get(url)
      .then(resp => {
        setResponseData(resp.data);
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  function sendGoOutRequest(dealid: number) {
    axiosAuth
      .get(`deal/out-recommend/${dealid}`)
      .then(resp => {
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }
  return (
    <View
      style={css`
        width: 100%;
        height: 100%;
      `}>
      <ScrollView>
        {responseData.map((card, index) => (
          <View
            key={index}
            style={css`
              border: 1px solid black;
            `}>
            <Text>{card.title}</Text>
            <Text>{card.content}</Text>
            <Text>{card.id}</Text>
            <TouchableOpacity
              onPress={() => {
                sendGoOutRequest(card.id);
              }}>
              <Text>수락하기</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default GoOut2;
