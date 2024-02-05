import axios, {get} from 'axios';
import {useSetRecoilState} from 'recoil';
import {isLoggedInState, userDataState} from '../recoil/atoms';
import React, {useState, useEffect} from 'react';
import {Text, Alert, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import DefaultButton from '@/components/DefaultButton';
import theme from '@/Theme';
import Ant from 'react-native-vector-icons/AntDesign';
import {getStorage, setStorage} from '@/storage/token_storage';

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
  const [token, setToken] = useState(''); // 자동 로그인 여부를 저장하는 상태
  const [isDisabled, setIsDisabled] = useState(true);
  const [isnotValueid, setIsnotValueid] = useState(true);
  const [isnotValuepassword, setIsnotValuepassword] = useState(true);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Recoil 상태를 업데이트하여 로그인 상태를 true로 변경
  };
  // useSetRecoilState 훅으로 상태 업데이트 함수 가져오기
  const setUserData = useSetRecoilState(userDataState);
  async function login() {
    if (username.trim() === '') {
      Alert.alert('아이디 입력 확인', '아이디가 입력되지 않았습니다.');
    } else if (password.trim() === '') {
      Alert.alert('비밀번호 입력 확인', '비밀번호가 입력되지 않았습니다.');
    } else if ((await getStorage('autoLogin')) === true) {
      console.log('자동로그인');
      navigation.navigate('Home');
    } else {
      try {
        const response = await axios.post('http://i10a302.p.ssafy.io:8080/members/signin', {username, password});
        if (response.data !== null && response.data !== '') {
          handleLoginSuccess();
          setUserData(response.data); // 받아온 데이터를 Recoil 상태에 저장
          const token = response.data.token.accessToken;
          const refreshToken = response.data.token.refreshToken;

          setStorage('token', token);
          setStorage('refreshToken', refreshToken);
          setStorage('autoLogin', true);
          setStorage('user', response.data);

          Keyboard.dismiss();
          navigation.navigate('홈');
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

  // useEffect(() => {
  //   const checkAutoLoginAndRedirect = async () => {
  //     const autoLogin = await getStorage('autoLogin');
  //     console.log(autoLogin);
  //     if (autoLogin) {
  //       const userToken = await getStorage('userToken');
  //       if (userToken) {
  //         // autoLogin이 true이고 userToken이 존재하면 홈 화면으로 이동
  //         navigation.navigate('Home');
  //       }
  //     }
  //   };
  //   checkAutoLoginAndRedirect();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await getStorage('test');
    };

    fetchData();
  }, []);

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
