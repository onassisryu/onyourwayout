import React from 'react';
import {Button} from 'react-native';
import styled from '@emotion/native';
import Header from '@components/Header';
import Ant from 'react-native-vector-icons/AntDesign';

const HeaderContainer = styled(Header)`
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const DoItListDetailScreen = () => {

  return (
    <HeaderContainer>
        <Ant name="arrowleft" size={40} color="white" />
    </HeaderContainer>
  );
};

export default DoItListDetailScreen;
