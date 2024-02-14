// import 내용
import React, {useState, useEffect} from 'react';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import Header from '@/components/Header';
import styled from '@emotion/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {NavigationProp} from '@react-navigation/native';
import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';

// 헤더 컨테이너
const HeaderContainer = styled(Header)`
  flex-direction: row;
  justify-content: center;
  background-color: white;
`;

// 나온김에 로고 이미지
const StyledText = styled(GlobalText)`
  font-family: ${props => props.theme.font.clover};
  color: ${props => props.theme.color.primary};
  font-size: 27px;
`;

// 아이콘 컨테이너
const IconsContainer = styled(GlobalContainer)`
  position: absolute;
  right: 15px;
  top: 15px;
  flex-direction: row;
  justify-content: flex-end;
`;

// 알림 아이콘
const BellNotifBadge = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
  position: absolute;
  right: 0;
`;

interface Props {
  navigation: NavigationProp<any>;
}

// 알림 아이콘 컴포넌트
const NotificationIcon = ({navigation}: Props) => {
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);

  const handlePress = () => {
    navigation.navigate('Notice');
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Fontisto name="bell" size={28} color="gray" />
      {hasNotifications && <BellNotifBadge />}
    </TouchableOpacity>
  );
};

// HeaderFunc 컴포넌트
const MainHeader = ({navigation}: Props) => {
  return (
    <View>
      <HeaderContainer>
        <StyledText>나온김에</StyledText>
        <IconsContainer>
          <NotificationIcon navigation={navigation} />
        </IconsContainer>
      </HeaderContainer>
    </View>
  );
};

export default MainHeader;
