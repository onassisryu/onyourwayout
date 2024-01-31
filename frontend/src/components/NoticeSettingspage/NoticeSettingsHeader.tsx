// import 내용
import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';
import {
  View,
  TouchableOpacity,
  ImageSourcePropType
} from 'react-native';
import { GlobalText } from '@/GlobalStyles';

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: white;
  padding-left: 15px;
  padding-right: 15px;
`;

const BackImage = styled.Image<{ source?: ImageSourcePropType }>`
  width: 25px;
  height: 25px;
  resize-mode: contain;
`;


const NoticeTitle = styled(GlobalText)`
  font-weight: bold;
  font-size: ${ props => props.theme.fontSize.subtitle };
  color: ${ props => props.theme.color.black };
  padding-bottom: 5px;
`;


interface Props {
    navigation: NavigationProp<any>;
}

const backImage = require('icons/back.png');


const NoticeSettingsHeader = ({ navigation }: Props) => {

  return (
    <HeaderContainer>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <BackImage source={backImage}></BackImage>
      </TouchableOpacity>
      <NoticeTitle> 알림설정 </NoticeTitle>
      <BackImage/>
    </HeaderContainer>
  );
};

export default NoticeSettingsHeader;