import React from 'react';
import {Button} from 'react-native';
import styled, {css} from '@emotion/native';
import {useTheme, ThemeProvider} from '@emotion/react';

const Container = styled.View`
  justify-content: center;
  align-items: center;
  font-family: 'Zocial';
`;
const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Home = () => {
  const theme = useTheme();
  return (
    <Container>
      <StyledText
        style={css`
          background-color: ${theme.color.primary};]};
        `}>
        Homffe
      </StyledText>
      <Button title="go to the list screen" />
    </Container>
  );
};

export default Home;
