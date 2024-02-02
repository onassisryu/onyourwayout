import React, {useState} from 'react';
import {css} from '@emotion/native';
import {ScrollView} from 'react-native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {NavigationProp} from '@react-navigation/native';
import DefaultButton from '@/components/DefaultButton';
import Header from '@/components/Header';
import GoBack from '@components/Signup/GoBack';
import {RouteProp} from '@react-navigation/native';
import styled from '@emotion/native';
import theme from '@/Theme';
import {useEffect} from 'react';
import SvgIcon from '@/components/SvgIcon';
type RootStackParamList = {
  DoIt: {
    type: string;
    icon: 'puppy' | 'puppyOff' | 'bags' | 'bagsOff' | 'building' | 'buildingOff' | 'shopping' | 'shoppingOff';
  };
};
type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'DoIt'>;
interface Props {
  navigation: NavigationProp<any>;
  route: ProfileScreenRouteProp;
}

const StyledInput = styled.TextInput`
  width: 100%;
  font-size: 18px;
  color: ${props => props.theme.color.primary};
  background-color: white;
  margin-top: 20px;
  border-radius: 10px;
  border: 2px solid ${props => props.theme.color.gray200};
  padding: 10px;
  padding-left: 70px;
  border: 2px solid ${props => props.theme.color.primary};
  color: ${props => props.theme.color.primary};
`;
const StyledInputContainer = styled.View`
  position: relative;
`;
const IconWrapper = styled.View`
  position: absolute;
  left: 15px;
  top: 25px;
`;

const DoIt = ({navigation: {navigate}, route}: Props) => {
  const [title, setTitle] = useState('');
  useEffect(() => {
    handleTitle();
  }, []);
  const handleTitle = () => {
    let text = '';
    if (route.params.type === '반려동물') {
      text = route.params.type + ' 산책 해주세요';
    } else {
      text = route.params.type + ' 해주세요';
    }
    setTitle(text);
  };

  return (
    <>
      <Header>
        <GoBack />
      </Header>
      <ScrollView
        style={css`
          width: '100%';
          padding: 0 20px;
        `}>
        <StyledInputContainer>
          <StyledInput placeholder={title} placeholderTextColor={theme.color.gray100} defaultValue="" />
          <IconWrapper>
            <SvgIcon name={route.params.icon} size={40} />
          </IconWrapper>
        </StyledInputContainer>
        <DefaultButton onPress={() => navigate('홈')} color="primary" title="test" />
      </ScrollView>
    </>
  );
};

export default DoIt;
