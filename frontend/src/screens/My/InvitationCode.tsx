import React from 'react';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import MypageButton from '@/components/Mypage/MypageButton';
import {MypageBodyContainer} from '@/components/Mypage/MypageBodyContainer';
import {View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';

const BodyContainer = styled(MypageBodyContainer)`
  justify-content: center;
  align-items: center;
`;
const HeadText = styled.Text`
  font-size: 25px;
  font-weight: 900;
  margin-top: 150px;
  padding-bottom: 30px;
`;
const StyledText = styled.Text`
  font-size: 22px;
  margin-bottom: 10px;
`;

const InvitationCode = () => {
  const userData = useRecoilValue(userDataState);
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <BodyContainer>
        <HeadText>나의 초대 코드</HeadText>
        <View
          style={css`
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            height: 130px;
            width: 100%;
            border-radius: 10px;
            background-color: #f2f2f2;
            margin-bottom: 30px;
            padding: 10px;
          `}>
          <StyledText>{userData.inviteCode}</StyledText>
        </View>

        <MypageButton title="초대코드 발급" color="primary"></MypageButton>
      </BodyContainer>
    </GlobalContainer>
  );
};

export default InvitationCode;
