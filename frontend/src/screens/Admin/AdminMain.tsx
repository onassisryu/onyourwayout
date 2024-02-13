import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

import {useRecoilValue} from 'recoil';
import {isLoggedInState} from '@/recoil/atoms';
import styled, {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {GlobalButton, GlobalText, GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import AdminNonCerti from './AdminNonCerti';
import {logoutUser} from '@/utils/common';

// 배경
const NotificationBar = styled.View`
  background-color: #00d282;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 140px;
  align-items: center;
`;

const NotificationBottom = styled.View`
  background-color: #d9d9d9;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 205px;
`;

const AdminMain = ({navigation}: any) => {
  const isLoggedIn = useRecoilValue(isLoggedInState);

  useEffect(() => {
    console.log('AdminMain');
  }, []);
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

  return (
    <View>
      <ScrollView>
        <NotificationBar />
        <NotificationBottom />
        <AdminNonCerti navigation={navigation} />;
      </ScrollView>
      <GlobalButton onPress={logoutUser}>
        <GlobalText>리셋</GlobalText>
      </GlobalButton>
    </View>
  );
};

export default AdminMain;
