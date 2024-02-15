import React, {useState, useEffect} from 'react';
import {css} from '@emotion/native';

import {ScrollView} from 'react-native';
import {Platform, PermissionsAndroid} from 'react-native';
import {GlobalButton, GlobalText, GlobalContainer} from '@/GlobalStyles';
import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import MainModal from '@/components/Mainpage/MainModal';
import {useRecoilValue} from 'recoil';
import {isLoggedInState, userDataState} from '@/recoil/atoms';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import theme from '@/Theme';
import styled from '@emotion/native';
import apartImage from '../../assets/images/apart.png';
import goOutMan from '../../assets/images/goOutMan.png';
import requestMan from '../../assets/images/requestMan.png';
import {RadialGradient, LinearGradient} from 'react-native-gradients';
import Carousel from 'pinar';
import axiosAuth from '@/axios/axiosAuth';

const BoxText = styled(GlobalText)`
  font-size: 27px;
  font-weight: 600;
  color: ${theme.color.black};
`;
const StyledImage = styled.Image`
  height: 80%;
`;
const dotStyle = css`
  width: 10%;
  height: 3px;
  margin: 5px;
  background-color: gray;
`;
const activeDotStyle = css`
  width: 10%;
  height: 3px;
  margin: 5px;
  background-color: ${theme.color.primary};
  position: relative;
`;

const dotsContainerStyle = css`
  width: 100%;
  position: absolute;
  flex-direction: row;
  justify-content: center;
  top: 90%;
`;
const Home = ({navigation}: any) => {
  const userData = useRecoilValue(userDataState);
  const [dongCount, setDongCount] = useState(0);
  const [doItList, setDoItList] = useState([]);
  useEffect(() => {
    console.log(userData);
    axiosAuth
      .get(`deal/dong/count?dong=${userData.dongId}`)
      .then(resp => {
        console.log('아파트 건수', resp.data);
        const apartmentCount = parseInt(resp.data.match(/\d+/)[0], 10);
        setDongCount(apartmentCount);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosAuth.get('deal/mying');
        setDoItList(response.data);
        console.log('성공', response.data);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <GlobalContainer style={css``}>
      <MainHeader navigation={navigation} />
      <View
        style={css`
          height: 30%;
          background-color: ${theme.color.primary};
          padding-left: 20px;
          padding-right: 20px;
        `}>
        <View
          style={css`
            width: 100%;
            height: 13%;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
          `}>
          <Text
            style={css`
              color: white;
              font-size: 17px;
            `}>
            밖에 나온김에 단지 이웃의 작은 부탁까지
          </Text>
        </View>
        <View
          style={css`
            width: 100%;
            height: 80%;
          `}>
          <Carousel showsControls={false} autoplay={true} autoplayInterval={5000} loop={true}>
            <View>
              <TouchableOpacity
                style={css`
                  margin-top: 5%;
                  margin-bottom: 5%;
                `}
                onPress={() => {
                  navigation.navigate('DoIt1');
                }}>
                <View
                  style={css`
                    height: 100%;
                    background-color: ${theme.color.white};
                    border-radius: 20px;
                    padding: 5%;
                    flex-direction: row;
                    align-items: center;
                  `}>
                  <StyledImage source={goOutMan} />
                  <View
                    style={css`
                      margin-left: 5%;
                    `}>
                    <Text
                      style={css`
                        font-weight: 500;
                        font-size: 20px;
                      `}>
                      단지 이웃에게 해줘요잉으로
                    </Text>
                    <Text
                      style={css`
                        font-weight: 500;
                        font-size: 20px;
                      `}>
                      부탁해볼까요?
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={css`
                  margin-top: 5%;
                  margin-bottom: 5%;
                `}
                onPress={() => {
                  navigation.navigate('GoOut1');
                }}>
                <View
                  style={css`
                    height: 100%;
                    background-color: ${theme.color.white};
                    border-radius: 20px;
                    padding: 5%;
                    flex-direction: row;
                    align-items: center;
                  `}>
                  <View
                    style={css`
                      margin-right: 5%;
                    `}>
                    <Text
                      style={css`
                        font-weight: 500;
                        font-size: 18px;
                      `}>
                      나가기전 나가요잉으로
                    </Text>
                    <Text
                      style={css`
                        font-weight: 500;
                        font-size: 18px;
                      `}>
                      우리동의 부탁을 추천받아 볼까요?
                    </Text>
                  </View>
                  <StyledImage source={requestMan} />
                </View>
              </TouchableOpacity>
            </View>
          </Carousel>
        </View>
      </View>
      <View
        style={css`
          height: 70%;
          background-color: ${theme.color.gray0};
          padding-left: 20px;
          padding-right: 20px;
        `}>
        <TouchableOpacity
          style={css`
            height: 40%;
            margin-top: 7%;
            margin-bottom: 5%;
          `}>
          <View
            style={css`
              height: 100%;
              background-color: ${theme.color.white};
              border: 1px solid ${theme.color.gray300};
              border-radius: 20px;

              flex-direction: row;
              justify-content: center;
              align-items: center;
            `}>
            <View
              style={css`
                margin-right: 10px;
              `}>
              <BoxText>{userData.dongName}동에</BoxText>
              <BoxText>해줘요잉이</BoxText>
              <View
                style={css`
                  flex-direction: row;
                  align-items: flex-end;
                  text-align: end;
                `}>
                <BoxText
                  style={css`
                    font-weight: 700;
                    font-size: 33px;
                  `}>
                  {dongCount}건
                </BoxText>
                <BoxText> 있어요</BoxText>
              </View>

              <Text
                style={css`
                  margin-top: 5px;
                  color: ${theme.color.primary};
                `}>
                보러가기
              </Text>
            </View>

            <Image source={apartImage} />
          </View>
        </TouchableOpacity>
        <View
          style={css`
            height: 35%;
            background-color: ${theme.color.white};
            border: 1px solid ${theme.color.gray300};
            border-radius: 20px;
            margin-bottom: 5%;
            padding: 2%;
          `}>
          <View
            style={css`
              width: 100%;
              height: 25%;
              justify-content: center;
              align-items: center;
            `}>
            <Text
              style={css`
                font-size: 20px;
              `}>
              [{userData.nickname}] 님이 나온김에 할 일
            </Text>
          </View>
          <View
            style={css`
              width: 100%;
              height: 70%;
              justify-content: center;
              align-items: center;
            `}>
            {doItList.length > 0 ? (
              <Carousel
                showsControls={false}
                dotStyle={dotStyle}
                activeDotStyle={activeDotStyle}
                dotsContainerStyle={dotsContainerStyle}>
                {doItList.map((item: any, index: number) => (
                  <View
                    key={index}
                    style={css`
                      width: 100%;
                      height: 100%;
                      padding: 10px;
                      padding-left: 20px;
                      padding-right: 20px;
                    `}>
                    <View
                      style={css`
                        flex-direction: row;
                        justify-content: space-around;
                        width: 100%;
                        height: 100%;
                        align-items: center;
                      `}>
                      <View>
                        <Text
                          style={css`
                            font-size: 20px;
                            color: ${theme.color.gray300};
                          `}>
                          {item.requestInfo.dongName}동
                        </Text>
                        <Text
                          style={css`
                            font-size: 20px;
                            color: ${theme.color.gray300};
                          `}>
                          {item.requestInfo.hoName}호
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={css`
                            font-size: 20px;
                          `}>
                          {item.content}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </Carousel>
            ) : (
              <Text
                style={css`
                  font-size: 20px;
                  font-weight: 700;
                  color: ${theme.color.black};
                `}>
                진행 중인 일이 없습니다
              </Text>
            )}
          </View>
        </View>
      </View>
      <MainModal navigation={navigation} />
    </GlobalContainer>
  );
};

export default Home;
