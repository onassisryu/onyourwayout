import React, {useState} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled, {css} from '@emotion/native';
import {GlobalButton, GlobalContainer, GlobalText} from '@/GlobalStyles';
import {userDataState} from '@/recoil/atoms';
import {WebView} from 'react-native-webview';
import Map from '@screens/Map/htmlCode/Map';
import ApartMarker from '@screens/Map/htmlCode/ApartMarker';
import Geolocation from 'react-native-geolocation-service';
import {useEffect} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import {Button} from 'react-native';
import Config from 'react-native-config';
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
  border-radius: 15px;
  margin-right: 10px;
  border: ${({selected}) => (selected ? '1px solid #E6FBF4' : '1px solid #B2B2B2')};
  background-color: ${({selected}) => (selected ? '#E6FBF4' : 'white')};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: 13px;
  font-weight: bold;
  color: ${({selected, theme}) => (selected ? theme.color.primary : theme.color.gray)};
`;

const MapContainer = styled.View`
  height: 100%;
`;
interface ILocation {
  latitude: number;
  longitude: number;
}

const Location = ({navigation}: any) => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [test, setTest] = useState<boolean>(false);
  // const key = Config.KAKAO_JAVASCRIPT_KEY;
  const [markers, setMarkers] = useState<any[]>([
    {
      dongNo: '545217',
      bildName: '201',
      x: 127.0448914000001,
      y: 37.49904909908856,
    },
    {
      dongNo: '227627',
      bildName: '202',
      x: 127.04522710000013,
      y: 37.49906849908855,
    },
    {
      dongNo: '1000394',
      bildName: '203',
      x: 127.04593210000012,
      y: 37.49932509908855,
    },
    {
      dongNo: '956787',
      bildName: '204',
      x: 127.04647060000012,
      y: 37.499480999088554,
    },
    {
      dongNo: '1230262',
      bildName: '205',
      x: 127.0474082,
      y: 37.4998516,
    },
    {
      dongNo: '1230306',
      bildName: '206',
      x: 127.0479293,
      y: 37.5000126,
    },
    {
      dongNo: '547109',
      bildName: '207',
      x: 127.0484379,
      y: 37.5001584,
    },
  ]);
  const key = '4d3c782ec2cd76adf03897821a745bc2';
  const userData = useRecoilValue(userDataState);

  const toggleCategory = (category: string) => {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };
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
      Geolocation.getCurrentPosition(
        position => {
          console.log(position.coords.latitude, position.coords.longitude);
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
    getLocation();
  }, []);

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
          <Category selected={isCategorySelected('반려동물 산책')} onPress={() => toggleCategory('반려동물 산책')}>
            <CategoryText selected={isCategorySelected('반려동물 산책')}>반려동물 산책</CategoryText>
          </Category>
          <Category selected={isCategorySelected('분리수거')} onPress={() => toggleCategory('분리수거')}>
            <CategoryText selected={isCategorySelected('분리수거')}>분리수거</CategoryText>
          </Category>
          <Category selected={isCategorySelected('심부름')} onPress={() => toggleCategory('심부름')}>
            <CategoryText selected={isCategorySelected('심부름')}>심부름</CategoryText>
          </Category>
          <Category selected={isCategorySelected('기타')} onPress={() => toggleCategory('기타')}>
            <CategoryText selected={isCategorySelected('기타')}>기타</CategoryText>
          </Category>
          <Button
            title="지도 마커테스트"
            onPress={() => {
              console.log('지도 마커테스트');
              setTest(true);
            }}></Button>
        </View>
      </LocationHeader>
      <MapContainer style={{backgroundColor: 'black'}}>
        {location ? (
          test ? (
            <WebView
              originWhitelist={['*']}
              source={{html: ApartMarker(key, markers)}}
              javaScriptEnabled={true}
              injectedJavaScript={''}
            />
          ) : (
            <WebView
              originWhitelist={['*']}
              source={{html: Map(key, location)}}
              javaScriptEnabled={true}
              injectedJavaScript={''}
            />
          )
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
