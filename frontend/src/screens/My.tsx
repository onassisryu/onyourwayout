import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {TouchableOpacity, Text, View, Image, StyleSheet} from 'react-native';
import styled, {css} from '@emotion/native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {userDataState, isLoggedInState} from '@/recoil/atoms';
import {logoutUser} from '@/utils/common';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import Mypagelist from '@/components/Mypage/InnerContainerBoxhorizontal';
import AcceptImage from '../../assets/images/나가요잉2.png';
import RequestImage from '../../assets/images/해줘요잉2.png';
import Mark from '../../assets/images/이웃지수마크.png';
const MyHeader = styled(Header)`
  justify-content: flex-end;
  position: absolute;
`;
const InnerContainer = styled.View`
  margin-bottom: 10px;
  border-bottom-color: ${props => props.theme.color.gray200};
  border-bottom-width: 1px;
  padding-top: 10px;
  padding-bottom: 20px;
`;
const InnerContainerTitle = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.color.black};
  margin-bottom: 20px;
`;
const NicknameText = styled(GlobalText)`
  color: ${props => props.theme.color.black};
  font-size: 20px;
  font-weight: bold;
  margin-right: 8px;
`;
const CertifiedText = styled(GlobalText)`
  margin-top: 2px;
  color: ${props => props.theme.color.primary};
  font-size: 13px;
  font-weight: bold;
`;
const ApartText = styled(GlobalText)`
  color: ${props => props.theme.color.gray300};
  font-size: 13px;
  font-weight: bold;
`;
const Scorebarbackground = styled.View`
  height: 15px;
  border-radius: 10px;
  background-color: #eaeaea;
  position: relative;
`;
const Scorebar = styled.View`
  height: 15px;
  border-radius: 10px;
  background-color: ${props => props.theme.color.primary};
  position: absolute;
`;
const InnerContainerBox = styled.TouchableOpacity`
  height: 150px;
  width: 45%;
  border-radius: 10px;
  background-color: ${props => props.theme.color.lightgray};
  margin-bottom: 10px;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const StyledImage = styled.Image`
  width: 50%;
  height: 50%;
  margin-bottom: 15px;
`;
const MarkImage = styled.Image`
  width: 30px;
  height: 30px;
`;
const My = ({navigation}: any) => {
  const userData = useRecoilValue(userDataState); // userDataState 상태 가져오기
  console.log(userData);
  const scorePercent = `${userData.score}%`;
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const setUserData = useSetRecoilState(userDataState);
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const checkLogin = async () => {
    if (isLoggedIn) {
      console.log('로그인 상태입니다.======> 페이지 이동', isLoggedIn);
      navigation.navigate('Main');
    } else {
      console.log('로그인 상태가 아닙니다.======> 페이지 이동', isLoggedIn);
      setUserData({});
      navigation.navigate('Login');
    }
  };
  useEffect(() => {
    checkLogin();
  }, [isLoggedIn]);

  return (
    <GlobalContainer
      style={css`
        height: 100%;
      `}>
      <ScrollView overScrollMode="never">
        <MyHeader>
          <TouchableOpacity onPress={() => navigation.navigate('MySetting')}>
            <Text>
              <Ant name="setting" size={30} color="gray" />
            </Text>
          </TouchableOpacity>
        </MyHeader>
        {userData && (
          <View
            style={css`
              width: 100%;
              padding: 0 32px;
            `}>
            <InnerContainer
              style={css`
                flex-direction: row;
                margin-top: 30px;
              `}>
              <View
                style={css`
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                `}>
                <View
                  style={css`
                    margin-right: 5px;
                  `}>
                  <View
                    style={css`
                      height: 52px;
                      width: 52px;
                      border-radius: 30px;
                      background-color: #eaeaea;
                      margin-right: 10px;
                    `}></View>
                </View>
              </View>
              <View>
                <View
                  style={css`
                    flex-direction: row;
                    align-items: center;
                  `}>
                  <NicknameText>{userData.nickname}</NicknameText>

                  {userData.certified ? (
                    <CertifiedText>세대원 인증</CertifiedText>
                  ) : (
                    <View
                      style={css`
                        flex-direction: row;
                      `}>
                      <Text>
                        <Ant name="warning" size={20} color="red" />
                      </Text>
                      <CertifiedText
                        style={css`
                          color: red;
                        `}>
                        {' '}
                        세대원 미인증
                      </CertifiedText>
                    </View>
                  )}
                </View>
                <View
                  style={css`
                    margin-top: 5px;
                    margin-left: 2px;
                  `}>
                  <ApartText>
                    {userData?.apt.name}아파트, {userData?.dongName}동 {userData?.hoName}호
                  </ApartText>
                </View>
              </View>
            </InnerContainer>

            <InnerContainer>
              <InnerContainerTitle>나의 이웃지수</InnerContainerTitle>
              <Scorebarbackground>
                <Scorebar
                  style={css`
                    width: ${scorePercent};
                  `}></Scorebar>
                <View
                  style={css`
                    position: absolute;
                    top: -7px;
                    left: ${scorePercent};
                  `}>
                  <MarkImage source={Mark}></MarkImage>
                </View>
              </Scorebarbackground>
            </InnerContainer>
            <InnerContainer>
              <InnerContainerTitle>나의 활동</InnerContainerTitle>
              <View
                style={css`
                  flex-direction: row;
                  justify-content: space-around;
                `}>
                <InnerContainerBox onPress={() => navigation.navigate('MyDoList', {type: 'accept'})}>
                  <StyledImage source={AcceptImage}></StyledImage>
                  <Text
                    style={css`
                      font-weight: 600;
                    `}>
                    내가 한일
                  </Text>
                </InnerContainerBox>
                <InnerContainerBox onPress={() => navigation.navigate('MyDoList', {type: 'request'})}>
                  <StyledImage source={RequestImage}></StyledImage>
                  <Text
                    style={css`
                      font-weight: 600;
                    `}>
                    내가 맡긴일
                  </Text>
                </InnerContainerBox>
              </View>
            </InnerContainer>
            <InnerContainer>
              <InnerContainerTitle>나의 인증</InnerContainerTitle>
              <Mypagelist
                title="아파트 정보 인증"
                iconType="MaterialCommunityIcons"
                icon="office-building-marker-outline"
                onPress={() => navigation.navigate('ApartCertification', {certified: userData.certified, nickname: userData.nickname})}
              />
              <Mypagelist
                title="초대 코드 발급"
                iconType="Ant"
                icon="solution1"
                onPress={() => navigation.navigate('InvitationCode')}
              />
              <Mypagelist
                title="계좌 인증"
                iconType="MaterialCommunityIcons"
                icon="checkbook"
                onPress={() => navigation.navigate('BankAccount')}
              />
            </InnerContainer>
            <InnerContainer>
              <InnerContainerTitle>나의 설정</InnerContainerTitle>
              <Mypagelist
                title="고객센터"
                iconType="MaterialIcons"
                icon="headset-mic"
                onPress={() => navigation.navigate('ServiceCenter')}
              />
              <Mypagelist
                title="환경설정"
                iconType="Ant"
                icon="setting"
                onPress={() => navigation.navigate('MySetting')}
              />
              <Mypagelist
                title="로그아웃"
                iconType="Ant"
                icon="setting"
                onPress={() => {
                  logoutUser;
                  setIsLoggedIn(false);
                }}
              />
            </InnerContainer>
          </View>
        )}
      </ScrollView>
    </GlobalContainer>
  );
};

export default My;
