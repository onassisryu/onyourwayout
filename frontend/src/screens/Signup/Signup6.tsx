// 지도

import React, {useEffect, useState} from 'react';
import {View, Button, Text, Image, TouchableOpacity, ImageURISource, Alert, StyleSheet} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import theme from '@/Theme';
import DefaultButton from '@/components/DefaultButton';
import GoBack from '@/components/Signup/GoBack';
import SignupHeadtext from '@/components/Signup/SignupHeadtext';
import {SignupBodyContainer} from '@/components/Signup/SignupBodyContainer';
// import {
//   launchCamera,
//   launchImageLibrary,
//   CameraOptions,
//   ImagePickerResponse,
//   ImageLibraryOptions,
//   Asset,
// } from 'react-native-image-picker';
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
  const [name, setName] = useState('');
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setIsDisabled(!name);
  }, [name]);

  const handleClearInput = () => {
    setName('');
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const NextButton = styled(DefaultButton)`
    width: 100%;
    font-size: 18px;
    height: 50px;
    margin-top: 20px;
    padding: 10px;
    background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
  `;

  //화면 갱신에 영향을 주는 특별한 변수 state 하지만 여긴 함수임 useState() 사용
  const [img, setImg] = useState<ImageURISource>({
    uri: 'https://cdn.pixabay.com/photo/2023/05/21/12/40/dog-8008483_1280.jpg',
  }); //setState를 대신하는 넘이랑 변수랑 같이 하기
  //제네릭 필수!!!

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
          const uri = response.assets[0].uri; //assets 여러개가 올수 있는데 중에 0번방 거

          const souce = {uri: uri};

          setImg(souce);
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

      //원래는 FlatList로 이미지 보여줘야하지만
      //첫번째 이미지만 보여주기
      setImg(uris[0]);
    }
  };
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="사진찍으셈"></SignupHeadtext>
        <View>
          <View>
            <Button title="show camera app" onPress={showCamera}></Button>
            <Button title="show photo app" color={'green'} onPress={showPhoto}></Button>
          </View>

          <Text style={style.text}>{img.uri}</Text>

          <Image source={img} style={style.img}></Image>
        </View>

        <NextButton
          title="다음"
          color="primary"
          size="lg"
          disabled={isDisabled}
          onPress={() => navigation.navigate('Signup2')}
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
