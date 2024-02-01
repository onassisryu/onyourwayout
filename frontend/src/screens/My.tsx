import React from 'react';
import {Button, TouchableOpacity, Text} from 'react-native';
import styled from '@emotion/native';
import {useRecoilValue} from 'recoil'; // useRecoilValue 훅 추가
import {GlobalContainer} from '@/GlobalStyles';
import {isLoggedInState, userDataState} from '../recoil/atoms';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
const MyHeader = styled(Header)`
  justify-content: flex-end;
`;
const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const My = ({navigation}: any) => {
  const isLoggedIn = useRecoilValue(isLoggedInState); // isLoggedInState 상태 가져오기
  const userData = useRecoilValue(userDataState); // userDataState 상태 가져오기
  if (!isLoggedIn) {
    // isLoggedIn이 false이면 로그인 페이지로 이동
    navigation.navigate('Login');
    return null; // 로그인 페이지로 이동하면 현재 컴포넌트는 렌더링하지 않음
  }
  return (
    <GlobalContainer>
      <MyHeader>
        <TouchableOpacity onPress={() => navigation.navigate('MySetting')}>
          <Text>
            <Ant name="setting" size={30} color="black" />
          </Text>
        </TouchableOpacity>
      </MyHeader>
      <StyledText>Mypage</StyledText>
      <StyledText>로그인 여부 : {isLoggedIn.toString()}</StyledText>
      <StyledText>{userData.memberInfo.nickname}</StyledText>
    </GlobalContainer>
  );
};

export default My;
