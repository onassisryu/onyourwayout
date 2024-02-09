import React from 'react';
import {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {GlobalButton, GlobalText, GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import {useRecoilValue} from 'recoil';

import {logoutUser} from '@/utils/common';
import {useEffect} from 'react';

const Home = ({navigation}: any) => {
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
      <GlobalButton onPress={logoutUser}>
        <GlobalText>리셋</GlobalText>
      </GlobalButton>
    </GlobalContainer>
  );
};

export default Home;
