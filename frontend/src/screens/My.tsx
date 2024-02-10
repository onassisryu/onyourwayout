import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {TouchableOpacity, Text, View} from 'react-native';
import styled, {css} from '@emotion/native';
import {useRecoilValue} from 'recoil';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {isLoggedInState, userDataState} from '@/recoil/atoms';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import Mypagelist from '@/components/Mypage/InnerContainerBoxhorizontal';
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
  font-weight: 900;
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

const My = ({navigation}: any) => {
  const isLoggedIn = useRecoilValue(isLoggedInState); // isLoggedInState 상태 가져오기
  const userData = useRecoilValue(userDataState); // userDataState 상태 가져오기
  const scorePercent = `${userData.score}%`;
  useEffect(() => {
    console.log('isLoggedIn', isLoggedIn);
    console.log('userData', userData);
    if (!isLoggedIn) {
      navigation.navigate('Login');
    }
  }, []);
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
                  <ApartText>싸피아파트, 1201동 303호</ApartText>
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
                  <Text>내가 한일</Text>
                </InnerContainerBox>
                <InnerContainerBox onPress={() => navigation.navigate('MyDoList', {type: 'request'})}>
                  <Text>내가 맡긴일</Text>
                </InnerContainerBox>
              </View>
            </InnerContainer>
            <InnerContainer>
              <InnerContainerTitle>나의 인증</InnerContainerTitle>
              <Mypagelist
                title="아파트 정보 인증"
                iconType="MaterialCommunityIcons"
                icon="office-building-marker-outline"
                onPress={() => navigation.navigate('ApartCertification')}
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
            </InnerContainer>
          </View>
        )}
      </ScrollView>
    </GlobalContainer>
  );
};

export default My;
