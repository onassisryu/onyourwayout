import React, {useEffect} from 'react';
import {css} from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import styled from '@emotion/native';
import {useState} from 'react';
import {GlobalContainer, GlobalText, GlobalButton, GlobalComponent} from '@/GlobalStyles';
import SvgIcon from '@components/SvgIcon';
import Header from '@/components/Header';
import GoBack from '@components/Signup/GoBack';
import DefaultButton from '@/components/DefaultButton';

interface Props {
  navigation: NavigationProp<any>;
}

const MainText = styled(GlobalText)`
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  text-align: center;
`;
const MainTextContainer = styled(GlobalContainer)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-shrink: 0;
  margin-top: 40px;
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
const NextButton2 = styled(DefaultButton)`
  width: 100%;
  font-size: 18px;
  height: 50px;
  margin-top: 40px;
  padding: 10px;
`;
type ButtonState = {
  title: string;
  status: boolean;
}[];

const GoOut1 = ({navigation}: Props) => {
  const [selectedButton, setSelectedButton] = useState<ButtonState>([
    {title: 'PET', status: true},
    {title: 'SHOP', status: true},
    {title: 'RECYCLE', status: true},
    {title: 'ETC', status: true},
  ]);
  const [selectAll, setSelectAll] = useState<boolean>(true);
  useEffect(() => {
    console.log('시작');
  });

  const handleButtonClick = (buttonName: string) => {
    if (selectAll === true) {
      setSelectAll(false);
      setSelectedButton(prevState =>
        prevState.map(button => {
          if (button.title === buttonName) {
            return {...button, status: true};
          } else {
            return {...button, status: false};
          }
        })
      );
    } else {
      setSelectedButton(prevState => {
        const updatedButtons = prevState.map(button => {
          if (button.title === buttonName) {
            return {
              ...button,
              status: !button.status,
            };
          }
          return button;
        });
        return updatedButtons;
      });
    }
  };
  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <GlobalContainer
        style={css`
          justify-content: flex-start;
          align-items: center;
          height: 100%;
          padding-left: 20px;
          padding-right: 20px;
        `}>
        <MainTextContainer>
          <MainText>이웃의 어떤 일을</MainText>
          <MainText>해주실건가요?</MainText>
        </MainTextContainer>
        <MainButtonContainer>
          <GlobalComponent>
            <TypeButton selected={selectedButton[0].status} onPress={() => handleButtonClick('PET')}>
              {selectedButton[0].status ? <SvgIcon name="puppy" size={100} /> : <SvgIcon name="puppyOff" size={85} />}
              <TypeButtonText selected={selectedButton[0].status}>반려동물 산책</TypeButtonText>
            </TypeButton>
            <TypeButton selected={selectedButton[1].status} onPress={() => handleButtonClick('SHOP')}>
              {selectedButton[1].status ? (
                <SvgIcon name="shopping" size={100} />
              ) : (
                <SvgIcon name="shoppingOff" size={90} />
              )}
              <TypeButtonText selected={selectedButton[1].status}>장보기</TypeButtonText>
            </TypeButton>
          </GlobalComponent>
          <GlobalComponent>
            <TypeButton selected={selectedButton[2].status} onPress={() => handleButtonClick('RECYCLE')}>
              {selectedButton[2].status ? <SvgIcon name="bags" size={100} /> : <SvgIcon name="bagsOff" size={90} />}
              <TypeButtonText selected={selectedButton[2].status}>분리수거</TypeButtonText>
            </TypeButton>
            <TypeButton selected={selectedButton[3].status} onPress={() => handleButtonClick('ETC')}>
              {selectedButton[3].status ? (
                <SvgIcon name="building" size={100} />
              ) : (
                <SvgIcon name="buildingOff" size={90} />
              )}
              <TypeButtonText selected={selectedButton[3].status}>기타</TypeButtonText>
            </TypeButton>
          </GlobalComponent>
        </MainButtonContainer>
        <NextButton2
          title="다음"
          color="primary"
          size="lg"
          onPress={() => {
            navigation.navigate('GoOut2', {selectedButton});
          }}></NextButton2>
      </GlobalContainer>
    </GlobalContainer>
  );
};

export default GoOut1;
