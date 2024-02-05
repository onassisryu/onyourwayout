import React, {useState} from 'react';
import {css} from '@emotion/native';
import {ScrollView} from 'react-native';
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

type DoItScreenRouteProp = RouteProp<RootStackParamList, 'DoIt2'>;

interface Props {
  navigation: NavigationProp<any>;
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
type DealProps = {
  title: string;
  constents: string;
  dealType: string;
  expireAtStr: string;
  cash: number;
  item: string;
};

const DoIt2 = ({navigation}: Props) => {
  const [deal, setDeal] = useState<DealProps>({
    title: '',
    constents: '', //내용
    dealType: '', //거래유형
    expireAtStr: '', //만료시간
    cash: 0,
    item: '',
  });
  const {params} = useRoute<DoItScreenRouteProp>();
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
          <StyledInput placeholder={deal.title} placeholderTextColor={theme.color.gray100} defaultValue="" />
          <IconWrapper>
            <SvgIcon name={params.icon} size={40} />
          </IconWrapper>
        </StyledInputContainer>
        <DefaultButton onPress={() => navigation.navigate('위치')} color="primary" title="test" />
      </ScrollView>
    </>
  );
};

export default DoIt2;
