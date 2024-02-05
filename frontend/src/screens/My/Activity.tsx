import React from 'react';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import {userDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';
import GoBack from '@/components/Signup/GoBack';
import MypageButton from '@/components/Mypage/MypageButton';
import {MypageBodyContainer} from '@/components/Mypage/MypageBodyContainer';
import {View} from 'react-native';
import axios from 'axios';
const BodyContainer = styled(MypageBodyContainer)`
  justify-content: center;
  align-items: center;
`;
const HeadText = styled.Text`
  font-size: 25px;
  font-weight: 900;
  padding-top: 150px;
  padding-bottom: 30px;
`;
const StyledText = styled.Text`
  font-size: 18px;
  margin-bottom: 10px;
`;

function doActivity(userId: number, accessToken: string) {
  axios
    .get(`http://i10a302.p.ssafy.io:8080/deal/user/list?type=request/memberId=${userId}`, {
      headers: {
        Authorization: `${accessToken}`,
      },
    })
    .then(function (resp) {
      console.log(resp.data);
    })
    .catch(function (error) {
      console.error('Error fetching data:', error);
    });
}

const Activity = () => {
  const userData = useRecoilValue(userDataState); // userDataState 상태 가져오기
  const userId = userData.memberInfo.id;
  const accessToken = `${userData.token.accessToken}`;
  console.log(userId);
  console.log(accessToken);
  doActivity(userId, accessToken);
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <BodyContainer>
        <HeadText>나의 활동내역</HeadText>
        <View
          style={css`
            justify-content: center;
            align-items: center;
            padding: 20px;
            height: 130px;
            width: 100%;
            border-radius: 10px;
            background-color: #f2f2f2;
            margin-bottom: 30px;
          `}>
          <StyledText>wq25awq3215qtasaey636qtetqw21190faQWTG353tGAEQ25AGQV!</StyledText>
        </View>

        <MypageButton title="초대코드 발급" color="primary"></MypageButton>
      </BodyContainer>
    </GlobalContainer>
  );
};

export default Activity;
