import React from 'react';
import {Button} from 'react-native';
import styled from '@emotion/native';

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Login = () => {
  return (
    <Container>
      <StyledText>Login</StyledText>
      <Button title="go to the list screen" />
    </Container>
  );
};

export default Login;
