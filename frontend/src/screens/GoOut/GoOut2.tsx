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
import {RadialGradient, LinearGradient} from 'react-native-gradients';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {modalState} from '@/recoil/atoms';
import Modal from 'react-native-modal';
import ProgressBarComponent from '@/components/ProgressBarComponent';

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
  height: 100%;
`;
const dotsContainerStyle = css`
  width: 100%;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  top: 80%;
`;
const dealTypeToCategory = (dealType: string) => {
  switch (dealType) {
    case 'PET':
      return '반려동물 산책';
    case 'SHOP':
      return '장보기';
    case 'RECYCLE':
      return '분리수거';
    case 'ETC':
      return '기타';
    default:
      return '';
  }
};
const GoOut2 = ({route, navigation}: any) => {
  const [responseData, setResponseData] = useState([]);
  const setModalStatus = useSetRecoilState(modalState);
  const selectedTitles: string[] = route.params.selectedButton
    .filter((button: {status: boolean; title: string}) => button.status === true)
    .map((button: {status: boolean; title: string}) => button.title);
  console.log('selectedTitles', selectedTitles);
  const queryString = selectedTitles.map(title => `dealType=${title}`).join('&');
  const [isModalVisible, setModalVisible] = useState(false);
  const isModalState = useRecoilValue(modalState);

  useEffect(() => {
    if (isModalState) {
      navigation.navigate('Main');
    }
  }, [isModalState]);
  useEffect(() => {
    console.log('queryString', queryString);
    axiosAuth
      .get(`deal/out-recommend?${queryString}`)
      .then(resp => {
        console.log(resp);
        setResponseData(resp.data);

        console.log('성공', resp.data);
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
        setModalVisible(true);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }
  const colorList = [
    {offset: '0%', color: 'black', opacity: '0'},
    {offset: '100%', color: 'black', opacity: '0.5'},
  ];
  const CustomAlert = ({visible}: any) => {
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
              height: 200px;
              align-items: center;
            `}>
            <View
              style={css`
                height: 20%;
                width: 100%;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
              `}>
              <Text
                style={css`
                  font-size: 20px;
                  font-weight: 700;
                `}>
                매칭을 진행중입니다.
              </Text>
            </View>
            <ProgressBarComponent dealId="Ff" acceptId="ff" setModalVisible={setModalVisible} />
            <View
              style={css`
                flex-direction: row;
                justify-content: space-between;
                width: 90%;
              `}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('Main');
                }}
                style={css`
                  width: 100%;
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
                  취소하기
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  return (
    <View
      style={css`
        height: 100%;
      `}>
      <CarouselContainer>
        <Carousel dotStyle={dotStyle} activeDotStyle={activeDotStyle} dotsContainerStyle={dotsContainerStyle}>
          {responseData.map((card: any, index: number) => (
            <View
              style={css`
                height: 100%;
                position: relative;
                z-index: 100;
                background-color: red;
              `}
              key={index}>
              <View
                style={css`
                  width: 100%;
                  height: 300px;
                  position: absolute;
                  top: 55%;
                  z-index: 1;
                `}>
                <LinearGradient colorList={colorList} angle={270} />
              </View>
              <View
                style={css`
                  width: 100%;
                  height: 150px;
                  position: absolute;
                  top: 65%;
                  z-index: 1;
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
                <View
                  style={css`
                    flex-direction: row;
                    justify-content: space-between;
                  `}>
                  <Text
                    style={css`
                      color: white;
                      font-size: 20px;
                      font-weight: 700;
                    `}>
                    {dealTypeToCategory(card.dealType)}
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
                </View>
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
              {/* <TouchableOpacity
                onPress={() => {
                  sendGoOutRequest(card.id);
                }}
                style={css`
                  height: 20%;
                  width: 100%;
                  position: absolute;
                  bottom: 0;
                  background-color: transparent;
                  z-index: 1000;
                `}></TouchableOpacity> */}
              <View
                style={css`
                  position: absolute;
                  bottom: 3%;
                  height: 15%;
                  width: 100%;
                  justify-content: center;
                  align-items: center;
                  background-color: white;
                  z-index: 100;
                `}>
                <TouchableOpacity
                  onPress={() => {
                    sendGoOutRequest(card.id);
                  }}
                  style={css`
                    height: 50%;
                    width: 90%;
                    border-radius: 10px;
                    background-color: ${theme.color.primary};
                    z-index: 10;
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
          ))}
        </Carousel>
      </CarouselContainer>
      <CustomAlert visible={isModalVisible} />
      {/* <View
        style={css`
          position: absolute;
          bottom: 0;
          height: 15%;
          width: 100%;
          justify-content: center;
          align-items: center;
          background-color: white;
        `}>
        <TouchableOpacity
          style={css`
            height: 50%;
            width: 90%;
            border-radius: 10px;
            background-color: ${theme.color.primary};
            z-index: 10;
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
      </View> */}
    </View>
  );
};

export default GoOut2;
