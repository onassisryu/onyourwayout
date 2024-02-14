import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity, Touchable} from 'react-native';
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
const DoItListCardComponent = styled(ScrollView)`
  padding: 10px 20px;
`;

const DoItListButton = styled(GlobalButton)`
  background-color: white;
  border-radius: 0px;
  padding: 10px 0px;
`;

const DoItListCard = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 130px;
`;

const DoItListImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  resize-mode: cover;
`;

const CardTextContainer = styled(GlobalContainer)`
  position: relative;
  flex: 1;
  width: 100%;
  margin-left: 20px;
  flex-direction: column;
  align-items: flex-start;
`;

const ReportButton = styled(GlobalButton)`
  position: absolute;
  background-color: white;
  top: 7px;
  right: 5px;
`;

const TextTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  margin-bottom: 1px;
`;

const TextApart = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 12px;
`;

const TextContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.black};
  padding: 5px 0px 5px 0px;
`;

const TextPrice = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  margin-right: 10px;
  font-weight: bold;
`;

const DistinctLine = styled.View`
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid #efefef;
`;

const CardImageContainer = styled(View)`
  width: 130px;
  height: 100%;
  border-radius: 10px;
  background-color: aliceblue;
`;

interface DealImage {
  // DealImage에 대한 필드를 정의해주세요.
  imgUrl: string;
}
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
  const type = route.params.type;
  const url = `deal/user/list?type=${type}`;

  function acceptDoit(id: number) {
    axiosAuth
      .put(`deal/accept/${id}`)
      .then(resp => {
        console.log('성공', resp.data);
        // 데이터 업데이트 후 useEffect 다시 실행
        loadData();
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }

  const loadData = () => {
    axiosAuth
      .get(url)
      .then(resp => {
        setResponseData(resp.data);
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  };
  const currentTime = new Date();
  const expireTime = new Date();
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
  useEffect(() => {
    loadData();
  }, []);
  return (
    <View
      style={css`
        width: 100%;
        height: 100%;
      `}>
      <Header>
        <GoBack />
      </Header>
      <View
        style={css`
          margin-left: 10px;
          margin-right: 10px;
          height: 90%;
        `}>
        <ScrollView overScrollMode="never">
          {responseData.map((card, index) => (
            <View key={index}>
              <DoItListButton onPress={() => navigation.navigate('DoItListDetail', {id: card.id})}>
                <DoItListCard>
                  <CardImageContainer>
                    {card.dealImages.length > 0 && <DoItListImage src={card.dealImages[0].imgUrl} />}
                  </CardImageContainer>

                  <CardTextContainer>
                    <View
                      style={css`
                        flex: 1;
                        margin-top: 10px;
                      `}>
                      <TextTitle numberOfLines={1}>{card.title}</TextTitle>

                      <TextApart>{calculateTimeAgo(card.createdAt)}</TextApart>
                    </View>
                    <View
                      style={css`
                        width: 100%;
                        flex-direction: row;
                        justify-content: space-between;
                        margin-top: 10px;
                      `}>
                      {card.dealStatus === 'OPEN' && currentTime < new Date(card.expireAt) && <Text>[대기 중]</Text>}
                      {card.dealStatus === 'OPEN' && currentTime > new Date(card.expireAt) && <Text>[시간만료]</Text>}
                      {card.dealStatus === 'ING' && <Text>[진행 중]</Text>}
                      {card.dealStatus === 'CLOSE' && <Text>[완료]</Text>}
                      <TextPrice>
                        {' '}
                        {card.rewardType === 'CASH'
                          ? `${card.cash.toLocaleString()}원`
                          : card.rewardType === 'ITEM'
                          ? card.item
                          : 'Unknown Reward Type'}
                      </TextPrice>
                    </View>
                  </CardTextContainer>
                </DoItListCard>
              </DoItListButton>
              <DistinctLine />
              {type === 'accept' && (
                <TouchableOpacity
                  onPress={() => {
                    acceptDoit(card.id);
                  }}>
                  <Text>파토내기</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default GoOut2;
