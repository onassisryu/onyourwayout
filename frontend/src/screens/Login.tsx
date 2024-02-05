import axios, {get} from 'axios';
import {useSetRecoilState} from 'recoil';
import {isLoggedInState, userDataState} from '@/recoil/atoms';
import React, {useState, useEffect} from 'react';
import {Text, Alert, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import DefaultButton from '@/components/DefaultButton';
import theme from '@/Theme';
import Ant from 'react-native-vector-icons/AntDesign';
import {getStorage, setStorage} from '@/storage/common_storage';

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
  const [username, setusername] = useState('a@gmail');
  const [password, setPassword] = useState('1234');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isnotValueid, setIsnotValueid] = useState(true);
  const [isnotValuepassword, setIsnotValuepassword] = useState(true);

  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setUserData = useSetRecoilState(userDataState);

  const handleLogin = () => {
    console.log('자동로그인');
    setIsLoggedIn(true);
  };

  //로그인 상태 체크
  useEffect(() => {
    getStorage('token').then(token => {
      if (token) {
        console.log('리프레시 토큰이 있습니다.', token);
        getStorage('autoLogin').then(auto => {
          if (auto) {
            handleLogin();
            getStorage('user').then(auto => {
              setUserData(auto);
              if (auto) {
                navigation.navigate('Bottom', {screen: 'Main'});
              }
            });
          }
        });
      }
    });
  }, []);

  async function login() {
    if (username.trim() === '') {
      Alert.alert('아이디 입력 확인', '아이디가 입력되지 않았습니다.');
    } else if (password.trim() === '') {
      Alert.alert('비밀번호 입력 확인', '비밀번호가 입력되지 않았습니다.');
    } else {
      try {
        const response = await axios.post('http://i10a302.p.ssafy.io:8080/members/signin', {username, password});
        if (response.data !== null && response.data !== '') {
          const token = response.data.token.accessToken;
          const refreshToken = response.data.token.refreshToken;
          const user = response.data.memberInfo;
          await setStorage('token', token);
          await setStorage('refreshToken', refreshToken);
          await setStorage('autoLogin', 'true');
          await setStorage('user', user);

          Keyboard.dismiss();
          navigation.navigate('Bottom', {screen: 'Main'});
          console.log('로그인 성공');
        } else {
          Alert.alert('로그인 실패', '아이디나 비밀번호를 확인하세요.');
          setusername('');
          setPassword('');
        }
      } catch (error) {
        console.log(`Error Message: ${error}`);
        console.log(username);
        console.log(password);
      }
    }
  }
  useEffect(() => {
    setIsDisabled(!(username && password)); // 아이디와 비밀번호가 입력되지 않은 경우 버튼을 비활성화
  }, [username, password]);

  useEffect(() => {
    setIsnotValueid(!username);
  }, [username]);

  useEffect(() => {
    setIsnotValuepassword(!password);
  }, [password]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>
            <Ant name="arrowleft" size={40} color="black" />
          </Text>
        </TouchableOpacity> */}
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
          value={username}
          onChangeText={text => setusername(text)}
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

        <LoginButton title="로그인" color="primary" size="lg" disabled={isDisabled} onPress={() => login()} />

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
          <TouchableOpacity onPress={() => navigation.navigate('Signup1')}>
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
