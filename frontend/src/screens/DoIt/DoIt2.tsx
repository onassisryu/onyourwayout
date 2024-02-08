import React, {useState} from 'react';
import {css} from '@emotion/native';
import {ScrollView, View, TouchableOpacity, Text, Animated, useWindowDimensions} from 'react-native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {NavigationProp} from '@react-navigation/native';
import DefaultButton from '@/components/DefaultButton';
import Header from '@/components/Header';
import GoBack from '@components/Signup/GoBack';
import {RouteProp, useRoute} from '@react-navigation/native';
import styled from '@emotion/native';
import theme from '@/Theme';
import {useEffect} from 'react';
import SvgIcon from '@/components/SvgIcon';
import {RootStackParamList} from '@/@types';
import moment from 'moment';
import 'moment/locale/ko';
import Feather from 'react-native-vector-icons/Feather';
import Ant from 'react-native-vector-icons/AntDesign';
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';
import axiosAuth from '@/axios/axiosAuth';
import {getAccessToken} from '@/utils/common';
import axios from 'axios';
type DoItScreenRouteProp = RouteProp<RootStackParamList, 'DoIt2'>;

interface Props {
  navigation: NavigationProp<any>;
}
const StyledInputTitle = styled(GlobalText)`
  font-size: 18px;
  font-weight: 900;
  color: ${props => props.theme.color.black};
  margin-bottom: 12px;
`;
const StyledInput = styled.TextInput`
  width: 100%;
  font-size: 18px;
  color: ${props => props.theme.color.primary};
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid ${props => props.theme.color.primary};
  color: ${props => props.theme.color.black};
`;
const StyledInputContainer = styled.View`
  position: relative;
  margin-bottom: 20px;
`;
const IconWrapper = styled.View`
  position: absolute;
  left: 25px;
  top: 4px;
`;

type DealProps = {
  title: string;
  content: string;
  dealType: string;
  expireAtStr: string;
  cash: number;
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
  const formattedDate = `${oneHourLater.getFullYear() + 1}-${(oneHourLater.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${oneHourLater.getDate().toString().padStart(2, '0')} ${oneHourLater
    .getHours()
    .toString()
    .padStart(2, '0')}:${oneHourLater.getMinutes().toString().padStart(2, '0')}:${oneHourLater
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;

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
    content: '', //내용
    dealType: englishType, //거래유형
    expireAtStr: '2025-03-03 00:00:00', //만료시간
    cash: 0,
  });

  useEffect(() => {
    handleTitle();
    console.log(moment().fromNow());
  }, []);

  const handleTitle = () => {
    let text = '';
    if (params.type === '반려동물') {
      text = params.type + ' 산책 해주세요';
    } else {
      text = params.type + ' 해주세요';
    }
    setDeal({...deal, title: text});
  };
  const handleContents = (text: string) => {
    setDeal({...deal, content: text});
  };
  const handleCash = (text: string) => {
    const cashValue = parseFloat(text);
    setDeal({...deal, cash: cashValue});
  };
  const handleexpireAtStr = (text: string) => {
    setDeal({...deal, expireAtStr: text});
  };
  // handleexpireAtStr(formattedDate);
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
      duration: 300, // 애니메이션 지속 시간 (ms)
      useNativeDriver: true, // 네이티브 드라이버 사용 여부
    }).start();
  }, [selectedTab]);
  const {width} = useWindowDimensions();
  const moveValue = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2.4], // 화면의 반쪽으로 이동
  });
  const userData = useRecoilValue(userDataState);
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhQGdtYWlsIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTcwNzM1ODI4N30.qU7yh9VK8SNoDHVMSPIBiejonl6AFXeIui_3ONrz2YQ';

  const submitMultipart = (body: any) => {
    const formData = new FormData();
    formData.append('dto', JSON.stringify(body.jsonData));
    formData.append('dealImageFileList', body.dealImageFileList);

    console.log(JSON.stringify(body.jsonData));
    const instance = axios.create();
    return instance({
      url: 'http://i10a302.p.ssafy.io:8080/deal',
      method: 'post',
      data: formData,
      headers: {
        'Authorization':
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhQGdtYWlsIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTcwNzM1ODI4N30.qU7yh9VK8SNoDHVMSPIBiejonl6AFXeIui_3ONrz2YQ',
        'content-type': 'multipart/form-data',
      },
    });
  };

  function MakeDeal() {
    //   const jwtAccessToken =
    //     'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhQGdtYWlsIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTcwNzM1ODI4N30.qU7yh9VK8SNoDHVMSPIBiejonl6AFXeIui_3ONrz2YQ';

    //   // 만료 시간을 포함한 데이터 객체

    //   // FormData 객체를 생성합니다.
    //   const formData = new FormData();

    //   // data 객체의 각 속성을 FormData에 추가합니다.
    //   Object.entries(data).forEach(([key, value]) => {
    //     formData.append(`dto[${key}]`, value);
    //   });
    //   console.log(formData);
    //   try {
    //     // Axios 인스턴스 생성
    //     const axiosInstance = axios.create({
    //       baseURL: 'http://i10a302.p.ssafy.io:8080', // 기본 URL 설정
    //       headers: {
    //         'Authorization': `Bearer ${jwtAccessToken}`, // JWT access token 추가
    //         'Content-Type': 'multipart/form-data', // multipart/form-data 설정
    //       },
    //     });

    //     // multipart 요청 보내기
    //     const response = await axiosInstance.post('/deal', formData);

    //     console.log('성공', response.data);
    //   } catch (error) {
    //     console.error('데이터를 가져오는 중 오류 발생:', error);
    //   }
    const data = {
      title: '반려동물 산책시켜주세요',
      content: '저희 뽀삐 안물어요 1시간 산책시켜주세요',
      cash: 1110,
      dealType: 'PET',
      expireAtStr: '2024-03-03 00:00:00',
    };

    const body = {
      jsonData: data,
      dealImageFileList: '',
    };

    submitMultipart(body)
      .then(resp => {
        console.log('성공', resp.data);
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
        `}
        overScrollMode="never">
        <StyledInputTitle>제목</StyledInputTitle>
        <StyledInputContainer>
          <StyledInput
            style={css`
              padding-left: 70px;
            `}
            placeholder={deal.title}
            placeholderTextColor={theme.color.gray100}
            defaultValue=""
            onChangeText={handleTitle}
          />
          <IconWrapper>
            <SvgIcon name={params.icon} size={40} />
          </IconWrapper>
        </StyledInputContainer>
        <View
          style={css`
            flex-direction: row;
            justify-content: space-between;
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
              defaultValue={oneHourLaterTime}
              onChangeText={handleTitle}
            />
          </StyledInputContainer>
        </View>
        <View>
          <TouchableOpacity></TouchableOpacity>
        </View>
        <StyledInputTitle>사진</StyledInputTitle>
        <TouchableOpacity>
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
        </TouchableOpacity>

        <StyledInputTitle>거래방식&가격</StyledInputTitle>
        <View>
          <View
            style={css`
              flex-direction: row;
              background-color: ${theme.color.gray0};
              height: 40px;
              border-radius: 10px;
              font-weight: 700;
              margin-bottom: 20px;
              position: relative;
            `}>
            <Animated.View
              style={[
                {
                  zIndex: 0,
                  position: 'absolute',
                  backgroundColor: theme.color.black,
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
                      color: ${tabcolor === '현금' ? 'white' : theme.color.black};
                    `,
                  ]}
                  name="wallet"
                  size={30}
                />
                <Text
                  style={[
                    css`
                      z-index: 1;
                      font-size: 20px;
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
                      font-size: 20px;
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
                defaultValue=""
                onChangeText={handleCash}
              />
              <View
                style={css`
                  position: absolute;
                  top: 5px;
                  left: 290px;
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
                defaultValue=""
              />
            </StyledInputContainer>
          )}
        </View>
        <StyledInputTitle>상세정보</StyledInputTitle>
        <StyledInputContainer>
          <StyledInput
            style={css`
              height: 100px;
            `}
            placeholder={deal.title}
            placeholderTextColor={theme.color.gray100}
            defaultValue=""
            onChangeText={handleContents}
          />
        </StyledInputContainer>
        <DefaultButton onPress={() => MakeDeal()} color="primary" title="작성 완료" />
      </ScrollView>
    </GlobalContainer>
  );
};

export default DoIt2;
