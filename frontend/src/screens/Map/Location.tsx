import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalButton, GlobalContainer, GlobalText} from '@/GlobalStyles';
import {WebView} from 'react-native-webview';
import Map from '@screens/Map/htmlCode/Map';
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
  const [location, setLocation] = useState<ILocation | null>(null);
  // const key = Config.KAKAO_JAVASCRIPT_KEY;

  const [selectedButton, setSelectedButton] = useState<ButtonState>([
    {title: 'PET', status: true},
    {title: 'SHOP', status: true},
    {title: 'RECYCLE', status: true},
    {title: 'ETC', status: true},
  ]);
  useEffect(() => {
    console.log(selectedButton);
  }, [selectedButton]);

  const [selectAll, setSelectAll] = useState<boolean>(true);
  const apartData = useRecoilValue(apartDataState);
  const [markers, setMarkers] = useState<Dong[]>([]);
  const getDongList = async () => {
    const filteredButtons = selectedButton.filter(button => button.status);
    const dealType = filteredButtons.map(button => button.title).join(',');
    console.log('api호출중', dealType);
    const res = await axiosAuth.get(`/deal/dong-list?dealType=${dealType}`);
    const dongList = res.data;
    const filteredApartData = apartData.filter(apart => dongList.includes(apart.dongId));
    const updatedMarkers = filteredApartData.map(apart => ({
      id: apart.dongId,
      name: apart.name,
      lat: apart.apartment.lat,
      lng: apart.apartment.lng,
    }));
    setMarkers(updatedMarkers);
  };

  useEffect(() => {
    console.log('useEffect실행중');
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
  let key = '4d3c782ec2cd76adf03897821a745bc2';
  const userData = useRecoilValue(userDataState);

  // 위치 동의 얻기
  async function requestPermissions() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
    }
  }
  //현재 위치 받아오기
  useEffect(() => {
    const getLocation = async () => {
      await requestPermissions();
      const updateLocation = () => {
        Geolocation.getCurrentPosition(
          position => {
            console.log('updateLocation', position.coords.latitude, position.coords.longitude);
            const targetLatitude = 37.12345;
            const targetLongitude = 126.54321;
            const distance = calculateDistance(
              position.coords.latitude,
              position.coords.longitude,
              targetLatitude,
              targetLongitude
            );

            // 100미터 이내에 위치한 경우 알림
            if (distance <= 100) {
              console.log('현재 위치는 특정 좌표의 100미터 이내에 있습니다.');
              // 알림 로직 추가
            }
            const {latitude, longitude} = position.coords;
            setLocation({
              latitude,
              longitude,
            });
          },
          error => {
            console.log(error.code, error.message);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000}
        );
      };

      updateLocation();
      const intervalId = setInterval(updateLocation, 10000);

      return () => {
        clearInterval(intervalId);
      };
    };

    getLocation();
  }, []);
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // 지구의 반지름 (미터)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  return (
    <GlobalContainer
      style={css`
        height: 100%;
      `}>
      <LocationHeader>
        <LocationHeadText>{userData.aptName}</LocationHeadText>
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
            source={{html: Map(key, markers)}}
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
