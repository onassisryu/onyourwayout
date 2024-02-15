import Header from "@components/Header";
import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import SvgIcon from "../SvgIcon";
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Modal, TextInput, TouchableWithoutFeedback, Button, Animated, View, Dimensions} from 'react-native';


const IconContainer = styled(GlobalContainer)`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  width: 100%;
`;

const IconButton = styled(GlobalButton)`
  background-color: ${props => props.theme.color.white};
  margin: 0px 10px 0px 10px;
`;

const ModalBackground = styled(GlobalContainer)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0);
  justify-content: flex-start;
  align-items: flex-end;
  height: initial;
`;

const ModalComponent = styled(GlobalContainer)`
  height: initial;
  width: 280px;
  border: 2px solid #00d282;
  border-radius: 15px;
  background-color: white;
  padding: 0px 10px 0px 10px;
  justify-content: initial;
  align-items: initial;
  margin: 10px;
`;

const ModalInputComponent = styled(TextInput)`
  flex-direction: row;
  justify-content: flex-start;
  background-color: white;
  align-items: flex-start;
  text-align: left; 
  padding: 15px 10px 15px 0px;
`;

const ModalSubComponent = styled(GlobalButton)`
  position: absolute;
  top: 4px;
  right: 2px;
  justify-content: center;
  background-color: ${props => props.theme.color.primary};
  align-items: center;
  padding: 10px 2px 10px 2px;
  
  width: 25%;
`;

const ModalText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;

`;

interface DealImage {
  // DealImage에 대한 필드를 정의해주세요.
  imgUrl: string;

}

interface DoListCard {
  id: number;
  title: string;
  content: string;
  requestId: number;
  acceptId: number | null;
  cash: number;
  item: any;
  rewardType: string;
  complaint: number;
  dealStatus: string;
  dealType: string;
  expireAt: string;
  dealImages: DealImage[];
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  requestInfo: {
    dongId: number;
    dongName: string;
    requestType: string;
    requestContent: string;
    requestStatus: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
  };
}

interface Props {
  navigation: NavigationProp<any>;
  openSearch: boolean;
  setOpenSearch: (state: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;

}


const DoItListHeader = (props: Props) => {

  const slideAnim = useRef(new Animated.Value(700)).current;  // 초기값을 화면 오른쪽 밖으로 설정
  const iconSlideAnim = useRef(new Animated.Value(0)).current;  // 아이콘 애니메이션 초기값
  const windowWidth = Dimensions.get('window').width; // 추가

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      props.setOpenSearch(false);
    });

    return unsubscribe;
  }, [navigation]);

  const slideIn = () => {
    Animated.timing(slideAnim, {
      toValue: 0,  // 수정
      duration: 300,
      useNativeDriver: false  // 수정
    }).start();
  };
  
  const slideOut = () => {
    Animated.timing(slideAnim, {
      toValue: windowWidth,  // 수정
      duration: 300,
      useNativeDriver: false  // 수정
    }).start(() => props.setOpenSearch(false));
  };

  useEffect(() => {
    if (props.openSearch) {
      slideIn();
    } else {
      slideOut();
    }
  }, [props.openSearch]);


  return (
    <Header style={css`
      height: 80px;
    `}>
      <IconContainer>
        <IconButton onPress={() => props.navigation.goBack()}>
          <SvgIcon name='backspace' size={30} ></SvgIcon>
        </IconButton>
        <IconButton onPress={() => {props.setOpenSearch(true); slideIn()}}>
          <SvgIcon name='search' size={30} ></SvgIcon>
        </IconButton>


        {/* 검색창에 대한 Animated.View */}
        
        {props.openSearch ? (
          <Animated.View  
          style={{
            transform: [{ translateX: slideAnim }]  // slideAnim 적용
          }}
         >
          <TouchableWithoutFeedback onPress={slideOut}> 
            <ModalBackground>
              <ModalComponent>
                <ModalInputComponent 
                  placeholder="원하는 검색어를 입력하세요." 
                  onChangeText={text => props.setSearchTerm(text)}  
                />
                <ModalSubComponent onPress={slideOut}>
                  <ModalText>검색</ModalText>
                </ModalSubComponent>
              </ModalComponent>
            </ModalBackground>
          </TouchableWithoutFeedback>
          </Animated.View>) : (
            <></>
          )
        }
      </IconContainer>
    </Header>
  );
};

export default DoItListHeader;

