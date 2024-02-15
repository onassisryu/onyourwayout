// 아파트 동 저장
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import theme from '@/Theme';
import GoBack from '@/components/Signup/GoBack';
import SignupHeadtext from '@/components/Signup/SignupHeadtext';
import {SignupBodyContainer} from '@/components/Signup/SignupBodyContainer';
import NextButton from '@/components/Signup/NextButton';
import {userSignUpDataState} from '@/recoil/atoms';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import axios from 'axios';

const Signup10 = ({navigation, route}: any) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const setUserSignUpData = useSetRecoilState(userSignUpDataState);
  const userSignUpData = useRecoilValue(userSignUpDataState);

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="회원가입이 완료되었습니다"></SignupHeadtext>

        <NextButton
          title="나간김에 이용하러가기"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onPress={() => navigation.navigate('Login')}
        />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

export default Signup10;
