import React from 'react';
import {Button} from 'react-native';
import styled from '@emotion/native';

const Container = styled.View`
  justify-content: center;
  align-items: center;
  font-family: 'AntDesign';
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Location = () => {
  return (
    <Container>
      <StyledText>Location</StyledText>
      <Button title="go to the list screen" />
    </Container>
  );
};

export default Location;
