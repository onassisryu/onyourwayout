import React, {useEffect, useState} from 'react';
import {Button, Text, View, TextInput, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import theme from '@/Theme';
import DefaultButton from '@/components/DefaultButton';
const Container = styled(GlobalContainer)``;
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

const IconWrapper = styled(TouchableOpacity)`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

const Signup = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!name);
  }, [name]);

  const handleClearInput = () => {
    setName(''); // 입력 상자 비우기
  };

  const NextButton = styled(DefaultButton)`
    width: 100%;
    font-size: 18px;
    height: 50px;
    margin-top: 20px;
    padding: 10px;
    background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
  `;
  return (
    <Container>
      <Header>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>
            <Ant name="arrowleft" size={40} color="black" />
          </Text>
        </TouchableOpacity>
      </Header>
      <View
        style={css`
          width: 100%;
          padding: 0 32px;
        `}>
        <View
          style={css`
            width: 100%;
          `}>
          <Text
            style={css`
              margin-top: 20px;
              font-size: 20px;
              font-weight: 900;
              color: black;
            `}>
            이름을 입력해주세요
          </Text>
        </View>
        <InputContainer>
          <StyledInput
            placeholder="이름 입력"
            placeholderTextColor={theme.color.gray200}
            onChangeText={text => setName(text)}
            value={name}
          />
          <IconWrapper onPress={handleClearInput}>
            <Ant name="closecircleo" size={20} color={theme.color.gray200} />
          </IconWrapper>
        </InputContainer>
        <NextButton
          title="다음"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onPress={() => navigation.navigate('Signup2')}
        />
      </View>
    </Container>
  );
};

export default Signup;
