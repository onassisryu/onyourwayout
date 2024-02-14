// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {TouchableOpacity} from 'react-native';
import theme from '@/Theme';
import GoBack from '@/components/Signup/GoBack';
import Ant from 'react-native-vector-icons/AntDesign';
import Header from '@components/Header';

const HeaderContainer = styled(Header)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: white;
  padding-left: 15px;
  padding-right: 15px;
`;

const NoticeTitle = styled(GlobalText)`
  font-weight: bold;
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  padding-bottom: 5px;
`;

interface Props {
  navigation: NavigationProp<any>;
}

const NoticeHeader = ({navigation}: Props) => {
  return (
    <HeaderContainer>
      <GoBack />
      <NoticeTitle>알림  </NoticeTitle>
      <TouchableOpacity onPress={() => navigation.navigate('NoticeSettings')}>
        <Ant name="setting" size={30} color="gray" />
      </TouchableOpacity>
    </HeaderContainer>
  );
};

export default NoticeHeader;
