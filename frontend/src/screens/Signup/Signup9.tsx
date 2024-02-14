// 명세서 사진
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
import Feather from 'react-native-vector-icons/Feather';
import {userSignUpDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';
import axios from 'axios';

import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImagePickerResponse,
  ImageLibraryOptions,
  Asset,
} from 'react-native-image-picker';

const Signup9 = ({navigation}: any) => {
  const [isDisabled, setIsDisabled] = useState(true);
  const [imageData, setImageData] = useState({});
  const userSignUpData = useRecoilValue(userSignUpDataState);
  useEffect(() => {
    setIsDisabled(!imageData);
  }, [imageData]);

  const NextButton = styled(DefaultButton)`
    width: 100%;
    font-size: 18px;
    height: 50px;
    margin-top: 20px;
    padding: 10px;
    background-color: ${({disabled}) => (disabled ? theme.color.gray200 : theme.color.primary)};
  `;

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

          const souce = {uri: uri, type: type, fileSize: fileSize, name: fileName};
          setImageData(souce);
          // setImg(souce);
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
      const uri = response.assets[0].uri; //assets 여러개가 올수 있는데 중에 0번방 거
      const type = response.assets[0].type;
      const fileSize = response.assets[0].fileSize;
      const fileName = response.assets[0].fileName;

      console.log('이미지 파일입니다', response.assets[0]);

      const souce = {uri: uri, type: type, fileSize: fileSize, name: fileName};
      setImageData(souce);
    }
  };

  const submitMultipart = (body: any) => {
    const formData = new FormData();
    formData.append('dto', JSON.stringify(body.jsonData));
    formData.append('dealImageFileList', body.dealImageFileList);

    console.log(JSON.stringify(body.jsonData));
    const instance = axios.create();
    return instance({
      url: 'http://i10a302.p.ssafy.io:8080/members/signup',
      method: 'post',
      data: formData,
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
  };

  function signUpFinish() {
    console.log(userSignUpData);
    const body = {
      jsonData: userSignUpData,
      dealImageFileList: imageData,
    };

    submitMultipart(body)
      .then(resp => {
        console.log('성공', resp.data);
        navigation.navigate('Signup10');
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
      <SignupBodyContainer>
        <SignupHeadtext
          title="거주지 주소가 나온 
관리비 명세서를 업로드해주세요"></SignupHeadtext>
        <Text
          style={css`
            margin-top: 10px;
            color: ${theme.color.gray};
          `}>
          관리비 명세서를 인증받는데
        </Text>
        <Text
          style={css`
            color: ${theme.color.gray};
          `}>
          최대 1주일 정도의 시간이 소요됩니다
        </Text>
        <View
          style={css`
            margin-top: 30px;
          `}>
          <TouchableOpacity onPress={showPhoto}>
            {Object.keys(imageData).length === 0 ? (
              <View
                style={css`
                  width: 100%;
                  height: 200px;
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
              <Image
                source={imageData}
                style={css`
                  width: 100%;
                  height: 200px;
                  background-color: ${theme.color.gray0};
                  border-radius: 10px;
                  margin-bottom: 20px;
                `}
              />
            )}
          </TouchableOpacity>
        </View>

        <NextButton title="다음" color="primary" size="lg" disabled={isDisabled} onPress={() => signUpFinish()} />
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
export default Signup9;
