import React, {useState} from 'react';
import styled, {css} from '@emotion/native';
import {ScrollView, View, TouchableOpacity, Text, Animated, useWindowDimensions} from 'react-native';
import {ImageURISource, Alert, Button, Image, StyleSheet} from 'react-native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import Header from '@/components/Header';
import GoBack from '@components/Signup/GoBack';
import {NavigationProp, RouteProp, useRoute} from '@react-navigation/native';
import theme from '@/Theme';
import {useEffect} from 'react';
import SvgIcon from '@/components/SvgIcon';
import {RootStackParamList} from '@/@types';
import moment from 'moment';
import 'moment/locale/ko';
import Feather from 'react-native-vector-icons/Feather';
import Ant from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';
import axiosAuth from '@/axios/axiosAuth';
import {getAccessToken} from '@/utils/common';
import DefaultButton from '@/components/DefaultButton';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';
import axios from 'axios';
import {parse} from 'path';
import {text} from 'stream/consumers';

type DoItScreenRouteProp = RouteProp<RootStackParamList, 'DoIt2'>;

interface Props {
  navigation: NavigationProp<any>;
}
const StyledInputTitle = styled(GlobalText)`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.color.black};
  margin-bottom: 12px;
`;
const StyledInput = styled.TextInput`
  width: 100%;
  font-size: 18px;
  padding: 10px;
  color: ${props => props.theme.color.primary};
  background-color: white;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.color.primary};
  color: ${props => props.theme.color.black};
`;
const StyledInputContainer = styled.View`
  position: relative;
  margin-bottom: 10px;
  margin-top: 8px;
  margin-bottom: 5px;
`;
const IconWrapper = styled.View`
  position: absolute;
  left: 20px;
  top: 4px;
`;
const MoneyButton = styled.TouchableOpacity`
  width: 90px;
  font-size: 20px;
  background-color: #e6fbf4;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: row;
  padding: 10px;
`;

type DealProps = {
  title: string;
  content: string;
  dealType: string;
  expireAtStr: string;
  cash: string;
  item: string;
};

const DoIt2 = ({navigation}: Props) => {
  const currentTime = new Date();
  const currentHour = String(currentTime.getHours()).padStart(2, '0');
  const currentMinute = String(currentTime.getMinutes()).padStart(2, '0');
  const defaultTime = `${currentHour}:${currentMinute}`;
  const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000); // 현재 시간에 1시간을 더함
  const oneHourLaterHour = String(oneHourLater.getHours()).padStart(2, '0');
  const oneHourLaterMinute = String(oneHourLater.getMinutes()).padStart(2, '0');
  const oneHourLaterTime = `${oneHourLaterHour}:${oneHourLaterMinute}`;

  const [time, setTime] = useState(oneHourLaterTime);

  const {params} = useRoute<DoItScreenRouteProp>();
  const convertType = (type: string): string => {
    switch (type) {
      case '반려동물':
        return 'PET';
      case '분리수거':
        return 'RECYCLE';
      case '장보기':
        return 'SHOP';
      case '기타':
        return 'ETC';
      default:
        return 'ETC';
    }
  };
  const englishType = convertType(params.type);

  const [deal, setDeal] = useState<DealProps>({
    title: '',
    content: '',
    dealType: englishType, //거래유형
    expireAtStr: convertTimeToExpireAtStr(time), //만료시간
    cash: '3000',
    item: '',
  });

  useEffect(() => {
    console.log('deal', deal);
  }, [deal]);

  useEffect(() => {
    handleTitle();
    console.log(moment().fromNow());
  }, []);
  const handleTime = (text: string) => {
    setTime(text);
    const expireAtStr = convertTimeToExpireAtStr(text);
    setDeal({...deal, expireAtStr: expireAtStr});
  };
  const handleTitle = () => {
    let text = '';
    if (params.type === '반려동물') {
      text = params.type + ' 산책 해주세요';
    } else {
      text = params.type + ' 해주세요';
    }
    setDeal({...deal, title: text, content: text});
  };
  const handleCash = (text: string) => {
    const cashValue = parseFloat(text);
    setDeal({...deal, cash: cashValue});
  };
  function convertTimeToExpireAtStr(time: string) {
    const [hour, minute] = time.split(':');
    const now = new Date();

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const selectedHour = hour.padStart(2, '0');
    const selectedMinute = minute.padStart(2, '0');
    const expireAtStr = `${year + 1}-${month}-${day} ${selectedHour}:${selectedMinute}:00`;

    return expireAtStr;
  }

  const [selectedTab, setSelectedTab] = useState<'현금' | '물물'>('현금');
  const [tabcolor, settabcolor] = useState<'현금' | '물물'>('현금');
  const [animatedValue] = useState(new Animated.Value(0));
  function TradeType() {
    if (selectedTab === '현금') {
      setSelectedTab('물물');
    } else {
      setSelectedTab('현금');
    }
    setTimeout(() => {
      if (tabcolor === '현금') {
        settabcolor('물물');
      } else {
        settabcolor('현금');
      }
    }, 200);
  }
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: selectedTab === '물물' ? 1 : 0,
      duration: 150, // 애니메이션 지속 시간 (ms)
      useNativeDriver: true, // 네이티브 드라이버 사용 여부
    }).start();
  }, [selectedTab]);
  const {width} = useWindowDimensions();
  const moveValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2.4], // 화면의 반쪽으로 이동
  });
  const userData = useRecoilValue(userDataState);

  const submitMultipart = async (body: any) => {
    const formData = new FormData();
    formData.append('dto', JSON.stringify(body.jsonData));
    formData.append('dealImageFileList', body.dealImageFileList);

    console.log(JSON.stringify(body.dealImageFileList));
    const instance = axios.create();
    return instance({
      url: 'http://i10a302.p.ssafy.io:8080/deal',
      method: 'post',
      data: formData,
      headers: {
        'Authorization': await getAccessToken(),
        'content-type': 'multipart/form-data',
      },
    });
  };
  const [img, setImg] = useState<ImageURISource>({
    uri: '',
  }); //setState를 대신하는 넘이랑 변수랑 같이 하기
  const [imageData, setImageData] = useState({});
  //버튼 동작
  //카메라 앱을 실행하는 기능 화살표 함수
  const showCamera = () => {
    //1. launchCamera 하기 위한 옵션 객체
    const options: CameraOptions = {
      //Property 'mediaType' is missing in type '{}' but required in type 'CameraOptions'
      mediaType: 'photo', //필수 속성
      cameraType: 'back',
      saveToPhotos: true,
      quality: 1,
      videoQuality: 'high',
    };

    //2. 촬영 결과를 받아오는 callback 메소드 등록
    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) Alert.alert('촬영취소');
      else if (response.errorMessage) Alert.alert('Error : ' + response.errorMessage);
      else {
        //이곳에 왔다면 이미지가 잘 촬영된 것
        //촬용된 이미지는 response 객체의 assets 라는 속성으로 전달됨
        if (response.assets != null) {
          //선택된 이미지 객체를 이미지뷰가 보여주는 state변수 img에 저장
          //선택된 이미지의 uri 경로 얻어오기
          const name = response.assets[0].fileName;
          const uri = response.assets[0].uri; //assets 여러개가 올수 있는데 중에 0번방 거
          const type = response.assets[0].type;
          const fileSize = response.assets[0].fileSize;
          const fileName = response.assets[0].fileName;

          console.log('이미지 파일입니다', response.assets[0]);

          const source = {uri: uri, type: type, fileSize: fileSize, name: fileName};
          setImageData(source);
        }
      }
    }); //파라미터로 응답객체 받음
  };

  //사진앱을 실행하는 기능 화살표 함수
  const showPhoto = async () => {
    //1. 옵션객체 만들기
    const option: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 5,
    };

    //callback 말고 async-await 문법 사용해보기!!!!!!
    //ES7의 새로운 문법 : async-await 문법 [callback 비동기 작업을 동기작업처럼 처리함]
    const response = await launchImageLibrary(option); //함수에 async가 붙어 있어야 함
    //결과를 기다렸다가 받아와라

    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error : ' + response.errorMessage);
    else {
      const uris: Asset[] = [];
      response.assets?.forEach(value => uris.push(value)); //선택한 사진 순서와 상관없이 들어옴
      const {uri, type, fileName, fileSize} = response.assets[0];
      const fileSizeLimit = 3 * 1024 * 1024;
      console.log('이미지 파일입니다', response.assets[0]);

      if (fileSize > fileSizeLimit) {
        // 파일 크기가 3MB를 초과하는 경우
        alert('이미지 파일 크기는 3MB를 초과할 수 없습니다.');
      } else {
        const source = {uri: uri, type: type, fileSize: fileSize, name: fileName};
        console.log('이미지 파일입니다', source);
        setImageData(source);
      }
    }
  };
  function MakeDeal() {
    let data = {
      title: deal.title,
      content: deal.content,
      dealType: deal.dealType,
      expireAtStr: deal.expireAtStr,
    };
    console.log('-----------------------------------------------------------------------');
    console.log(imageData);
    if (selectedTab === '현금') {
      data.cash = deal.cash;
    } else {
      data.item = deal.item;
    }
    console.log('33333333333333333333333', data);
    const body = {
      jsonData: data,
      dealImageFileList: Object.keys(imageData).length === 0 ? [] : imageData,
    };
    console.log('body 전송중', body);

    submitMultipart(body)
      .then(resp => {
        console.log(body);
        console.log('성공', resp.data);
        console.log('성공', resp.data.id);
        navigation.navigate('DoItListDetail', {id: resp.data.id});
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        //
      });
  }

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <ScrollView
        style={css`
          padding: 0 32px;
        `}>
        <StyledInputContainer>
          <StyledInput
            style={css`
              padding-left: 70px;
            `}
            placeholder={deal.title}
            placeholderTextColor={theme.color.gray100}
            defaultValue={deal.title}
            value={deal.title}
            onFocus={() => setDeal({...deal, title: ''})}
            onChangeText={text => setDeal({...deal, title: text})}
          />
          <IconWrapper>
            <SvgIcon name={params.icon} size={40} />
          </IconWrapper>
        </StyledInputContainer>
        <View
          style={css`
            flex-direction: row;
            justify-content: space-between;
            margin-bottom: 10px;
          `}>
          <StyledInputContainer
            style={css`
              width: 45%;
            `}>
            <StyledInputTitle>시작시간</StyledInputTitle>

            <StyledInput
              style={css`
                width: 100%;
                font-weight: 500;
                height: 40px;
                color: ${theme.color.gray300};
              `}
              defaultValue={defaultTime}
              editable={false}
            />
          </StyledInputContainer>
          <StyledInputContainer
            style={css`
              width: 45%;
            `}>
            <StyledInputTitle>종료시간</StyledInputTitle>

            <StyledInput
              style={css`
                width: 100%;
                font-weight: 500;
                height: 40px;
              `}
              placeholder={oneHourLaterTime}
              value={time}
              onFocus={() => setTime('')}
              onChangeText={text => {
                handleTime(text);
              }}
            />
          </StyledInputContainer>
        </View>
        <DefaultButton size="md" color="primary" title="카메라 앱 열기" onPress={showCamera}></DefaultButton>
        <TouchableOpacity onPress={showPhoto}>
          {Object.keys(imageData).length === 0 ? (
            <View
              style={css`
                width: 100%;
                height: 150px;
                background-color: ${theme.color.gray0};
                border-radius: 10px;
                margin-bottom: 20px;
                align-items: center;
                justify-content: center;
              `}>
              <Feather name="image" size={40} color={theme.color.gray300} />
              <Text
                style={css`
                  font-size: 15px;
                  font-weight: 700;
                  color: ${theme.color.gray300};
                  margin-top: 10px;
                `}>
                사진을 업로드 해주세요
              </Text>
            </View>
          ) : (
            <View
              style={css`
                width: 100%;
                height: 150px;
                border-radius: 10px;
                margin-bottom: 20px;
              `}>
              <Image
                style={css`
                  width: 100%;
                  height: 100%;
                  border-radius: 10px;
                `}
                source={imageData}
                resizeMode="contain"
              />
            </View>
          )}
        </TouchableOpacity>

        <View>
          <View
            style={css`
              flex-direction: row;
              background-color: ${theme.color.gray0};
              height: 32px;
              border-radius: 10px;
              margin-bottom: 10px;
              position: relative;
            `}>
            <Animated.View
              style={[
                {
                  zIndex: 0,
                  position: 'absolute',
                  backgroundColor: 'black',
                  borderRadius: 10,
                  height: '120%',
                  width: '50%',
                  top: '-10%',
                  transform: [{translateX: moveValue}],
                },
              ]}
            />
            <TouchableOpacity
              style={css`
                width: 50%;
                height: 100%;
                text-align: center;
                align-items: center;
                justify-content: center;
              `}
              onPress={() => TradeType()}>
              <View
                style={css`
                  flex-direction: row;
                `}>
                <FontAwesome
                  style={[
                    css`
                      z-index: 1;
                      margin-right: 10px;
                      color: ${tabcolor === '현금' ? 'white' : theme.color.black};
                    `,
                  ]}
                  name="dollar"
                  size={25}
                />
                <Text
                  style={[
                    css`
                      z-index: 1;
                      text-align: center;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      padding-top: 3px;
                      font-size: 15px;
                      color: ${tabcolor === '현금' ? 'white' : theme.color.black};
                    `,
                  ]}>
                  현금
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={css`
                width: 50%;
                height: 100%;
                align-items: center;
                justify-content: center;
              `}
              onPress={() => TradeType()}>
              <View
                style={css`
                  flex-direction: row;
                `}>
                <Ant
                  style={[
                    css`
                      z-index: 1;
                      margin-right: 10px;
                      color: ${tabcolor === '물물' ? 'white' : theme.color.black};
                    `,
                  ]}
                  name="wallet"
                  size={30}
                />
                <Text
                  style={[
                    css`
                      z-index: 1;
                      padding-top: 5px;
                      font-size: 15px;
                      color: ${tabcolor === '물물' ? 'white' : theme.color.black};
                    `,
                  ]}>
                  물물
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {tabcolor === '현금' ? (
            <StyledInputContainer>
              <StyledInput
                placeholder="가격을 입력해주세요"
                placeholderTextColor={theme.color.gray200}
                value={deal.cash}
                onChangeText={text => {
                  handleCash(text);
                }}
                onFocus={() => setDeal({...deal, cash: ''})}
                style={css`
                  text-align: right;
                  padding: 10px;
                  padding-right: 50px;
                `}
              />
              <View
                style={css`
                  position: absolute;
                  top: 20%;
                  right: 5%;
                `}>
                <Text
                  style={css`
                    font-size: 20px;
                    font-weight: 700;
                    color: ${theme.color.black};
                  `}>
                  원
                </Text>
              </View>
            </StyledInputContainer>
          ) : (
            <StyledInputContainer>
              <StyledInput
                placeholder="상품을 입력해주세요"
                placeholderTextColor={theme.color.gray100}
                value={deal.item}
                onChangeText={text => {
                  setDeal({...deal, item: text});
                }}
              />
            </StyledInputContainer>
          )}
        </View>
        <View
          style={css`
            flex-direction: row;
            justify-content: space-between;
            display: flex;
          `}>
          <MoneyButton
            onPress={() => {
              const number = parseInt(deal.cash) + 1000;
              setDeal({...deal, cash: number.toString()});
            }}>
            <FontAwesome name="plus" size={18} color="#27D894" />
            <Text
              style={css`
                color: ${theme.color.primary};
              `}>
              천원
            </Text>
          </MoneyButton>
          <MoneyButton
            onPress={() => {
              const number = parseInt(deal.cash) + 3000;
              setDeal({...deal, cash: number.toString()});
            }}>
            <FontAwesome name="plus" size={18} color="#27D894" />
            <Text
              style={css`
                color: ${theme.color.primary};
              `}>
              삼천원
            </Text>
          </MoneyButton>
          <MoneyButton
            onPress={() => {
              const number = parseInt(deal.cash) + 5000;
              setDeal({...deal, cash: number.toString()});
            }}>
            <FontAwesome name="plus" size={18} color="#27D894" />
            <Text
              style={css`
                color: ${theme.color.primary};
              `}>
              오천원
            </Text>
          </MoneyButton>
        </View>
        <StyledInputTitle
          style={css`
            margin-top: 10px;
            margin-bottom: 0px;
          `}>
          상세정보
        </StyledInputTitle>
        <StyledInputContainer>
          <StyledInput
            style={css`
              height: 60px;
              margin-bottom: 10px;
            `}
            placeholder={deal.content}
            placeholderTextColor={theme.color.gray100}
            value={deal.content}
            onFocus={() => setDeal({...deal, content: ''})}
            onChangeText={text => setDeal({...deal, content: text})}
          />
        </StyledInputContainer>
        <DefaultButton onPress={() => MakeDeal()} color="primary" title="작성 완료" />
      </ScrollView>
    </GlobalContainer>
  );
};

export default DoIt2;
