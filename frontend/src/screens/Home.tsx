import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import React, { useState } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { ScrollView, TouchableWithoutFeedback, Modal, ImageSourcePropType } from 'react-native';


import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';


interface Props {
  navigation: NavigationProp<any>;
}

const Home = ({ navigation }: Props) => {

  return (
    <GlobalContainer>

      <ScrollView style={{ width: '100%' }}>
        <MainHeader navigation={navigation} />
        <MainComponent /> 
        <MainDoList />
      </ScrollView>
      <MainModal navigation={navigation} />
    </GlobalContainer>
  );
};

export default Home;
