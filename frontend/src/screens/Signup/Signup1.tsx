// 아이디
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

const Signup1 = ({navigation}: any) => {
  const [value, setValue] = useState('2@gmail');
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

  const updateUserName = (username: string) => {
    setUserSignUpData(prevState => ({
      ...prevState,
      username: username,
    }));
  };

  function SetValue() {
    updateUserName(value);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (emailRegex.test(value)) {
      updateUserName(value);
      console.log(userSignUpData);
      navigation.navigate('Signup2');
    } else {
      Alert.alert('올바르지 않은 아이디 형식입니다');
    }
  }

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="사용하실 아이디를 입력해주세요"></SignupHeadtext>
        <InputContainer>
          <StyledInput
            placeholder="아이디 입력"
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

export default Signup1;
