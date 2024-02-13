// 아파트 동 저장
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, Text, ScrollView} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import theme from '@/Theme';
import GoBack from '@/components/Signup/GoBack';
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
  top: 63px;
  ${({visible}) => !visible && 'opacity: 0;'};
`;

const Scroll = styled.View<{visible: boolean}>`
  ${({visible}) => !visible && 'opacity: 0;'};
`;

const Signup8 = ({navigation, route}: any) => {
  const [dong, setDong] = useState('');
  const [dongId, setDongId] = useState(0);
  const [ho, setHo] = useState('');
  const [donglist, setDonglist] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedDong, setIsFocusedDong] = useState(false);
  const aptId = route.params.apartid;
  useEffect(() => {
    setIsDisabled(!(dong && ho));
  }, [dong, ho]);

  const handleClearInput1 = () => {
    setDong('');
  };
  const handleClearInput2 = () => {
    setHo('');
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };
  const handleInputBlur = () => {
    setIsFocused(false);
  };
  const handleInputFocusDong = () => {
    setIsFocusedDong(true);
  };
  const handleInputBlurDong = () => {
    setIsFocusedDong(false);
  };

  const setUserSignUpData = useSetRecoilState(userSignUpDataState);
  const userSignUpData = useRecoilValue(userSignUpDataState);

  const updateDongAndHo = ({dongId, hoName}: {dongId: number; hoName: string}) => {
    setUserSignUpData(prevState => ({
      ...prevState,
      dongId: dongId,
      hoName: hoName,
    }));
  };

  const handleApartmentPress = dong => {
    setDong(`${dong.name}동`); // 아파트 이름으로 value 업데이트
    setDongId(dong.dongId);
    setIsFocusedDong(false);
  };

  function SetValue() {
    console.log(dongId);
    updateDongAndHo({dongId: dongId, hoName: ho});
    console.log(userSignUpData);
    navigation.navigate('Signup9a');
  }

  useEffect(() => {
    console.log('아파트 아이디', route.params);
    axiosBasic
      .get(`apart/dong/${aptId}`)
      .then(resp => {
        console.log('동정보 불러오기 성공', resp.data.data);
        setDonglist(resp.data.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <SignupBodyContainer>
        <SignupHeadtext title="동 호수를 입력해주세요"></SignupHeadtext>

        <View
          style={css`
            flex-direction: row;
          `}>
          <View
            style={css`
              width: 40%;
              position: relative;
              margin-right: 10px;
            `}>
            <InputContainer>
              <StyledInput
                placeholder="동"
                placeholderTextColor={theme.color.gray200}
                onChangeText={setDong}
                value={dong}
                onFocus={handleInputFocusDong}
                onBlur={handleInputBlur}
              />
              <IconWrapper onPress={handleClearInput1} visible={isFocusedDong && dong.length > 0}>
                <Ant name="closecircleo" size={20} color={theme.color.gray200} />
              </IconWrapper>
            </InputContainer>
            <Scroll visible={isFocusedDong} style={css``}>
              <ScrollView
                style={css`
                  height: 100px;
                `}>
                {donglist.map(dong => (
                  <TouchableOpacity
                    key={dong.id}
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ccc',
                    }}
                    onPress={() => {
                      handleApartmentPress(dong);
                    }}>
                    <Text>{dong.name}동</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Scroll>
          </View>
          <InputContainer
            style={css`
              width: 50%;
            `}>
            <StyledInput
              placeholder="호"
              placeholderTextColor={theme.color.gray200}
              onChangeText={setHo}
              value={ho}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
            <Text
              style={css`
                position: absolute;
                top: 56px;
                right: 40px;
                font-size: 20px;
              `}>
              호
            </Text>
            <IconWrapper onPress={handleClearInput2} visible={isFocused && ho.length > 0}>
              <Ant name="closecircleo" size={20} color={theme.color.gray200} />
            </IconWrapper>
          </InputContainer>
        </View>

        <NextButton title="다음" color="primary" size="lg" disabled={isDisabled} onPress={() => SetValue()} />
      </SignupBodyContainer>
    </GlobalContainer>
  );
};

export default Signup8;
