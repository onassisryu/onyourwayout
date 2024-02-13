// 지도

import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {
  View,
  Button,
  Text,
  Image,
  TouchableOpacity,
  ImageURISource,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import {WebView} from 'react-native-webview';
import Map from '@screens/Map/htmlCode/Map';
import Config from 'react-native-config';
import theme from '@/Theme';
import DefaultButton from '@/components/DefaultButton';
import GoBack from '@/components/Signup/GoBack';
import Geolocation from 'react-native-geolocation-service';
import SignupHeadtext from '@/components/Signup/SignupHeadtext';
import {SignupBodyContainer} from '@/components/Signup/SignupBodyContainer';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';

const MapContainer = styled.View`
  height: 400px;
  margin-top: 20px;
  border-radius: 10px;
  background-color: black;
`;

interface ILocation {
  latitude: number;
  longitude: number;
}
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

const IconWrapper = styled(TouchableOpacity)<{visible: boolean}>`
  position: absolute;
  right: 10px;
  bottom: 10px;
  ${({visible}) => !visible && 'opacity: 0;'};
`;

const Signup6 = ({navigation}: any) => {
  const key = Config.KAKAO_JAVASCRIPT_KEY;
  const [location, setLocation] = useState<ILocation | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [areaCode, setAreaCode] = useState('fsfsff');

  useEffect(() => {
    const getLocation = async () => {
      await Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLocation({
            latitude,
            longitude,
          });
          //법정동 기반 코드 구하기
          const url = 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json';
          const x = longitude; // x 좌표 값
          const y = latitude; // y 좌표 값
          const REST_API_KEY = Config.KAKAO_RESTAPI_KEY; // Kakao REST API 키를 입력해야 합니다.

          axios
            .get(url, {
              params: {
                x: x,
                y: y,
              },
              headers: {
                Authorization: `KakaoAK ${REST_API_KEY}`,
              },
            })
            .then(response => {
              console.log(response.data.documents[0].code);
              const code = response.data.documents[0].code;
              setAreaCode(code);
              setIsDisabled(true);
            })
            .catch(error => {
              console.error(error);
            });
        },
        error => {
          console.log(error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
      );
    };
    getLocation();
  }, []);

  const NextButton = styled(DefaultButton)`
    width: 100%;
    font-size: 18px;
    height: 50px;
    margin-top: 20px;
    padding: 10px;
    background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
  `;

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="위치인증을 해주세요"></SignupHeadtext>
        <MapContainer>
          {location ? (
            <WebView
              originWhitelist={['*']}
              source={{html: Map(key, location)}}
              javaScriptEnabled={true}
              injectedJavaScript={''}
            />
          ) : (
            <ActivityIndicator
              style={css`
                margin: auto;
              `}
              size="large"
              color="#00D282"
            />
          )}
        </MapContainer>
        <NextButton
          title="다음"
          color="primary"
          size="lg"
          disabled={!isDisabled}
          onPress={() => navigation.navigate('Signup7', {code: areaCode})}
        />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

const style = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
  },
  text: {
    padding: 8,
    color: 'black',
  },
  img: {
    marginTop: 8,
    flex: 1, //가로넓이는 alien-item이 관리하고 기본 스트래치로 되어 있음
  },
});
export default Signup6;
