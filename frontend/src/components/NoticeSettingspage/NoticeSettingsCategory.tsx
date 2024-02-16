// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import axiosAuth from '@/axios/axiosAuth';
import {View, TouchableOpacity, ImageSourcePropType, Switch, TextInput} from 'react-native';
import {GlobalText, GlobalContainer, GlobalButton} from '@/GlobalStyles';
import {useRecoilState, useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';

const SettingsComponent = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  height: initial;
  width: 88%;
  margin: 20px 20px 20px 20px;
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
  margin-bottom: 10px;
  padding: 10px;
  background-color: ${({selected}) => (selected ? '#E6FBF4' : 'white')};
`;

const CategoryText = styled(GlobalText)<{selected: boolean}>`
  font-size: ${props => props.theme.fontSize.medium};
  font-weight: bold;
  color: ${({selected}) => (selected ? `${theme.color.primary}` : `${theme.color.gray}`)};
`;

const DistinctLine = styled.View`
  width: 95%;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border: 0.5px solid #b2b2b2;
  background-color: #b2b2b2;
`;

interface NoticeSettingsCategoryProps {
  categories: string[];
  selectedCategories: string[];
  selectAllText: string;
  setCategories: (state: string[]) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectAllText: React.Dispatch<React.SetStateAction<string>>;
}

type CategoryValue = 'PET' | 'RECYCLE' | 'SHOP' | 'ETC';

interface Category {
  dealType: CategoryValue;
  // 필요한 경우 다른 필드를 추가할 수 있습니다.
}

const NoticeSettingsCategory = (props: NoticeSettingsCategoryProps) => {
  const [userData, setUserData] = useRecoilState(userDataState);

  const onSelectCategory = (category: string) => {
    let value: CategoryValue;
    switch (category) {
      case '반려동물 산책':
        value = 'PET';
        break;
      case '분리수거':
        value = 'RECYCLE';
        break;
      case '심부름':
        value = 'SHOP';
        break;
      case '기타':
        value = 'ETC';
        break;
      default:
        return; // 알 수 없는 카테고리 이름이 들어온 경우 함수를 종료합니다.
    }

    if (props.selectedCategories.includes(value)) {
      props.setSelectedCategories(props.selectedCategories.filter(selected => selected !== value));
    } else {
      props.setSelectedCategories([...props.selectedCategories, value]);
    }
    console.log(props.selectedCategories);
  };

  const onSelectAllCategories = () => {
    if (props.selectedCategories.length === props.categories.length) {
      props.setSelectedCategories([]);
    } else {
      props.setSelectedCategories(['PET', 'RECYCLE', 'SHOP', 'ETC']);
    }
    console.log(props.selectedCategories);
  };

  useEffect(() => {
    axiosAuth
      .get(`/alarm/get/${userData.id}`)
      .then(resp => {
        console.log('성공----------------', resp.data);
        // resp.data.categories를 이용하여 selectedCategories 상태를 업데이트합니다.
        const selectedCategories = resp.data.categories.map((category: Category) => category.dealType);
        props.setSelectedCategories(selectedCategories);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []); // 의존성 배열에서 props.selectedCategories를 제거했습니다.

  useEffect(() => {
    const selectedValues = ['PET', 'RECYCLE', 'SHOP', 'ETC'];
    props.setSelectAllText(props.selectedCategories.length === selectedValues.length ? '모두 해제' : '모두 선택');
  }, [props.selectedCategories]); // 별도의 useEffect로 분리했습니다.

  return (
    <SettingsComponent>
      <CategorySettingsTitle>
        <SettingsTitle> 카테고리 설정 </SettingsTitle>
        <AllSelectionButton onPress={onSelectAllCategories}>
          <AllSelection> {props.selectAllText} </AllSelection>
        </AllSelectionButton>
      </CategorySettingsTitle>
      <CategoryComponent>
        <Category selected={props.selectedCategories.includes('PET')} onPress={() => onSelectCategory('반려동물 산책')}>
          <CategoryText selected={props.selectedCategories.includes('PET')}>반려동물 산책</CategoryText>
        </Category>
        <Category selected={props.selectedCategories.includes('RECYCLE')} onPress={() => onSelectCategory('분리수거')}>
          <CategoryText selected={props.selectedCategories.includes('RECYCLE')}>분리수거</CategoryText>
        </Category>
        <Category selected={props.selectedCategories.includes('SHOP')} onPress={() => onSelectCategory('심부름')}>
          <CategoryText selected={props.selectedCategories.includes('SHOP')}>심부름</CategoryText>
        </Category>
        <Category selected={props.selectedCategories.includes('ETC')} onPress={() => onSelectCategory('기타')}>
          <CategoryText selected={props.selectedCategories.includes('ETC')}>기타</CategoryText>
        </Category>
      </CategoryComponent>
      <DistinctLine></DistinctLine>
    </SettingsComponent>
  );
};

export default NoticeSettingsCategory;
