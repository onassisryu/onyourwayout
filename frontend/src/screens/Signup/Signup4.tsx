// 패스워드
import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
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

const Signup4 = ({navigation}: any) => {
  const [value, setValue] = useState('1234');
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

  const updatePassword = (password: string) => {
    setUserSignUpData(prevState => ({
      ...prevState,
      password: password,
    }));
  };

  function SetValue() {
    updatePassword(value);
    console.log(userSignUpData);
    navigation.navigate('Signup5');
  }

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="사용하실 비밀번호를 입력해주세요"></SignupHeadtext>
        <InputContainer>
          <StyledInput
            placeholder="비밀번호 입력"
            placeholderTextColor={theme.color.gray200}
            onChangeText={text => setValue(text)}
            value={value}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            secureTextEntry
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

export default Signup4;
