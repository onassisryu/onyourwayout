import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import styled, {css} from '@emotion/native';
import {useRecoilValue} from 'recoil';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {isLoggedInState, userDataState} from '../recoil/atoms';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';

const MyHeader = styled(Header)`
  justify-content: flex-end;
`;
const NicknameText = styled(GlobalText)`
  color: ${props => props.theme.color.black};
  font-size: 27px;
  font-weight: bold;
`;
const CertifiedText = styled(GlobalText)`
  color: ${props => props.theme.color.primary};
  font-size: 12px;
  font-weight: bold;
`;
const ApartText = styled(GlobalText)`
  color: ${props => props.theme.color.gray300};
  font-size: 12px;
  font-weight: bold;
`;
const StyledText = styled(GlobalText)`
  font-family: ${props => props.theme.font.clover};
  color: ${props => props.theme.color.primary};
  font-size: 27px;
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
      {userData && (
        <View
          style={css`
            width: 100%;
            padding: 0 32px;
          `}>
          <View
            style={css`
              flex-direction: row;
            `}>
            <View
              style={css`
                flex-direction: row;
                align-items: center;
              `}>
              <Text>그림</Text>
            </View>
            <View>
              <View
                style={css`
                  flex-direction: row;
                  align-items: center;
                `}>
                <NicknameText>{userData.memberInfo.nickname}</NicknameText>
                <CertifiedText>{userData.memberInfo.certified ? '세대원 인증' : '세대원 미인증'}</CertifiedText>
              </View>
              <View>
                <ApartText>싸피아파트, 1201동 303호</ApartText>
              </View>
            </View>
          </View>

          <View>
            <Text>나의 이웃지수</Text>
            <StyledText>{userData.memberInfo.score}</StyledText>
          </View>
          <View>
            <Text>나의 활동</Text>
          </View>
          <View>
            <Text>나의 인증</Text>
          </View>
          <View>
            <Text>나의 뭐시기</Text>
          </View>
        </View>
      )}
    </GlobalContainer>
  );
};

export default My;
