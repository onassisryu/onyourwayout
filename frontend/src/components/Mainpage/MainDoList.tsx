import React, { useState } from 'react';
import styled from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import { 
    ScrollView, 
    View,
    ImageSourcePropType,
} from 'react-native';


const DoListComponent = styled(GlobalContainer)`
  padding: 15px;
`;

const DoListHeader = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
`;

const DoListTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  font-weight: bold;
  margin-right: 100px;
`;

const DoListSee = styled(GlobalButton)`
  background-color: #DCDCDC;
`;

const DoListSeeText = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color:  ${props => props.theme.color.gray};
  font-weight: bold;
`;

const CategoryComponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: flex-start;
  padding-left: 20px;
  padding-right: 20px;
`;

const Category = styled(GlobalButton)<{selected: boolean}>`
  max-width: 200px;
  padding: 9px;
  border-radius: 15px;
  border: ${({ selected }) => selected ? '1px solid #E6FBF4' : '1px solid #B2B2B2'}; 
  margin-right: 5px;
  background-color: ${({ selected }) => selected ? '#E6FBF4' : 'white'};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: ${props => props.theme.fontSize.small};
  font-weight: bold;
  padding-right: 10px;
  padding-left: 10px;
  color: ${props => props.selected ? props.theme.color.primary : props.theme.color.gray};
`;

const DoListCardComponent = styled(ScrollView)`
  flex-direction: row;  
  padding-right: 20px;
  padding-left: 20px;
  margin-top: 20px;
`;

const DoListCard = styled.View`
  width: 120px;
  height: 150px;
  margin-right: 10px;
`; 

const DoListImage = styled.ImageBackground`
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  overflow: hidden;
`;

const DoListType = styled(GlobalText)`
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: ${props => props.theme.fontSize.medium};
  color:  ${props => props.theme.color.white};
  font-weight: bold;
`;

const DoListContent = styled(GlobalText)`
  position: absolute;
  top: 110px;
  left: 5px;
  font-size: ${props => props.theme.fontSize.small};
  color:  ${props => props.theme.color.white};
  font-weight: bold;
`;

const DoListApart = styled(GlobalText)`
  position: absolute;
  top: 128px;
  left: 7px;
  font-size: ${props => props.theme.fontSize.short};
  color:  ${props => props.theme.color.white};
  font-weight: bold;
`;

interface DoListCard {
  category: string;
  image: ImageSourcePropType;
  type: string;
  content: string;
  apart: string;
};

const dogImage: ImageSourcePropType = require('images/dog.png');
const turtleImage: ImageSourcePropType = require('images/turtle.png');
const trashImage: ImageSourcePropType = require('images/trash3.png');
const workImage: ImageSourcePropType = require('images/convstore.png');

const MainDoList = () => {

  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const onSelectCategory = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory('');  
    } else {
      setSelectedCategory(category);  
    }
  };

    const doListCards = [
        { category: '반려동물 산책', image: dogImage, type: '아아', content: '뽀삐 아파트 산책', apart: '303동 / 박태양' },
        { category: '반려동물 산책', image: turtleImage, type: '아아', content: '뽀삐 아파트 산책', apart: '303동 / 박태양' },
        { category: '분리수거', image: trashImage, type: '아아', content: '뽀삐 아파트 산책', apart: '303동 / 박태양' },
        { category: '심부름', image: workImage, type: '아아', content: '뽀삐 아파트 산책', apart: '303동 / 박태양' },
        // ...
    ];

    const filteredDoListCards: DoListCard[] = selectedCategory === ''
    ? doListCards
    : doListCards.filter(card => card.category === selectedCategory);


    return (
        <View>
          
          <DoListComponent>
            <DoListHeader> 
              <DoListTitle> 이웃들에게 맡겨볼까요? </DoListTitle>
              <DoListSee onPress={() => {}}>
                <DoListSeeText> 모두 보기 </DoListSeeText>
              </DoListSee>
            </DoListHeader>
          </DoListComponent>
          <CategoryComponent>
            <Category selected={selectedCategory === '반려동물 산책'} onPress={() => onSelectCategory('반려동물 산책')}>
              <CategoryText selected={selectedCategory === '반려동물 산책'}>반려동물 산책</CategoryText>
            </Category>
            <Category selected={selectedCategory === '분리수거'} onPress={() => onSelectCategory('분리수거')}>
              <CategoryText selected={selectedCategory === '분리수거'}>분리수거</CategoryText>
            </Category>
            <Category selected={selectedCategory === '심부름'} onPress={() => onSelectCategory('심부름')}>
              <CategoryText selected={selectedCategory === '심부름'}>심부름</CategoryText>
            </Category>
            <Category selected={selectedCategory === '기타'} onPress={() => onSelectCategory('기타')}>
              <CategoryText selected={selectedCategory === '기타'}>기타</CategoryText>
            </Category>
          </CategoryComponent>
          <DoListCardComponent horizontal showsHorizontalScrollIndicator={false}>
            {filteredDoListCards.map((card, index) => (
            <View>
              <DoListCard key={index}>
                <DoListImage source={card.image}> 
                <DoListType> {card.type} </DoListType>
                <DoListContent> {card.content} </DoListContent>
                <DoListApart> {card.apart} </DoListApart>
                </DoListImage>
              </DoListCard>
            </View>
            ))}
          </DoListCardComponent>
          <DoListTitle> 이웃들에게 맡겨볼까요? </DoListTitle>
          <DoListTitle> 이웃들에게 맡겨볼까요? </DoListTitle>
          <DoListTitle> 이웃들에게 맡겨볼까요? </DoListTitle>

        </View>
                  
        
    );
};

export default MainDoList;