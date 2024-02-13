import Header from "@components/Header";
import React, { useState, useEffect } from 'react';
import styled, { css } from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import SvgIcon from "../SvgIcon";
import { NavigationProp } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Modal, TextInput, Button } from 'react-native';
import SearchModal from '@components/DoItListpage/SearchModal';

import { 
    TouchableOpacity, 
    Text,
    View,
    Animated,
} from 'react-native';

const IconContainer = styled(GlobalContainer)`
  justify-content: flex-end;
  flex-direction: row;
`;

const IconButton = styled(GlobalButton)`
  background-color: ${props => props.theme.color.white};
  margin: 0px 10px 0px 10px;
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
const NotificationIcon = ({navigation} : Props) => {
  const [hasNotifications, setHasNotifications] = useState<boolean>(true);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Notice')}>
      <Fontisto name="bell" size={28} color="gray" />
      {hasNotifications && <BellNotifBadge />}
    </TouchableOpacity>
  );
};

const DoItListHeader = ({ navigation }: Props) => {

  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  
  return (
    <Header>
      <IconButton onPress={() => navigation.goBack()}>
        <SvgIcon name='backspace' size={30} ></SvgIcon>
      </IconButton>
      <IconContainer>
        <IconButton onPress={() => setSearchModalVisible(true)}>
          <SvgIcon name='search' size={30} ></SvgIcon>
        </IconButton>
        <IconButton>
          <NotificationIcon navigation={navigation}/>
        </IconButton>
      </IconContainer>
      <SearchModal
        isSearchModalVisible={isSearchModalVisible}
        setSearchModalVisible={setSearchModalVisible}
        />
    </Header>
  );
};

export default DoItListHeader;