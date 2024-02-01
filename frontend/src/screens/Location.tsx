import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import Header from '@/components/Header';
import styled from '@emotion/native';
import Ant from 'react-native-vector-icons/AntDesign';

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const LocHeader = styled(Header)`
  justify-content: flex-start;
`;
const Location = ({navigation}: any) => {
  return (
    <Container>
      <LocHeader>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>
            <Ant name="arrowleft" size={40} color="black" />
          </Text>
        </TouchableOpacity>
        <Text>효자촌 그린타운</Text>
      </LocHeader>
    </Container>
  );
};

export default Location;
