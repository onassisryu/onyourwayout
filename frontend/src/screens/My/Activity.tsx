import React, {useEffect} from 'react';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import {userDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';
import GoBack from '@/components/Signup/GoBack';
import MypageButton from '@/components/Mypage/MypageButton';
import {MypageBodyContainer} from '@/components/Mypage/MypageBodyContainer';
import {View} from 'react-native';
import axiosAuth from '@/axios/axiosAuth';

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

const data = {
  title: 'title12',
  content: 'content12',
  item: '라면',
  dealType: 'PET',
  expireAtStr: '2025-03-03 00:00:00',
};

const Activity = () => {
  const userData = useRecoilValue(userDataState); // userDataState 상태 가져오기
  const userId = userData.id;

  useEffect(() => {
    axiosAuth
      .post('/deal', data)
      .then(resp => {
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);
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
