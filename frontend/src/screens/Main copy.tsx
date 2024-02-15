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

import {logoutUser} from '@/utils/common';

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
    <GlobalContainer
      style={css`
        width: '100%';
      `}>
      <ScrollView>
        <MainHeader navigation={navigation} />
        <MainComponent />
        <MainDoList navigation={navigation} />
      </ScrollView>
      <MainModal navigation={navigation} />
      <GlobalButton>
        <GlobalText>리셋</GlobalText>
      </GlobalButton>
    </GlobalContainer>
  );
};

export default Home;
