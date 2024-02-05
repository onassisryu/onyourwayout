import React, {useState} from 'react';
import {View} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled, {css} from '@emotion/native';
import {GlobalButton, GlobalContainer, GlobalText} from '@/GlobalStyles';
import {userDataState} from '../recoil/atoms';
const LocationHeader = styled.View`
  padding-right: 20px;
  padding-left: 20px;
  padding-bottom: 20px;
`;

const LocationHeadText = styled.Text`
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
`;

const Category = styled(GlobalButton)<{selected: boolean}>`
  padding: 9px;
  padding-right: 12px;
  padding-left: 12px;
  border-radius: 15px;
  margin-right: 10px;
  border: ${({selected}) => (selected ? '1px solid #E6FBF4' : '1px solid #B2B2B2')};
  background-color: ${({selected}) => (selected ? '#E6FBF4' : 'white')};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: 13px;
  font-weight: bold;
  color: ${({selected, theme}) => (selected ? theme.color.primary : theme.color.gray)};
`;

const MapContainer = styled.View`
  background-color: black;
  height: 100%;
`;

const Location = ({navigation}: any) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const userData = useRecoilValue(userDataState);
  const toggleCategory = (category: string) => {
    const index = selectedCategories.indexOf(category);
    if (index === -1) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  const isCategorySelected = (category: string) => {
    return selectedCategories.includes(category);
  };

  return (
    <GlobalContainer
      style={css`
        height: 100%;
      `}>
      <LocationHeader>
        <LocationHeadText>효자촌 그린타운</LocationHeadText>
        {/* <LocationHeadText>{userData.memberInfo.아파트정보}</LocationHeadText> */}
        <View
          style={css`
            flex-direction: row;
          `}>
          <Category selected={isCategorySelected('반려동물 산책')} onPress={() => toggleCategory('반려동물 산책')}>
            <CategoryText selected={isCategorySelected('반려동물 산책')}>반려동물 산책</CategoryText>
          </Category>
          <Category selected={isCategorySelected('분리수거')} onPress={() => toggleCategory('분리수거')}>
            <CategoryText selected={isCategorySelected('분리수거')}>분리수거</CategoryText>
          </Category>
          <Category selected={isCategorySelected('심부름')} onPress={() => toggleCategory('심부름')}>
            <CategoryText selected={isCategorySelected('심부름')}>심부름</CategoryText>
          </Category>
          <Category selected={isCategorySelected('기타')} onPress={() => toggleCategory('기타')}>
            <CategoryText selected={isCategorySelected('기타')}>기타</CategoryText>
          </Category>
        </View>
      </LocationHeader>
      <MapContainer></MapContainer>
    </GlobalContainer>
  );
};

export default Location;
