// 초대코드
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import theme from '@/Theme';
import DefaultButton from '@/components/DefaultButton';
import GoBack from '@/components/Signup/GoBack';
import SignupHeadtext from '@/components/Signup/SignupHeadtext';
import {SignupBodyContainer} from '@/components/Signup/SignupBodyContainer';
import axiosBasic from '@/axios/axios';
import {userSignUpDataState} from '@/recoil/atoms';
import {useSetRecoilState, useRecoilValue} from 'recoil';
const InputContainer = styled.View`
  width: 100%;
  position: relative;
`;

const StyledInput = styled.TextInput`
  width: 100%;
  font-size: 18px;
  color: ${theme.color.black};
  margin-top: 50px;
  border-bottom-color: ${theme.color.gray200};
  border-bottom-width: 1px;
`;

const IconWrapper = styled(TouchableOpacity)<{visible: boolean}>`
  position: absolute;
  right: 10px;
  bottom: 10px;
  ${({visible}) => !visible && 'opacity: 0;'};
`;

const Signup5 = ({navigation, route}: any) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const {responseData} = route.params;

  useEffect(() => {
    setIsDisabled(!value);
  }, [value]);

  const NextButton = styled(DefaultButton)`
    width: 100%;
    font-size: 18px;
    height: 50px;
    margin-top: 20px;
    padding: 10px;
    background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
  `;

  const NextButton2 = styled(DefaultButton)`
    width: 100%;
    font-size: 18px;
    height: 50px;
    margin-top: 20px;
    padding: 10px;
    background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
  `;

  const data = {
    username: 'b@gmail',
    nickname: 'b',
    password: '1234',
    birthDate: '2022-10-11',
    phoneNumber: '010-1111-1121',
    inviteCode: '1d4b6978710c347ea32c6181e2f7f029',
  };

  const userSignUpData = useRecoilValue(userSignUpDataState);
  function signUpFinish() {
    console.log(userSignUpData);
    axiosBasic
      .post('/members/signup', userSignUpData)
      .then(resp => {
        // console.log('성공', resp.data);
        console.log('회원가입 성공');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <View>
          <Text>{responseData.apartName}</Text>
          <Text>{responseData.dongName}</Text>
          <Text>{responseData.hoName}</Text>
        </View>
        <NextButton2 title="가입 완료" color="primary" size="lg" onPress={() => signUpFinish()} />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

export default Signup5;
