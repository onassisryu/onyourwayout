import React from 'react';
import {css} from '@emotion/native';
import {ScrollView} from 'react-native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {NavigationProp} from '@react-navigation/native';
import DefaultButton from '@/components/DefaultButton';

import {TouchableOpacity, Text} from 'react-native';
import Ant from 'react-native-vector-icons/AntDesign';
import styled from '@emotion/native';
import SvgIcon from '@components/SvgIcon';
import Header from '@/components/Header';
import GoBack from '@components/Signup/GoBack';
import {useState} from 'react';

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
`;
const TypeButton = styled(GlobalButton)<{selected: boolean}>`
  width: 151px;
  height: 161px;
  margin: 10px;
  display: flex;
  padding: 10px;
  padding-top: 20px;
  border-radius: 20px;
  justify-content: flex-start;
  align-items: center;
  //아래로
  flex-direction: column;
  background-color: ${({selected}) => (selected ? '#E6FBF4' : '#E9E9E9')};
`;
const TypeButtonText = styled(GlobalText)<{selected: boolean}>`
  font-size: 15px;
  font-weight: 700;
  position: absolute;
  bottom: 20px;
  color: ${({selected}) => (selected ? '#27D894' : '#B2B2B2')};
`;
const DoIt1 = ({navigation}: Props) => {
  const [selectedButton, setSelectedButton] = useState<string>('');

  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    let iconName = '';
    if (buttonName === '반려동물') {
      iconName = 'puppy';
    } else if (buttonName === '장보기') {
      iconName = 'shopping';
    } else if (buttonName === '분리수거') {
      iconName = 'bags';
    } else if (buttonName === '기타') {
      iconName = 'building';
    }

    navigation.navigate('DoIt2', {type: buttonName, icon: iconName});
  };
  return (
    <GlobalContainer
      style={css`
        justify-content: flex-start;
        height: 100%;
      `}>
      <Header>
        <GoBack />
      </Header>
      <MainTextContainer>
        <MainText>이웃에게 어떤 일을</MainText>
        <MainText>부탁하신가요?</MainText>
      </MainTextContainer>
      <MainButtonContainer>
        <GlobalContainer>
          <TypeButton selected={selectedButton === '반려동물'} onPress={() => handleButtonClick('반려동물')}>
            {selectedButton == '반려동물' ? <SvgIcon name="puppy" size={100} /> : <SvgIcon name="puppyOff" size={85} />}
            <TypeButtonText selected={selectedButton === '반려동물'}>반려동물 산책</TypeButtonText>
          </TypeButton>
          <TypeButton selected={selectedButton === '장보기'} onPress={() => handleButtonClick('장보기')}>
            {selectedButton == '장보기' ? (
              <SvgIcon name="shopping" size={100} />
            ) : (
              <SvgIcon name="shoppingOff" size={90} />
            )}
            <TypeButtonText selected={selectedButton === '장보기'}>장보기</TypeButtonText>
          </TypeButton>
        </GlobalContainer>
        <GlobalContainer>
          <TypeButton selected={selectedButton === '분리수거'} onPress={() => handleButtonClick('분리수거')}>
            {selectedButton == '분리수거' ? <SvgIcon name="bags" size={100} /> : <SvgIcon name="bagsOff" size={90} />}
            <TypeButtonText selected={selectedButton === '분리수거'}>분리수거</TypeButtonText>
          </TypeButton>
          <TypeButton selected={selectedButton === '기타'} onPress={() => handleButtonClick('기타')}>
            {selectedButton == '기타' ? (
              <SvgIcon name="building" size={100} />
            ) : (
              <SvgIcon name="buildingOff" size={90} />
            )}
            <TypeButtonText selected={selectedButton === '기타'}>기타</TypeButtonText>
          </TypeButton>
        </GlobalContainer>
        <GlobalButton
          onPress={() => {
            navigation.navigate('홈');
          }}></GlobalButton>
      </MainButtonContainer>
    </GlobalContainer>
  );
};

export default DoIt1;
