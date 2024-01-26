import React from "react";
import {Button} from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  justify-content: center;
  align-items: center;
  font-family: "Zocial";
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const Home = () => {
  return (
    <Container>
      <StyledText>Homffe</StyledText>
      <Button title="go to the list screen" />
    </Container>
  );
};

export default Home;
