import React, { useState, useEffect } from 'react';
import styled, { css } from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import Feather from 'react-native-vector-icons/Feather';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import axiosAuth from '@/axios/axiosAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

interface DealImage {
  // DealImage에 대한 필드를 정의해주세요.
  // 예: id, url 등
}

interface DoListCard {
  id: number;
  title: string;
  content: string;
  requestId: number;
  acceptId: number | null;
  cash: number;
  item: any; // 'item'의 구조에 따라 적절한 타입을 지정해주세요.
  rewardType: string;
  complaint: number;
  dealStatus: string;
  dealType: string;
  expireAt: string;
  dealImages: DealImage[];
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
}

interface Props {
    navigation: NavigationProp<any>;
    selectedApartCategory: string;
    selectedTypeCategory: string;
    setReportModalVisible: (state: boolean) => void;
  }

const dogImage: ImageSourcePropType = require('images/dog.png');
const turtleImage: ImageSourcePropType = require('images/turtle.png');
const trashImage: ImageSourcePropType = require('images/trash3.png');
const workImage: ImageSourcePropType = require('images/convstore.png');

const DoItListContent = ({ navigation, selectedApartCategory, selectedTypeCategory, setReportModalVisible}: Props) => {
  
  const [doListCards, setDoListCards] = useState<DoListCard[]>([
    {
      "id": 50,
      "title": "title2",
      "content": "content2",
      "requestId": 13,
      "acceptId": null,
      "cash": 1110,
      "item": null,
      "rewardType": "CASH",
      "complaint": 0,
      "dealStatus": "OPEN",
      "dealType": "PET",
      "expireAt": "2025-03-03T00:00:00",
      "dealImages": [dogImage],
      "createdAt": "2024-02-02T14:47:35.251175",
      "modifiedAt": "2024-02-02T14:47:35.251175",
      "deletedAt": null
  },

  ]);

  let dong = '303동'

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      axiosAuth.get(`/deal/dong/list?dong=&dealType=`, {
        headers: {
          Authorization: `Bearer ${token}`, // 토큰을 Bearer 토큰으로 설정
        }
      })
        .then(response => {
          console.log(response.data);

          setDoListCards(response.data);
        })

        .catch(error => console.error(error));
    });
  }, []);


  // 카드 필터링
  let filteredDoItListCards: DoListCard[] = doListCards;

  // 아파트 카테고리와 타입 카테고리 둘 다 선택되지 않았으면 모든 카드를 반환
  if (selectedApartCategory !== '' || selectedTypeCategory !== '') {
    filteredDoItListCards = doListCards.filter(card => {
      // 아파트 카테고리만 선택되었으면 아파트 카테고리에 맞는 카드만 반환
      if (selectedApartCategory !== '' && selectedTypeCategory === '') {
        return dong === selectedApartCategory;
      }
      // 타입 카테고리만 선택되었으면 타입 카테고리에 맞는 카드만 반환
      else if (selectedApartCategory === '' && selectedTypeCategory !== '') {
        return dong === selectedTypeCategory;
      }
      // 아파트 카테고리와 타입 카테고리 둘 다 선택되었으면 둘 다 맞는 카드만 반환
      else {
        return dong === selectedApartCategory && card.dealType === selectedTypeCategory;
      }
    });
  }
  
  return (

      <DoItListCardComponent>
      {filteredDoItListCards.map((card, index) => (
        <View key={index}>
          <DoItListButton onPress={() => navigation.navigate('DoItListDetail', { card: card })}>
            <DoItListCard>
              <DoItListImage source={card.dealImages[0]}/>
              <TextComponent>
                <ReportButton onPress={() => setReportModalVisible(true)} >
                  <Feather name='more-vertical' size= {25} style={css`position: absolute; top: 7px; left: 230px;`}></Feather>
                </ReportButton>
                <View style={css`
                  flex: 1;
                  margin-top: 10px;
                `}>
                  <TextTitle numberOfLines={1}>{card.title}</TextTitle>
                  <TextApart>{dong} / {card.createdAt}</TextApart>
                  <View style={css`
                    height: 50px;
                    justify-content: center;
                  `}>
                    <TextContent numberOfLines={2}>{card.content}</TextContent>
                  </View>
                </View>
                <TextPrice>{card.cash}</TextPrice>
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