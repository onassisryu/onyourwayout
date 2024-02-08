// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {GlobalText} from '@/GlobalStyles';
import GoBack from '@/components/Signup/GoBack';
import Header from '@/components/Header';

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: white;
  padding: 0 10px;
`;

const BackImage = styled.View`
  width: 25px;
  height: 25px;
`;

const NoticeTitle = styled(GlobalText)`
  font-weight: bold;
  font-size: ${theme.fontSize.subtitle};
  color: ${theme.color.black};
  padding-bottom: 5px;
`;

const NoticeSettingsHeader = () => {
  return (
    <Header>
      <GoBack />
      <NoticeTitle> 알림설정 </NoticeTitle>
      <BackImage />
    </Header>
  );
};

export default NoticeSettingsHeader;
