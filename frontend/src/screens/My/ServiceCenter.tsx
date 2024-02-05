import React from 'react';
import styled from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';

const Container = styled.View`
  justify-content: center;
  align-items: center;
`;

const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const ServiceCenter = () => {
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <Container>
        <StyledText>서비스센터</StyledText>
      </Container>
    </GlobalContainer>
  );
};

export default ServiceCenter;
