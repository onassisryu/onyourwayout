import React from 'react';
import {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {GlobalButton, GlobalText, GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import {useRecoilValue} from 'recoil';

import {isLoggedInState, userDataState} from '../recoil/atoms';
import {getStorage, setStorage, clearStorage} from '@/storage/common_storage';
import {useEffect} from 'react';
import {get} from 'axios';
import {clear} from 'console';

const Home = ({navigation}: any) => {
  const isLoggedIn = useRecoilValue(isLoggedInState); // isLoggedInState 상태 가져오기
  if (!isLoggedIn) {
    // isLoggedIn이 false이면 로그인 페이지로 이동
    navigation.navigate('Login');
    return null; // 로그인 페이지로 이동하면 현재 컴포넌트는 렌더링하지 않음
  }
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
      <GlobalButton onPress={clearStorage}>
        <GlobalText>리셋</GlobalText>
      </GlobalButton>
    </GlobalContainer>
  );
};

export default Home;
