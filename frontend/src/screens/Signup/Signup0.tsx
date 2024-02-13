// 닉네임
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Alert} from 'react-native';
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
import axiosBasic from '@/axios/axios';

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

const Signup0 = ({navigation}: any) => {
  const [value, setValue] = useState('닉네임');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsDisabled(!value);
  }, [value]);

  const handleClearInput = () => {
    setValue('');
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const setUserSignUpData = useSetRecoilState(userSignUpDataState);
  const userSignUpData = useRecoilValue(userSignUpDataState);

  const updateNickName = (value: string) => {
    console.log('닉네임', value);
    axiosBasic
      .get(`/members/dup/nickname?value=${value}`)
      .then(resp => {
        console.log('성공', resp.data);
        setUserSignUpData(prevState => ({
          ...prevState,
          nickname: value,
        }));
        navigation.navigate('Signup1');
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        if (error.response.status === 409) {
          Alert.alert('중복된 닉네임입니다');
          setIsDisabled(true);
        }
      });
  };

  function SetValue() {
    updateNickName(value);
    console.log(userSignUpData);
  }

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="사용하실 닉네임을 입력해주세요"></SignupHeadtext>
        <InputContainer>
          <StyledInput
            placeholder="닉네임 입력"
            placeholderTextColor={theme.color.gray200}
            onChangeText={text => setValue(text)}
            value={value}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <IconWrapper onPress={handleClearInput} visible={isFocused && value.length > 0}>
            <Ant name="closecircleo" size={20} color={theme.color.gray200} />
          </IconWrapper>
        </InputContainer>

        <NextButton title="다음" color="primary" size="lg" disabled={isDisabled} onPress={() => SetValue()} />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

export default Signup0;
