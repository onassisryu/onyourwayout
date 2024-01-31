// 생년월일
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

const Signup2 = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsDisabled(!name);
  }, [name]);

  const handleClearInput = () => {
    setName('');
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="생년월일을 입력해주세요"></SignupHeadtext>
        <InputContainer>
          <StyledInput
            placeholder="YYYY.MM.DD"
            placeholderTextColor={theme.color.gray200}
            onChangeText={text => setName(text)}
            value={name}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <IconWrapper onPress={handleClearInput} visible={isFocused && name.length > 0}>
            <Ant name="closecircleo" size={20} color={theme.color.gray200} />
          </IconWrapper>
        </InputContainer>

        <NextButton
          title="다음"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onPress={() => navigation.navigate('Signup3')}
        />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

// 8자리 확인
export default Signup2;
