import React, {useState, useEffect} from 'react';
import {Text, TextInput, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import DefaultButton from '@/components/DefaultButton';
import theme from '@/Theme';
import Ionic from 'react-native-vector-icons/Ionicons';

interface StyledInputProps {
  isnotValue?: boolean;
}
const Container = styled(GlobalContainer)`
  justify-content: center;
  align-items: center;
  padding: 48px;
  height: 100%;
`;

const StyledText = styled(GlobalText)`
  font-family: ${theme.font.clover};
  color: ${theme.color.primary};
  font-size: 50px;
  margin-bottom: 50px;
`;

const StyledInput = styled.TextInput<StyledInputProps>`
  width: 100%;
  font-size: 18px;
  color: ${theme.color.primary};
  background-color: white;
  margin-top: 20px;
  border-radius: 30px;
  border: 2px solid ${theme.color.gray200};
  padding: 10px;
  padding-left: 40px;
  border: 2px solid ${({isnotValue}) => (isnotValue ? theme.color.gray200 : theme.color.primary)};
  color: ${theme.color.primary};
`;

const LoginButton = styled(DefaultButton)`
  width: 100%;
  font-size: 18px;
  height: 50px;
  margin-top: 20px;
  border-radius: 30px;
  padding: 10px;
  background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
`;

const Login = ({navigation}: any) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isnotValueid, setIsnotValueid] = useState(true);
  const [isnotValuepassword, setIsnotValuepassword] = useState(true);

  useEffect(() => {
    setIsDisabled(!(id && password)); // 아이디와 비밀번호가 입력되지 않은 경우 버튼을 비활성화
  }, [id, password]);

  useEffect(() => {
    setIsnotValueid(!id);
  }, [id]);

  useEffect(() => {
    setIsnotValuepassword(!password);
  }, [password]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <StyledText
          style={css`
            margin-top: 60px;
            margin-bottom: 60px;
          `}>
          나온김에
        </StyledText>
        <StyledInput
          placeholder="아이디 입력"
          placeholderTextColor={theme.color.gray200}
          value={id}
          onChangeText={text => setId(text)}
          isnotValue={isnotValueid}
        />

        <StyledInput
          placeholder="비밀번호 입력"
          placeholderTextColor={theme.color.gray200}
          value={password}
          onChangeText={text => setPassword(text)}
          secureTextEntry
          isnotValue={isnotValuepassword}
        />

        <LoginButton title="로그인" color="primary" size="lg" disabled={isDisabled} />

        <View
          style={css`
            flex-direction: row;
            margin-top: 20px;
          `}>
          <Text>비밀번호 찾기 </Text>
          <Text
            style={css`
              margin-right: 20px;
              margin-left: 20px;
            `}>
            |
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text>회원가입</Text>
          </TouchableOpacity>
        </View>

        <Text
          style={css`
            margin-top: 60px;
          `}>
          SNS 계정으로 간편로그인하세요.
        </Text>

        <View
          style={css`
            flex-direction: row;
            justify-content: space-between;
            margin-top: 20px;
            width: 70%;
          `}>
          <Image source={require('../../assets/icons/login_KAKAO.png')} />
          <Image source={require('../../assets/icons/login_NAVER.png')} />
          <Image source={require('../../assets/icons/login_GOOGLE.png')} />
        </View>
      </Container>
    </TouchableWithoutFeedback>
  );
};

export default Login;
