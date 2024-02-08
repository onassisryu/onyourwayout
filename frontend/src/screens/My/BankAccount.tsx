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

const BankAccount = () => {
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <Container>
        <StyledText>계좌정보인증</StyledText>
      </Container>
    </GlobalContainer>
  );
};

export default BankAccount;
