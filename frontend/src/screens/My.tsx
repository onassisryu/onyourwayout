import React from 'react';
import {Button} from 'react-native';
import styled from '@emotion/native';
import Styled from 'styled-components/native';
import { GlobalContainer,GlobalButton } from '@/obalStyles';
const Container = styled(GlobalContainer)`
const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const StyledText2 = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
  font-weight: 400;
  font-family:'DancingScript-Bold';
`;

const StyledText3 = Styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
  font-weight: 400;
  font-family:'DancingScript-Bold';
`;

const My = ({navigation}:any) => {
  return (
    <Container>
      <StyledText>My</StyledText>
      <StyledText2>My</StyledText2>
      <StyledText3>My</StyledText3>
      <Button title="go to the list screen" />
      <Button 
        title="Login" 
        onPress={() => navigation.navigate('Login')} 
        />
    </Container>
  );
};

export default My;
