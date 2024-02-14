// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {GlobalText} from '@/GlobalStyles';
import GoBack from '@/components/Signup/GoBack';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';

const BackImage = styled.View`
  width: 25px;
  height: 25px;
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

const NoticeSettingsHeader = ({navigation}: Props) => {
  return (
    <Header>
      <Ant
        name="arrowleft"
        size={40}
        color="black"
        onPress={() => navigation.navigate('Notice')}
      />
      <NoticeTitle> 알림설정 </NoticeTitle>
      <BackImage />
    </Header>
  );
};

export default NoticeSettingsHeader;
