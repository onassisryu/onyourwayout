import axios, {get} from 'axios';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {isLoggedInState, userDataState, apartDataState, fcmTokenState} from '@/recoil/atoms';
import React, {useState, useEffect} from 'react';
import {Text, Alert, View, Keyboard, TouchableWithoutFeedback, Image, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import DefaultButton from '@/components/DefaultButton';
import theme from '@/Theme';
import {getStorage, setStorage} from '@/storage/common_storage';

//icons
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  padding-left: 55px;
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
  const fcmToken = useRecoilValue(fcmTokenState).fcmToken;
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setUserData = useSetRecoilState(userDataState);
  const setApartData = useSetRecoilState(apartDataState);
  const isLoggedIn = useRecoilValue(isLoggedInState);

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const toggleSecureTextEntry = () => {
    setSecureTextEntry(prevState => !prevState);
  };
  const checkLogin = async () => {
    if (isLoggedIn) {
      console.log('로그인 상태입니다.======> 페이지 이동', isLoggedIn);
      navigation.navigate('Main');
    } else {
      console.log('로그인 상태가 아닙니다.======> 페이지 이동X', isLoggedIn);
    }
  };
  useEffect(() => {
    checkLogin();
  }, [isLoggedIn]);

  async function login() {
    console.log(fcmToken);
    if (username.trim() === '') {
      Alert.alert('아이디 입력 확인', '아이디가 입력되지 않았습니다.');
    } else if (password.trim() === '') {
      Alert.alert('비밀번호 입력 확인', '비밀번호가 입력되지 않았습니다.');
    } else {
      try {
        const response = await axios.post('http://i10a302.p.ssafy.io:8080/members/signin', {
          username: username,
          password: password,
          fcmToken: fcmToken,
        });
        if (response.data !== null && response.data !== '') {
          const token = response.data.token.accessToken;
          const refreshToken = response.data.token.refreshToken;
          const user = response.data.memberInfo;
          const adjDongs = response.data.adjDongs;
          await setStorage('token', token);
          await setStorage('refreshToken', refreshToken);
          await setStorage('user', user);
          await setStorage('adjDongs', adjDongs);

          //recoil에 저장
          setIsLoggedIn(true);
          setUserData(user);
          setApartData(adjDongs);
          navigation.navigate('Main');
          Keyboard.dismiss();
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
        <View
          style={css`
            width: 100%;
            position: relative;
          `}>
          <StyledInput
            placeholder="아이디 입력"
            placeholderTextColor={theme.color.gray200}
            value={username}
            onChangeText={text => setusername(text)}
            isnotValue={isnotValueid}
          />
          <View
            style={css`
              position: absolute;
              top: 45%;
              left: 5%;
            `}>
            {username !== '' ? (
              <FontAwesome5 name="user-circle" size={25} color={theme.color.primary} />
            ) : (
              <FontAwesome5 name="user-circle" size={25} color={theme.color.gray200} />
            )}
          </View>
        </View>
        <View
          style={css`
            width: 100%;
            position: relative;
          `}>
          <StyledInput
            placeholder="비밀번호 입력"
            placeholderTextColor={theme.color.gray200}
            value={password}
            onChangeText={text => setPassword(text)}
            secureTextEntry={secureTextEntry}
            isnotValue={isnotValuepassword}
          />
          <View
            style={css`
              position: absolute;
              top: 45%;
              left: 6%;
            `}>
            {password !== '' ? (
              <FontAwesome5 name="lock" size={22} color={theme.color.primary} />
            ) : (
              <FontAwesome5 name="lock" size={22} color={theme.color.gray200} />
            )}
          </View>
          <View
            style={css`
              position: absolute;
              top: 47%;
              right: 6%;
            `}>
            <TouchableOpacity onPress={toggleSecureTextEntry}>
              {password === '' && secureTextEntry ? (
                <Ionicons name="eye-outline" size={22} color={theme.color.gray200} />
              ) : password === '' && !secureTextEntry ? (
                <Ionicons name="eye-off-outline" size={22} color={theme.color.gray200} />
              ) : password !== '' && secureTextEntry ? (
                <Ionicons name="eye-outline" size={22} color={theme.color.primary} />
              ) : (
                <Ionicons name="eye-off-outline" size={22} color={theme.color.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
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
          <TouchableOpacity onPress={() => navigation.navigate('Signup0')}>
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
