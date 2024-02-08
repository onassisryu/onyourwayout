// 초대코드
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
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

const Signup5 = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsDisabled(!value);
  }, [value]);

  const handleClearInput = () => {
    setName('');
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const setUserSignUpData = useSetRecoilState(userSignUpDataState);
  const userSignUpData = useRecoilValue(userSignUpDataState);
  const updateInviteCode = (inviteCode: string) => {
    setUserSignUpData(prevState => ({
      ...prevState,
      inviteCode: inviteCode,
    }));
  };
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

  function Code(value: string) {
    axiosBasic
      .get(`/members/verify/${value}`)
      .then(resp => {
        console.log('성공', resp.data);
        updateInviteCode(value);
        navigation.navigate('Signup5a', {responseData: resp.data});
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
        <SignupHeadtext title="초대코드를 입력해주세요"></SignupHeadtext>
        <InputContainer>
          <StyledInput
            placeholder="초대코드"
            placeholderTextColor={theme.color.gray200}
            onChangeText={text => setValue(text)}
            value={value}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <IconWrapper onPress={handleClearInput} visible={isFocused && name.length > 0}>
            <Ant name="closecircleo" size={20} color={theme.color.gray200} />
          </IconWrapper>
        </InputContainer>

        <NextButton title="다음" color="primary" size="lg" disabled={isDisabled} onPress={() => Code(value)} />
        <NextButton2
          title="초대코드 없음"
          color="primary"
          size="lg"
          disabled={!isDisabled}
          onPress={() => navigation.navigate('Signup6')}
        />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

export default Signup5;
