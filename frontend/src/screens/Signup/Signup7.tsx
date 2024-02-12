// 아파트 동 저장
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import theme from '@/Theme';
import GoBack from '@/components/Signup/GoBack';
import {NavigationProp} from '@react-navigation/native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '@/@types';
import SignupHeadtext from '@/components/Signup/SignupHeadtext';
import {SignupBodyContainer} from '@/components/Signup/SignupBodyContainer';
import NextButton from '@/components/Signup/NextButton';
import {userSignUpDataState} from '@/recoil/atoms';
import {useSetRecoilState, useRecoilValue} from 'recoil';
import axiosBasic from '@/axios/axios';
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
type SignUpScreenRouteProp = RouteProp<RootStackParamList, 'SignUp7'>;

interface Props {
  navigation: NavigationProp<any>;
}
const Signup7 = ({navigation}: Props) => {
  const {params} = useRoute<SignUpScreenRouteProp>();

  const [value, setValue] = useState('');
  const [aprtlist, setAprtlist] = useState([]);
  const [apartid, setApartid] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [filteredAprtList, setFilteredAprtList] = useState([]);

  useEffect(() => {
    setIsDisabled(!value);
    const filteredList = aprtlist.filter(apartment => apartment.name.includes(value));
    setFilteredAprtList(filteredList);
  }, [value, aprtlist]);

  const handleClearInput = () => {
    setValue('');
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const setUserSignUpData = useSetRecoilState(userSignUpDataState);
  const userSignUpData = useRecoilValue(userSignUpDataState);

  const updateaptId = (aptId: number) => {
    setUserSignUpData(prevState => ({
      ...prevState,
      aptId: aptId,
    }));
  };

  function SetValue() {
    console.log(userSignUpData);
    navigation.navigate('Signup8', {apartid});
  }

  useEffect(() => {
    axiosBasic
      .get(`apart/list/${params.code}?name=`)
      .then(resp => {
        console.log('성공', resp.data.data);
        setAprtlist(resp.data.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  const handleApartmentPress = (apartment: any) => {
    setValue(`${apartment.name}아파트`); // 아파트 이름으로 value 업데이트
    setApartid(apartment.id); // 아파트 ID로 apartid 업데이트
  };

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="거주하는 아파트를 골라주세요"></SignupHeadtext>
        <InputContainer>
          <StyledInput
            placeholder="아파트 이름 검색"
            placeholderTextColor={theme.color.gray200}
            onChangeText={setValue}
            value={value}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <IconWrapper onPress={handleClearInput} visible={isFocused && value.length > 0}>
            <Ant name="closecircleo" size={20} color={theme.color.gray200} />
          </IconWrapper>
        </InputContainer>

        <View>
          {filteredAprtList.map(apartment => (
            <TouchableOpacity
              key={apartment.id}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc',
              }}
              onPress={() => handleApartmentPress(apartment)}>
              <Text>{apartment.name}아파트</Text>
            </TouchableOpacity>
          ))}
        </View>

        <NextButton title="다음" color="primary" size="lg" disabled={isDisabled} onPress={() => SetValue()} />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

export default Signup7;
