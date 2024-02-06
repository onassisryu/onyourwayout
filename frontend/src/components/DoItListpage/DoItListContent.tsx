import React, { useState, useEffect } from 'react';
import styled, { css } from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import Feather from 'react-native-vector-icons/Feather';
import { NavigationProp, RouteProp } from '@react-navigation/native';

import { 
    TouchableOpacity, 
    Text,
    View,
    Animated,
    ImageSourcePropType,
    ScrollView
} from 'react-native';

const DoItListCardComponent = styled(ScrollView)`
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
  
`;

const DoItListButton = styled(GlobalButton)`
  padding-right: 260px;
  border-radius: 15px;
  background-color: white;
`;

const DoItListCard = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center; 
  width: 130px;
  height: 160px;
`; 

const DoItListImage = styled.Image`
  width: 130px;
  height: 160px;
  margin-right: 15px;
  resize-mode: cover;
  border-radius: 15px;
`;

const TextComponent = styled(GlobalContainer)`
  width: 230px;
  height: initial;
  flex-direction: column;
  align-items: flex-start;
`;

const ReportButton = styled(GlobalButton)`
  background-color: white;

`;

const TextTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  number-of-lines: 1
  font-weight: bold;
  margin-bottom: 1px;
`;

const TextApart = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color:  ${props => props.theme.color.gray};
  font-weight: bold;
  margin-bottom: 12px;
`;

const TextContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color:  ${props => props.theme.color.black};
  padding: 5px 0px 5px 0px;
`;

const TextPrice = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color:  ${props => props.theme.color.black};
  font-weight: bold;
  margin-bottom: 10px;
`;

const DistinctLine = styled.View`
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid #B2B2B2;
`;

interface DoListCard {
    id: number;
    category: string;
    image: ImageSourcePropType;
    title: string;
    apart: string;
    uptime: string;
    nickname: string;
    content: string;
    price: string;
    remaintime: string;
  };

interface Props {
    navigation: NavigationProp<any>;
    route: RouteProp<any>;
    selectedApartCategory: string;
    selectedTypeCategory: string;
    setReportModalVisible: (state: boolean) => void;
  }

const dogImage: ImageSourcePropType = require('images/dog.png');
const turtleImage: ImageSourcePropType = require('images/turtle.png');
const trashImage: ImageSourcePropType = require('images/trash3.png');
const workImage: ImageSourcePropType = require('images/convstore.png');

const DoItListContent = ({ navigation, route, selectedApartCategory, selectedTypeCategory, setReportModalVisible}: Props) => {
  
  const doListCards = [
    { id: 1,
      category: '반려동물 산책', 
      image: dogImage, 
      title: '하잉ㄹㄴㅇㅁㄻ낭ㄹㄴㅇasdasdasdas', 
      apart: '303동',
      uptime: '1분 전', 
      nickname: '박태양', 
      content: '뽀삐 아파트 산책ㅁㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇㄻㄴㅇsdfasdfafㄻㄴasdadsadㅇㄹ', 
      price: '10,000원',
      remaintime: '1시간'
    },
    { id: 2,
      category: '반려동물 산책', 
      image: turtleImage, 
      title: '하잉', 
      apart: '주변 200m',
      uptime: '1분 전', 
      nickname: '박태양', 
      content: '뽀삐 아파트 산책', 
      price: '10,000원',
      remaintime: '1시간'
    },
    { id: 3,
      category: '분리수거', 
      image: trashImage, 
      title: '하잉', 
      apart: '주변 500m',
      uptime: '1분 전', 
      nickname: '박태양', 
      content: '뽀삐 아파트 산책', 
      price: '10,000원',
      remaintime: '1시간'
    },
    { id: 4,
      category: '심부름', 
      image: workImage, 
      title: '하잉', 
      apart: '303동',
      uptime: '1분 전', 
      nickname: '박태양', 
      content: '뽀삐 아파트 산책', 
      price: '10,000원',
      remaintime: '1시간'
    },
    { id: 5,
      category: '기타', 
      image: turtleImage, 
      title: '하잉', 
      apart: '주변 500m',
      uptime: '1분 전', 
      nickname: '박태양', 
      content: '뽀삐 아파트 산책', 
      price: '10,000원',
      remaintime: '1시간'
    },
  ];

  // 카드 필터링
let filteredDoItListCards: DoListCard[] = doListCards;

// 아파트 카테고리와 타입 카테고리 둘 다 선택되지 않았으면 모든 카드를 반환
if (selectedApartCategory !== '' || selectedTypeCategory !== '') {
  filteredDoItListCards = doListCards.filter(card => {
    // 아파트 카테고리만 선택되었으면 아파트 카테고리에 맞는 카드만 반환
    if (selectedApartCategory !== '' && selectedTypeCategory === '') {
      return card.apart === selectedApartCategory;
    }
    // 타입 카테고리만 선택되었으면 타입 카테고리에 맞는 카드만 반환
    else if (selectedApartCategory === '' && selectedTypeCategory !== '') {
      return card.category === selectedTypeCategory;
    }
    // 아파트 카테고리와 타입 카테고리 둘 다 선택되었으면 둘 다 맞는 카드만 반환
    else {
      return card.apart === selectedApartCategory && card.category === selectedTypeCategory;
    }
  });
}
  
  return (

      <DoItListCardComponent>
      {filteredDoItListCards.map((card, index) => (
        <View key={index}>
          <DoItListButton onPress={() => navigation.navigate('DoItListDetail', { card: card })}>
            <DoItListCard>
              <DoItListImage source={card.image}/>
              <TextComponent>
                <ReportButton onPress={() => setReportModalVisible(true)} >
                  <Feather name='more-vertical' size= {25} style={css`position: absolute; top: 7px; left: 230px;`}></Feather>
                </ReportButton>
                <View style={css`
                  flex: 1;
                  margin-top: 10px;
                `}>
                  <TextTitle numberOfLines={1}>{card.title}</TextTitle>
                  <TextApart>{card.apart} / {card.uptime}</TextApart>
                  <View style={css`
                    height: 50px;
                    justify-content: center;
                  `}>
                    <TextContent numberOfLines={2}>{card.content}</TextContent>
                  </View>
                </View>
                <TextPrice>{card.price}</TextPrice>
              </TextComponent>
            </DoItListCard>
          </DoItListButton>
          <DistinctLine></DistinctLine>
        </View>
      
      ))}
    </DoItListCardComponent>

  );
};

export default DoItListContent;