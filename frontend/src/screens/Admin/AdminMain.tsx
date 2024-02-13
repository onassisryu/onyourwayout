import React, {useEffect} from 'react';
import {View, Text, Animated, TouchableOpacity} from 'react-native';

import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '@/recoil/atoms';
import styled, {css} from '@emotion/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {ScrollView} from 'react-native';
import {GlobalButton, GlobalText, GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import AdminNonCerti from './AdminNonCerti';
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

const CardTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.primary};
  font-weight: bold;
  margin-bottom: 10px;
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
        background-color: red;
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
        <SimpleLineIcons name="logout" size={24} color="black" />
      </NotificationBar>
      <NotificationBottom>
        <Card1>
          <TouchableOpacity onPress={() => navigation.navigate('AdminNonCerti')}>
            <CardComponent>
              <CardText>
                {`회원 아파트\n`}
                <Text style={{fontWeight: 'bold'}}>명세서 </Text>
                {`인증\n 신청내역 ➔`}
              </CardText>
              <CardImage1 source={require('images/trash2.png')} />
            </CardComponent>
          </TouchableOpacity>
        </Card1>
        <Card1>
          <TouchableOpacity onPress={() => navigation.navigate('AdminPaused')}>
            <CardComponent>
              <CardText>
                <Text style={{fontWeight: 'bold'}}>신고 내역 </Text>
                {`\n 확인하기 ➔`}
              </CardText>
              <CardImage1 source={require('images/trash.png')} />
            </CardComponent>
          </TouchableOpacity>
        </Card1>
        <Card1>
          <TouchableOpacity onPress={() => navigation.navigate('AdminNonCerti')}>
            <CardComponent>
              <CardText>
                <Text style={{fontWeight: 'bold'}}>정지 유저</Text>
                {`\n관리하기 ➔`}
              </CardText>
              <CardImage1 source={require('images/trash.png')} />
            </CardComponent>
          </TouchableOpacity>
        </Card1>
      </NotificationBottom>
      {/* <AdminNonCerti navigation={navigation} />; */}
      <GlobalButton onPress={logoutUser}>
        <GlobalText>리셋</GlobalText>
      </GlobalButton>
    </View>
  );
};

export default AdminMain;
