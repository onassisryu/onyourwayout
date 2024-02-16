import React, {useState, useEffect} from 'react';
import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import Ant from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity, Text, View, Modal, Animated, ImageSourcePropType} from 'react-native';
import {userDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';

const ApartSelectionComponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: flex-start;
  margin: 5px 0px 10px 15px;
  height: initial;
`;

const ApartSelectionText = styled(GlobalText)`
  font-weight: bold;
  flex-direction: row;
`;

const ApartSelectionButton = styled(GlobalButton)`
  background-color: white;
`;

const ApartCategoryComponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: flex-start;
  padding: 0px 20px 0px 15px;
  margin: 10px 5px 10px 0px;
  height: initial;
`;

const TypeCategoryComponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: flex-start;
  padding: 0px 20px 0px 15px;
  margin: 10px 5px 10px 0px;

  height: initial;
`;

const TypeCategory = styled(GlobalButton)<{selected: boolean}>`
  max-width: 200px;
  padding: 9px;
  border: ${({selected}) => (selected ? '1px solid #E6FBF4' : '1px solid #B2B2B2')};
  margin-right: 10px;
  background-color: ${({selected}) => (selected ? '#E6FBF4' : 'white')};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: ${props => props.theme.fontSize.small};
  font-weight: bold;
  padding: 2px 9px 2px 9px;
  color: ${props => (props.selected ? props.theme.color.primary : props.theme.color.gray)};
`;

interface Props {
  selectedApartCategory: string;
  setSelectedApartCategory: (category: string) => void;
  selectedTypeCategory: string;
  setSelectedTypeCategory: (category: string) => void;
  setApartModalVisible: (state: boolean) => void;
  selectedApart: string;
  setSelectedApart: (apart: string) => void;
}

// 카테고리 데이터
const typeCategories = ['반려동물 산책', '분리수거', '장보기', '기타'];

// 카테고리 컴포넌트
const CategoryComponent = ({name, selected, onSelect}: {name: string; selected: boolean; onSelect: () => void}) => (
  <TypeCategory selected={selected} onPress={onSelect}>
    <CategoryText selected={selected}>{name}</CategoryText>
  </TypeCategory>
);

const categoryToDealType = {
  '반려동물 산책': 'PET',
  '분리수거': 'RECYCLE',
  '심부름': 'SHOP',
  '기타': 'ETC',
};


const DoItListCategory = (props: Props) => {

  const userData = useRecoilValue(userDataState);

  return (
    <GlobalContainer
      style={css`
        height: initial;
      `}>
      <ApartSelectionComponent>
        <ApartSelectionButton onPress={() => props.setApartModalVisible(true)}>
          <ApartSelectionText>
            {' '}
            {userData.apt.name} {props.selectedApart ? `${props.selectedApart}동` : ''}
            <Ant
              name="down"
              size={17}
              style={css`
                margin-top: 2px;
              `}
            />
          </ApartSelectionText>
        </ApartSelectionButton>
      </ApartSelectionComponent>
      {/* <ApartCategoryComponent>
        {apartCategories.map(name => (
          <CategoryComponent
            key={name}
            name={name}
            selected={props.selectedApartCategory === name}
            onSelect={() => props.setSelectedApartCategory(props.selectedApartCategory === name ? '' : name)}
          />
        ))}
      </ApartCategoryComponent> */}
      <TypeCategoryComponent>
        {typeCategories.map(name => (
          <CategoryComponent
            key={name}
            name={name}
            selected={props.selectedTypeCategory === name}
            onSelect={() => props.setSelectedTypeCategory(props.selectedTypeCategory === name ? '' : name)}
          />
        ))}
      </TypeCategoryComponent>
    </GlobalContainer>
  );
};

export default DoItListCategory;
