import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity, Image} from 'react-native';
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
import Carousel from 'pinar';
import theme from '@/Theme';
import LinearGradient from 'react-native-linear-gradient';

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

const dotStyle = css`
  width: 30%;
  height: 3px;
  margin: 5px;
  background-color: gray;
`;
const activeDotStyle = css`
  width: 30%;
  height: 3px;
  margin: 3px;
  background-color: white;
`;

const CarouselContainer = styled.View`
  height: 85%;
`;

const GoOut2 = ({route, navigation}: any) => {
  const [responseData, setResponseData] = useState([]);
  const selectedTitles: string[] = route.params.selectedButton
    .filter((button: {status: boolean; title: string}) => button.status === true)
    .map((button: {status: boolean; title: string}) => button.title);
  console.log('selectedTitles', selectedTitles);
  const queryString = selectedTitles.map(title => `dealType=${title}`).join('&');

  useEffect(() => {
    console.log('queryString', queryString);
    axiosAuth
      .get(`deal/out-recommend?${queryString}`)
      .then(resp => {
        console.log(resp);
        // setResponseData(resp.data);
        // console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error.response);
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
        flex: 1;
      `}>
      <CarouselContainer>
        <Carousel dotStyle={dotStyle} activeDotStyle={activeDotStyle}>
          {responseData.map((card, index) => (
            <View
              style={css`
                height: 85%;
                position: relative;
              `}
              key={index}>
              <View
                style={css`
                  width: 100%;
                  height: 150px;
                  position: absolute;
                  bottom: 10px;
                  z-index: 1;
                  background-color: rgba(0, 0, 0, 0.1);
                  padding: 10px;
                `}>
                <Text
                  style={css`
                    color: white;
                    font-size: 30px;
                    font-weight: bold;
                  `}>
                  {card.title}
                </Text>
                {card.rewardType === 'CASH' && (
                  <Text
                    style={css`
                      color: white;
                      font-size: 17px;
                    `}>
                    {card.cash.toLocaleString()}원
                  </Text>
                )}
                {card.rewardType === 'ITEM' && (
                  <Text
                    style={css`
                      color: white;
                      font-size: 17px;
                    `}>
                    {card.title}
                  </Text>
                )}
                <TouchableOpacity
                  onPress={() => {
                    sendGoOutRequest(card.id);
                  }}>
                  <Text>수락하기</Text>
                </TouchableOpacity>
              </View>
              {card.dealImages.length > 0 ? (
                <Image
                  style={css`
                    width: 100%;
                    height: 100%;
                    background-color: gray;
                    z-index: 0;
                  `}
                  src={card.dealImages[0].imgUrl}
                />
              ) : (
                <View
                  style={css`
                    width: 100%;
                    height: 100%;
                    background-color: gray;
                    z-index: 0;
                  `}
                />
              )}
            </View>
          ))}
        </Carousel>
      </CarouselContainer>
      <View
        style={css`
          height: 15%;
          width: 100%;
          justify-content: center;
          align-items: center;
        `}>
        <TouchableOpacity
          style={css`
            height: 50%;
            width: 90%;
            border-radius: 10px;
            background-color: ${theme.color.primary};
          `}>
          <View
            style={css`
              height: 100%;
              width: 100%;
              justify-content: center;
              align-items: center;
            `}>
            <Text
              style={css`
                color: white;
                font-size: 25px;
                font-weight: 900;
              `}>
              수락하기
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoOut2;
