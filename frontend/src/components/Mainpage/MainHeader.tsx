// import 내용
import React, { useState } from 'react';
import styled from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';
import { notificationIcon_black, mainLogo } from '~/icons';
import {
  View,
  TouchableOpacity,
} from 'react-native';

// 헤더 컨테이너
const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: white;
`;

// 나온김에 로고 이미지
const LogoImage = styled.Image`
  width: 128px;
  height: 30px; 
  resize-mode: contain;
`;

// 아이콘 컨테이너
const IconsContainer = styled.View`
  position: absolute;
  right: 15px; 
  top: 15px;
  flex-direction: row;
  justify-content: flex-end;
`;

// 알림 아이콘
const BellImage = styled.Image`
  width: 26px;
  height: 26px;
  margin-left: 16px;
`;

const BellNotifBadge = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
  position: absolute;
  right: 0;
`;

// 이미지 경로 정의

interface Props {
  navigation: NavigationProp<any>;
}

// 알림 아이콘 컴포넌트
const NotificationIcon = ({ navigation }: Props) => {
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);

  const handlePress = () => {
    navigation.navigate('Notice'); 
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <BellImage source={notificationIcon_black} />
      {hasNotifications && <BellNotifBadge />}
    </TouchableOpacity>
  );
};

// HeaderFunc 컴포넌트
const Header = ({ navigation }: Props) => {

  return (
    <View>
      <HeaderContainer>
        <LogoImage source={mainLogo} />
        <IconsContainer>
          <NotificationIcon navigation={navigation}/>
        </IconsContainer>
      </HeaderContainer>
    </View>
  );
};

export default Header;