import React, {useState, useEffect} from 'react';
import {css} from '@emotion/native';
import {ScrollView, View, TouchableOpacity, Text, Animated, useWindowDimensions, Image} from 'react-native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {NavigationProp} from '@react-navigation/native';
import DefaultButton from '@/components/DefaultButton';
import Header from '@/components/Header';
import GoBack from '@components/Signup/GoBack';
import {RouteProp, useRoute} from '@react-navigation/native';
import styled from '@emotion/native';
import theme from '@/Theme';
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


const EditPage = ({ route, navigation } : any) => {
    const { data } = route.params;  // 수정할 게시물의 ID를 가져옵니다.
    const currentTime = new Date(data.createdAt);
    const currentHour = String(currentTime.getHours()).padStart(2, '0');
    const currentMinute = String(currentTime.getMinutes()).padStart(2, '0');
    const defaultTime = `${currentHour}:${currentMinute}`;
    const oneHourLater = new Date(currentTime.getTime() + 60 * 60 * 1000); // 현재 시간에 1시간을 더함
    const oneHourLaterHour = String(oneHourLater.getHours()).padStart(2, '0');
    const oneHourLaterMinute = String(oneHourLater.getMinutes()).padStart(2, '0');
    const oneHourLaterTime = `${oneHourLaterHour}:${oneHourLaterMinute}`;

    console.log(data)
    const formatNumber = (num: string) => {
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
    
    const [title, setTitle] = useState(data.title);  // 제목을 관리하는 상태
    const [expireAt, setExpireAt] = useState(data.expireAt);  // 제목을 관리하는 상태
    const [cash, setCash] = useState(formatNumber(data.cash.toString()));
    const [content, setContent] = useState(data.content);

    
    // 제목을 변경하는 핸들러 함수
    const handleTitleChange = (text: string) => {
      setTitle(text);
    };
    const handleExpireAtChange = (text: string) => {
        setExpireAt(text);
    };
    // 현금 데이터를 변경하는 핸들러 함수
    const handleCashChange = (text: string) => {
        const formattedText = formatNumber(text.replace(/,/g, ''));  // 쉼표를 제거한 후 새로운 값을 포맷팅합니다.
        setCash(formattedText);  // 현금 데이터를 업데이트합니다.
        };

    const handleContentChange = (text: string) => {
        setContent(text);
    };

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

  const editMultipart = (body: any) => {
    
    const formData = new FormData();
    formData.append('dto', JSON.stringify(body.jsonData));
    formData.append('dealImageFileList', body.dealImageFileList);

    console.log(JSON.stringify(body.jsonData));
    const instance = axios.create();
    return instance({
      url: `http://i10a302.p.ssafy.io:8080/deal/${data.id}`,
      method: 'put',
      data: formData,
      headers: {
        'Authorization':
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhQGdtYWlsIiwiYXV0aCI6IlJPTEVfVVNFUiIsImV4cCI6MTcwNzM1ODI4N30.qU7yh9VK8SNoDHVMSPIBiejonl6AFXeIui_3ONrz2YQ',
        'content-type': 'multipart/form-data',
      },
    });
  };

  function Edit() {

    const formatCash = (cash: string) => {
      return Number(cash.replace(/,/g, "")); // 쉼표를 제거하고, 숫자 형식으로 변환합니다.
    }
  
    const formatExpireAt = (expireAt: string) => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더해줍니다.
      const date = String(today.getDate()).padStart(2, '0');
  
      return `${year}-${month}-${date}T${expireAt}:00`; // "YYYY-MM-DDTHH:MM:SS" 형태로 만듭니다.
    }
  
      const data = {
        title: title,
        content: content,
        cash: formatCash(cash),  // 쉼표를 제거하고 숫자 형식으로 변환한 후 cash 데이터를 집어넣습니다.
        dealType: 'PET',
        expireAt: formatExpireAt(expireAt),  // ":00"을 추가한 형태로 expireAt 데이터를 집어넣습니다.
      };
  

    const body = {
      jsonData: data,
      dealImageFileList: '',
    };

    editMultipart(body)
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
            placeholder={data.title}
            placeholderTextColor={theme.color.gray100}
            defaultValue={title}  // 제목의 초기값을 설정합니다.
            onChangeText={handleTitleChange}  // 제목이 변경되면 이를 반영합니다.

          />
          <IconWrapper>
            {/* <SvgIcon name={params.icon} size={40} /> */}
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
              onChangeText={handleExpireAtChange}
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
                keyboardType="numeric"
                placeholderTextColor={theme.color.gray200}
                defaultValue={cash}  // 현금 데이터를 표시합니다.
                onChangeText={handleCashChange}  // 현금 데이터가 변경되면 이를 반영합니다.
                style={css`text-align: right; padding-right: 60px`}
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
                defaultValue={data.item}
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
            placeholder={data.content}
            placeholderTextColor={theme.color.gray100}
            defaultValue={content}  // 제목의 초기값을 설정합니다.
            onChangeText={handleContentChange}  // 제목이 변경되면 이를 반영합니다.
            // onChangeText={handleContents}
          />
        </StyledInputContainer>
        <DefaultButton color="primary" title="수정 완료" onPress={() => Edit()} />

      </ScrollView>
    </GlobalContainer>
  );
};

export default EditPage;
