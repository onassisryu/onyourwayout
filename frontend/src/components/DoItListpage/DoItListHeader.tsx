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
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const IconButton = styled(GlobalButton)`
  background-color: ${props => props.theme.color.white};
  margin: 0px 10px 0px 10px;
`;

interface Props {
  navigation: NavigationProp<any>;
  setSearchModalVisible: (state: boolean) => void;
}

const DoItListHeader = (props: Props) => {
  
  return (
    <Header>
      <IconContainer>
      <IconButton onPress={() => props.navigation.goBack()}>
        <SvgIcon name='backspace' size={30} ></SvgIcon>
      </IconButton>
      
      <IconButton onPress={() => props.setSearchModalVisible(true)}>
        <SvgIcon name='search' size={30} ></SvgIcon>
      </IconButton>
    </IconContainer>

    </Header>
  );
};

export default DoItListHeader;