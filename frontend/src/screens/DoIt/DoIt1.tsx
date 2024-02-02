import React from 'react';
import {css} from '@emotion/native';
import {ScrollView} from 'react-native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {NavigationProp} from '@react-navigation/native';
import DefaultButton from '@/components/DefaultButton';
import Header from '@/components/Header';
import {TouchableOpacity, Text} from 'react-native';
import Ant from 'react-native-vector-icons/AntDesign';
import styled from '@emotion/native';
import SvgIcon from '@components/SvgIcon';
import GoBack from '@components/Signup/GoBack';

interface Props {
  navigation: NavigationProp<any>;
}

const MainText = styled(GlobalText)`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
`;
const MainTextContainer = styled(GlobalContainer)`
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 80px;
  height: 100px;
`;
const MainButtonContainer = styled(GlobalContainer)`
  padding: 0 20px;
  margin-top: 20px;
  width: auto;
  height: 350px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: pink;
`;
const TypeButton = styled(GlobalButton)`
  width: 141px;
  height: 151px;
  margin: 10px;
  display: flex;
  //아래로
  flex-direction: column;
`;

const DoIt = ({navigation}: Props) => {
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <MainTextContainer>
        <MainText>이웃에게 어떤 일을</MainText>
        <MainText>부탁하신가요?</MainText>
      </MainTextContainer>
      <MainButtonContainer>
        <GlobalContainer>
          <TypeButton onPress={() => navigation.navigate('홈')}>
            <SvgIcon name="puppy" size={100}></SvgIcon>
            <GlobalText style={{fontWeight: 'bold'}}>반려동물 산책</GlobalText>
          </TypeButton>
          <TypeButton onPress={() => navigation.navigate('홈')}>
            <GlobalText>장보기</GlobalText>
          </TypeButton>
        </GlobalContainer>
        <GlobalContainer>
          <TypeButton onPress={() => navigation.navigate('홈')}>
            <GlobalText>분리수거</GlobalText>
          </TypeButton>
          <TypeButton onPress={() => navigation.navigate('홈')}>
            <GlobalText>wflw</GlobalText>
          </TypeButton>
        </GlobalContainer>
      </MainButtonContainer>
      <DefaultButton onPress={() => navigation.navigate('홈')} color="primary" title="test" />
      <GlobalText style={{fontSize: 100}}>DoIt</GlobalText>
    </GlobalContainer>
  );
};

export default DoIt;
