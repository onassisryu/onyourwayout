import React, {useState, useEffect} from 'react';
import {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {Platform, PermissionsAndroid} from 'react-native';
import {GlobalButton, GlobalText, GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '@/recoil/atoms';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import theme from '@/Theme';
import {logoutUser} from '@/utils/common';
import styled from '@emotion/native';
import apartImage from '../../assets/images/apart.png';
import goOutMan from '../../assets/images/goOutMan.png';

const BoxText = styled(GlobalText)`
  font-size: 27px;
  font-weight: 500;
  color: ${theme.color.black};
`;

const Home = ({navigation}: any) => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }
  const checkLogin = async () => {
    if (isLoggedIn) {
      console.log('로그인 상태입니다.======> 페이지 이동', isLoggedIn);
      navigation.navigate('Main');
    } else {
      console.log('로그인 상태가 아닙니다.======> 페이지 이동', isLoggedIn);
      navigation.navigate('Login');
    }
  };
  useEffect(() => {
    checkLogin();
  }, [isLoggedIn]);

  useEffect(() => {
    console.log('메인화면이유');
    requestPermissions();
  }, []);
  return (
    <GlobalContainer style={css``}>
      <MainHeader navigation={navigation} />
      <View
        style={css`
          height: 30%;
          background-color: ${theme.color.primary};
          padding-left: 20px;
          padding-right: 20px;
        `}>
        <View
          style={css`
            width: 100%;
            height: 15%;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
          `}>
          <Text
            style={css`
              color: white;
              font-size: 17px;
            `}>
            밖에 나온김에 단지 이웃의 작은 부탁까지
          </Text>
        </View>
        <TouchableOpacity
          style={css`
            height: 60%;

            margin-top: 5%;
            margin-bottom: 5%;
          `}>
          <View
            style={css`
              height: 100%;
              background-color: ${theme.color.white};
              border-radius: 20px;
              padding: 10%;
              flex-direction: row;
            `}>
            <Image source={goOutMan} />
            <View>
              <Text>나가기전 나가요잉으로 </Text>
              <Text>우리동의 부탁을 추천받아 볼까요?</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={css`
          height: 70%;
          background-color: ${theme.color.gray0};
          padding-left: 20px;
          padding-right: 20px;
        `}>
        <TouchableOpacity
          style={css`
            height: 40%;
            margin-top: 7%;
            margin-bottom: 10%;
          `}>
          <View
            style={css`
              height: 100%;
              background-color: ${theme.color.white};
              border: 1px solid ${theme.color.gray300};
              border-radius: 20px;

              flex-direction: row;
              justify-content: center;
              align-items: center;
            `}>
            <View
              style={css`
                margin-right: 10px;
              `}>
              <BoxText>201동에</BoxText>
              <BoxText>해줘요잉이</BoxText>
              <View
                style={css`
                  flex-direction: row;
                  align-items: flex-end;
                  text-align: end;
                `}>
                <BoxText
                  style={css`
                    font-weight: 700;
                    font-size: 33px;
                  `}>
                  3건
                </BoxText>
                <BoxText> 있어요</BoxText>
              </View>

              <Text
                style={css`
                  margin-top: 5px;
                  color: ${theme.color.primary};
                `}>
                보러가기
              </Text>
            </View>

            <Image source={apartImage} />
          </View>
        </TouchableOpacity>
        <View
          style={css`
            height: 30%;
            background-color: ${theme.color.white};
            border: 1px solid ${theme.color.gray300};
            border-radius: 20px;
            margin-bottom: 5%;
          `}></View>
      </View>
      <MainModal navigation={navigation} />
    </GlobalContainer>
  );
};

export default Home;
