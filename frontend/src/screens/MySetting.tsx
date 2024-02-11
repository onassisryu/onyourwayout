import React from 'react';
import {Button, TouchableOpacity, Text} from 'react-native';
import styled from '@emotion/native';
import {useRecoilValue} from 'recoil'; // useRecoilValue 훅 추가
import {GlobalContainer} from '@/GlobalStyles';
import {userDataState} from '../recoil/atoms';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const My = ({navigation}: any) => {
  return (
    <GlobalContainer>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>
            <Ant name="arrowleft" size={40} color="black" />
          </Text>
        </TouchableOpacity>
      </Header>
      <StyledText>MySetting</StyledText>
    </GlobalContainer>
  );
};

export default My;
