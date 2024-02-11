import React from 'react';
import {Button} from 'react-native';
import styled from '@emotion/native';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Apart = ({navigation}: any) => {
  return (
    <Container>
      <Header>
      <Ant
        name="arrowleft"
        size={40}
        color="black"
        onPress={() => navigation.navigate('DoItListDetail', {screen: '세부사항'})}
        />
      </Header>
    </Container>
  );
};

export default Apart;