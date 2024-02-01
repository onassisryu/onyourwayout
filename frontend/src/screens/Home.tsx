import React from 'react';
import {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';

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
      <MainModal />
    </GlobalContainer>
  );
};

export default Home;
