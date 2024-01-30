// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {GlobalText} from '@/obalStyles';

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: white;
  padding-left: 15px;
  padding-right: 15px;
`;

const BackImage = styled.Image`
  width: 25px;
  height: 25px;
  resize-mode: contain;
`;

const SettingsImage = styled.Image`
  width: 25px;
  height: 25px;
  resize-mode: contain;
`;

const NoticeTitle = styled(GlobalText)`
  font-weight: bold;
  font-size: ${theme.fontSize.subtitle};
  color: ${theme.color.black}
  padding-bottom: 5px;
`;

interface Props {
  navigation: NavigationProp<any>;
}

const backImage: ImageSourcePropType = require('icons/back.png');
const settingsImage: ImageSourcePropType = require('icons/settings.png');

const NoticeHeader = ({navigation}: Props) => {
  return (
    <HeaderContainer>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <BackImage source={backImage}></BackImage>
      </TouchableOpacity>
      <NoticeTitle> 알림 </NoticeTitle>
      <TouchableOpacity onPress={() => navigation.navigate('NoticeSettings')}>
        <SettingsImage source={settingsImage}></SettingsImage>
      </TouchableOpacity>
    </HeaderContainer>
  );
};

export default NoticeHeader;
