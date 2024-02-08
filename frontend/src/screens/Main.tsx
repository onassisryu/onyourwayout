import React from 'react';
import {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {GlobalButton, GlobalText, GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import {useRecoilValue} from 'recoil';
import {getStorage, setStorage, clearStorage} from '@/storage/common_storage';
import {useEffect} from 'react';
import {get} from 'axios';
import {clear} from 'console';

const Home = ({navigation}: any) => {
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
      <MainModal navigation={navigation} />
      <GlobalButton onPress={clearStorage}>
        <GlobalText>리셋</GlobalText>
      </GlobalButton>
    </GlobalContainer>
  );
};

export default Home;
