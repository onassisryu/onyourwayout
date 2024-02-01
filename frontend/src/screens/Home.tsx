import React from 'react';
import {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import {useRecoilValue} from 'recoil';
import {isLoggedInState, userDataState} from '../recoil/atoms';
const Home = ({navigation}: any) => {
  const isLoggedIn = useRecoilValue(isLoggedInState); // isLoggedInState 상태 가져오기
  const userData = useRecoilValue(userDataState); // userDataState 상태 가져오기
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
      <ScrollView
        style={css`
          width: '100%';
        `}>
        <MainHeader navigation={navigation} />
        <MainComponent />
        <MainDoList />
      </ScrollView>
      <MainModal />
    </GlobalContainer>
  );
};

export default Home;
