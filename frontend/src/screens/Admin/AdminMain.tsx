import React, {useEffect} from 'react';
import {Animated, Text, TouchableOpacity, View} from 'react-native';

import {isLoggedInState} from '@/recoil/atoms';
import styled, {css} from '@emotion/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {useRecoilValue} from 'recoil';

import {GlobalButton, GlobalText} from '@/GlobalStyles';
import {logoutUser} from '@/utils/common';

// 배경
// background-color: #00d282;
const NotificationBar = styled.View`
  background-color: white;
  flex-direction: row;
  align-items: center;
  padding: 0 30px;

  justify-content: space-between;
  width: 100vw;
  height: 100px;
`;

const NotificationBottom = styled.View`
  background-color: #d9d9d9;
  width: 100%;
  height: 90%;
  align-items: center;
  justify-content: center;
  padding: 25px;
`;

const Card = styled.View`
  width: 100%;
  align-items: center;
  background-color: white;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid #bbbbbb;
`;

const CardComponent = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CardText = styled.Text`
  color: #000000;
  width: 180px;
  font-size: 28px;
`;

const CardImage1 = styled.Image`
  width: 80px;
  height: 130px;
  resize-mode: contain;
`;

const AnimatedCard = Animated.createAnimatedComponent(Card);

const Card1 = styled(AnimatedCard)`
  margin-bottom: 20px;
`;

interface AdminWorkCardProps {
  navigation: any;
  navigateTo: any;
  textBold: string;
  text: string;
  imageSource: string;
}

const AdminWorkCard = ({navigation, navigateTo, textBold, text, imageSource}: AdminWorkCardProps) => {
  return (
    <Card1>
      <TouchableOpacity onPress={() => navigation.navigate(navigateTo)}>
        <CardComponent
          style={css`
            text-align: center;
            align-items: center;
            justify-content: center;
          `}>
          <View>
            <CardText style={{fontWeight: 'bold'}}>{textBold} </CardText>
            <CardText>{text}</CardText>
          </View>
          <CardImage1 src={imageSource} />
        </CardComponent>
      </TouchableOpacity>
    </Card1>
  );
};

// 나온김에 로고 이미지
const StyledText = styled(GlobalText)`
  font-family: ${props => props.theme.font.clover};
  color: ${props => props.theme.color.primary};
  font-size: 27px;
`;

const AdminMain = ({navigation}: any) => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  useEffect(() => {
    console.log('AdminMain');
  }, []);
  const checkLogin = async () => {
    if (isLoggedIn) {
      console.log('로그인 상태입니다.======> 페이지 이동', isLoggedIn);
      navigation.navigate('AdminMain');
    } else {
      console.log('로그인 상태가 아닙니다.======> 페이지 이동', isLoggedIn);
      navigation.navigate('Login');
    }
  };
  useEffect(() => {
    checkLogin();
  }, [isLoggedIn]);

  return (
    <View
      style={css`
        height: 100%;
      `}>
      <NotificationBar>
        <TouchableOpacity onPress={logoutUser}>
          <SimpleLineIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
        <Text
          style={css`
            font-size: 27px;
            color: #000000;
            font-weight: bold;
          `}>
          관리자 페이지
        </Text>
        <SimpleLineIcons name="logout" size={24} style={{opacity: 0}} />
      </NotificationBar>
      <NotificationBottom>
        <AdminWorkCard
          navigation={navigation}
          navigateTo="AdminNonCerti"
          textBold="인증신청"
          text="확인하기 ➔"
          imageSource="https://oywo.s3.ap-northeast-2.amazonaws.com/src/trash2.png"
        />
        <AdminWorkCard
          navigation={navigation}
          navigateTo="AdminComplainDeal"
          textBold="신고내역"
          text="확인하기 ➔"
          imageSource="https://oywo.s3.ap-northeast-2.amazonaws.com/src/trash2.png"
        />
        <AdminWorkCard
          navigation={navigation}
          navigateTo="AdminPaused"
          text="정지유저"
          textBold="관리하기 ➔"
          imageSource="https://oywo.s3.ap-northeast-2.amazonaws.com/src/trash2.png"
        />
      </NotificationBottom>
      <GlobalButton onPress={logoutUser}>
        <GlobalText>리셋</GlobalText>
      </GlobalButton>
    </View>
  );
};

export default AdminMain;
