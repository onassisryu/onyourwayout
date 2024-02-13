import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalButton, GlobalContainer, GlobalText} from '@/GlobalStyles';
import {WebView} from 'react-native-webview';
import ApartMarker from '@screens/Map/htmlCode/ApartMarker';
import Geolocation from 'react-native-geolocation-service';
import {useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import {Button} from 'react-native';
import Config from 'react-native-config';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import {isLoggedInState, userDataState, apartDataState} from '@/recoil/atoms';
import axiosAuth from '@/axios/axiosAuth';

type ButtonState = {
  title: string;
  status: boolean;
}[];

type Dong = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

interface ILocation {
  latitude: number;
  longitude: number;
}
const LocationHeader = styled.View`
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
`;

const LocationHeadText = styled.Text`
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
`;

const Category = styled(GlobalButton)<{selected: boolean}>`
  padding: 9px;
  padding-right: 12px;
  padding-left: 12px;
  border-radius: 10px;
  margin-right: 10px;
  border: ${({selected}) => (selected ? '1px solid #E6FBF4' : '1px solid #B2B2B2')};
  background-color: ${({selected}) => (selected ? '#E6FBF4' : 'white')};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: 13px;
  font-weight: bold;
  color: ${({selected, theme}) => (selected ? theme.color.primary : '#B2B2B2')};
`;

const MapContainer = styled.View`
  height: 100%;
`;

const Location = ({navigation}: any) => {
  const apartDongData = useRecoilValue(apartDataState);
  const userData = useRecoilValue(userDataState);
  let key = Config.KAKAO_JAVASCRIPT_KEY;

  const [location, setLocation] = useState<ILocation | null>(null);
  const [markers, setMarkers] = useState<Dong[]>([]);

  const [selectedButton, setSelectedButton] = useState<ButtonState>([
    {title: 'PET', status: true},
    {title: 'SHOP', status: true},
    {title: 'RECYCLE', status: true},
    {title: 'ETC', status: true},
  ]);
  const [selectAll, setSelectAll] = useState<boolean>(true);

  const getDongList = async () => {
    const filteredButtons = selectedButton.filter(button => button.status);
    const dealType = filteredButtons.map(button => button.title).join(',');
    console.log('api호출중', dealType);
    const res = await axiosAuth.get(`/deal/dong-list?dealType=${dealType}`);
    console.log('api호출후', res.data);

    const dongList = res.data;
    const updatedMarkers = apartDongData.filter(apart => dongList.includes(apart.dongId));
    console.log('updatedMarkers', updatedMarkers);
    setMarkers(updatedMarkers);
  };

  useEffect(() => {
    console.log(selectedButton);
    getDongList();
  }, [selectedButton]);

  const handleButtonClick = async (buttonName: string) => {
    if (selectAll === true) {
      setSelectAll(false);
      setSelectedButton(prevState =>
        prevState.map(button => {
          if (button.title === buttonName) {
            return {...button, status: true};
          } else {
            return {...button, status: false};
          }
        })
      );
    } else {
      setSelectedButton(prevState => {
        const updatedButtons = prevState.map(button => {
          if (button.title === buttonName) {
            return {
              ...button,
              status: !button.status,
            };
          }
          return button;
        });
        return updatedButtons;
      });
    }
  };
  // 위치 동의 얻기
  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }

  //위치 계삼 함수
  function getDongWithin50m(currentLocation: any, dongList: any) {
    const filteredDongList = dongList.filter(dong => {
      const distance = getDistance(currentLocation.lat, currentLocation.lng, dong.lat, dong.lng);
      console.log(distance, dong.name, dong.dongId);
      return distance <= 20;
    });

    return filteredDongList;
  }

  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRadian = angle => (Math.PI / 180) * angle;
    const distance = (a: number, b: number) => (Math.PI / 180) * (a - b);

    const RADIUS_OF_EARTH_IN_KM = 6371;
    const dLat = distance(lat2, lat1);
    const dLon = distance(lon2, lon1);

    lat1 = toRadian(lat1);
    lat2 = toRadian(lat2);

    // Haversine Formula
    const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.asin(Math.sqrt(a));

    let finalDistance = RADIUS_OF_EARTH_IN_KM * c * 1000; // 거리를 미터로 변환

    return Number(finalDistance.toFixed(2));
  }
  let lastDetectedDongs: any[] = [];

  const updateLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('내 현재 위치', position.coords.latitude, position.coords.longitude);
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const dongsWithin50m = getDongWithin50m(currentLocation, apartDongData);
        //동과 나의 위치
        const test = dongsWithin50m.filter(dong => lastDetectedDongs.dongId === dong.dongId);
        console.log('이미감지된동', lastDetectedDongs);
        // const isAlreadyDetected = lastDetectedDongs.some(detectedDong => detectedDong.dongId === dong.dongId);
        if (dongsWithin50m.length > 0) {
          dongsWithin50m.map(dong => {
            console.log('내 주변 동', dong.name, dong.dongId);
            // axiosAuth.get(`/notification/near/${dong.dongId}`);
          });
        }
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
    );
  };
  //현재 위치 받아오기
  useEffect(() => {
    setLocation(userData.apt);
    const getLocation = async () => {
      await requestPermissions();

      updateLocation();
      const intervalId = setInterval(updateLocation, 60000);

      return () => {
        clearInterval(intervalId);
      };
    };

    getLocation();
  }, []);

  return (
    <GlobalContainer
      style={css`
        height: 100%;
      `}>
      <LocationHeader>
        <LocationHeadText>{userData.apt.name}</LocationHeadText>
        <View
          style={css`
            flex-direction: row;
          `}>
          <Category selected={selectedButton[0].status} onPress={() => handleButtonClick('PET')}>
            <CategoryText selected={selectedButton[0].status}>반려동물 산책</CategoryText>
          </Category>
          <Category selected={selectedButton[1].status} onPress={() => handleButtonClick('SHOP')}>
            <CategoryText selected={selectedButton[1].status}>분리수거</CategoryText>
          </Category>
          <Category selected={selectedButton[2].status} onPress={() => handleButtonClick('RECYCLE')}>
            <CategoryText selected={selectedButton[2].status}>심부름</CategoryText>
          </Category>
          <Category selected={selectedButton[3].status} onPress={() => handleButtonClick('ETC')}>
            <CategoryText selected={selectedButton[3].status}>기타</CategoryText>
          </Category>
        </View>
      </LocationHeader>
      <MapContainer style={{backgroundColor: 'black'}}>
        {markers.length > 0 ? (
          <WebView
            originWhitelist={['*']}
            source={{html: ApartMarker(key, markers, location)}}
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
    </GlobalContainer>
  );
};

export default Location;
