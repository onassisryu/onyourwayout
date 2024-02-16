// import 내용
import React, {useState, useEffect} from 'react';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import Header from '@/components/Header';
import styled from '@emotion/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {NavigationProp} from '@react-navigation/native';
import {View, TouchableOpacity, Text, ImageSourcePropType} from 'react-native';
import { useRecoilState } from 'recoil';
import { noticeCountState } from '@/recoil/atoms'; 

// 헤더 컨테이너
const HeaderContainer = styled(Header)`
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
`;

// 나온김에 로고 이미지
const StyledText = styled(GlobalText)`
  font-family: ${props => props.theme.font.clover};
  color: ${props => props.theme.color.primary};
  font-size: 27px;
`;

const EmptyView = styled.View`
  width: 28px;
  height: 28px;
`;

// 아이콘 컨테이너
const IconsContainer = styled(GlobalContainer)`
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



// HeaderFunc 컴포넌트
const MainHeader = ({navigation}: Props) => {

  const [noticeCount, setNoticeCount] = useRecoilState(noticeCountState)
  
  useEffect(() => {

  }, [noticeCount]); 

  return (
    <HeaderContainer>
      <EmptyView></EmptyView>
      <StyledText>나온김에</StyledText>
      <TouchableOpacity onPress={() => navigation.navigate('Notice')}>
        <Fontisto name="bell" size={28} color="gray" />
        {noticeCount > 0 && <BellNotifBadge />}
      </TouchableOpacity>
    </HeaderContainer>
  );
};

export default MainHeader;
