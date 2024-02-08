// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';

import {View, TouchableOpacity, ImageSourcePropType, Switch, TextInput} from 'react-native';
import {GlobalText, GlobalContainer, GlobalButton} from '@/GlobalStyles';

const SettingsComponent = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  height: initial;
  margin: 0 20px;
  margin-top: 20px;
`;

const CategorySettingsTitle = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  height: initial;
`;

const SettingsTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  margin-bottom: 15px;
`;

const AllSelectionButton = styled(GlobalButton)`
  background-color: white;
  margin-bottom: 5px;
  font-size: ${props => props.theme.fontSize.medium};
`;

const AllSelection = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  font-weight: 900;
`;

const CategoryComponent = styled(GlobalContainer)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 15px;
  height: initial;
`;

const Category = styled(GlobalButton)<{selected: boolean}>`
  width: 47%;
  border-radius: 15px;
  border: ${({selected}) => (selected ? '1px solid #E6FBF4' : '1px solid #B2B2B2')};
  margin: 5px;
  padding: 10px;
  background-color: ${({selected}) => (selected ? '#E6FBF4' : 'white')};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: ${props => props.theme.fontSize.medium};
  font-weight: bold;
  color: ${({selected}) => (selected ? `${theme.color.primary}` : `${theme.color.gray}`)};
`;


const NoticeSettingsCategory = () => {
  const categories = ['반려동물 산책', '분리수거', '심부름', '기타'];
  const [selectAllText, setSelectAllText] = useState('모두 선택');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const onSelectCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(selected => selected !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const onSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories);
    }
  };

  useEffect(() => {
    setSelectAllText(selectedCategories.length === categories.length ? '모두 해제' : '모두 선택');
  }, [selectedCategories]);

  return (
    <SettingsComponent>
      <CategorySettingsTitle>
        <SettingsTitle> 카테고리 설정 </SettingsTitle>
        <AllSelectionButton onPress={onSelectAllCategories}>
          <AllSelection> {selectAllText} </AllSelection>
        </AllSelectionButton>
      </CategorySettingsTitle>
      <CategoryComponent>
        <Category
          selected={selectedCategories.includes('반려동물 산책')}
          onPress={() => onSelectCategory('반려동물 산책')}>
          <CategoryText selected={selectedCategories.includes('반려동물 산책')}>반려동물 산책</CategoryText>
        </Category>
        <Category selected={selectedCategories.includes('분리수거')} onPress={() => onSelectCategory('분리수거')}>
          <CategoryText selected={selectedCategories.includes('분리수거')}>분리수거</CategoryText>
        </Category>
        <Category selected={selectedCategories.includes('심부름')} onPress={() => onSelectCategory('심부름')}>
          <CategoryText selected={selectedCategories.includes('심부름')}>심부름</CategoryText>
        </Category>
        <Category selected={selectedCategories.includes('기타')} onPress={() => onSelectCategory('기타')}>
          <CategoryText selected={selectedCategories.includes('기타')}>기타</CategoryText>
        </Category>
      </CategoryComponent>
    </SettingsComponent>
  );
};

export default NoticeSettingsCategory;
