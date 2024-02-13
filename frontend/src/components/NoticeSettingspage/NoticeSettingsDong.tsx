// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import axiosAuth from '@/axios/axiosAuth';

import {View, TouchableOpacity, ImageSourcePropType, Switch, TextInput} from 'react-native';
import {GlobalText, GlobalContainer, GlobalButton} from '@/GlobalStyles';

const SettingsComponent = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  height: initial;
  width: 88%;
  margin: 0 20px;

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

interface NoticeSettingsDongProps {
  myDong: string;
  dongs: string[];
  dongsId: string[];
  selectedDongIds: string[];
  selectedDongs: string[];
  selectAllText: string;
  setMyDong: (state: string) => void;
  setDongs: (state: string[]) => void;
  setDongsId: (state: string[]) => void;
  setSelectedDongIds: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedDongs: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectAllText: React.Dispatch<React.SetStateAction<string>>;
}

type ApartmentData = {
    apartment: {
        aptCode: string;
        areaCode: string;
        createdAt: null;
        deletedAt: null;
        id: number;
        lat: number;
        lng: number;
        modifiedAt: null;
        name: string;
    };
    dongId: number;
    name: string;
};

const NoticeSettingsDong = (props: NoticeSettingsDongProps) => {


  const onSelectCategory = (category: string) => {
    

    if (props.selectedDongs.includes(category)) {
      const index = props.selectedDongs.indexOf(category);
      props.setSelectedDongs(prevDongs => prevDongs.filter(selected => selected !== category));
      props.setSelectedDongIds(prevIds => prevIds.filter((_, idIndex) => idIndex !== index));
    } else {
      const index = props.dongs.indexOf(category);
      props.setSelectedDongs(prevDongs => prevDongs.concat(category));
      props.setSelectedDongIds(prevIds => prevIds.concat(props.dongsId[index]));
    }
    console.log(props.selectedDongs, props.selectedDongIds)
  };
  
  const onSelectAllCategories = () => {
    if (props.selectedDongs.length === props.dongs.length) {
      props.setSelectedDongs([]);
      props.setSelectedDongIds([]); // 모든 선택이 해제될 때 selectedDongIds도 초기화
    } else {
      props.setSelectedDongs(props.dongs);
      props.setSelectedDongIds(props.dongsId); // 모든 항목이 선택될 때 selectedDongIds에 모든 Id를 설정
    }
  };

    useEffect(() => {
      axiosAuth
        .get('/members/auth')
        .then(resp => {
          console.log('성공', resp.data);
          props.setMyDong(resp.data.dongName)
          axiosAuth
          .get(`apart/dong/${resp.data.aptId}`)
          .then(resp => {
              console.log('성공', resp.data.data);
              const categoryNames = resp.data.data.map((item: ApartmentData) => item.name);
              const categoryIds = resp.data.data.map((item: ApartmentData) => item.dongId);
              props.setDongs(categoryNames);
              props.setDongsId(categoryIds)
          })
        })
        .catch(error => {
          console.error('데이터를 가져오는 중 오류 발생:', error);
        });
    }, []);
  
    useEffect(() => {
      props.setSelectAllText(props.selectedDongs.length === props.dongs.length ? '모두 해제' : '모두 선택');
    }, [props.selectedDongs]);
  
    return (
      <SettingsComponent>
        <CategorySettingsTitle>
          <SettingsTitle> 아파트 동 설정 </SettingsTitle>
          <AllSelectionButton onPress={onSelectAllCategories}>
            <AllSelection> {props.selectAllText} </AllSelection>
          </AllSelectionButton>
        </CategorySettingsTitle>
        <CategoryComponent>
          {props.dongs.map(dong => (
            <Category
              key={dong}
              selected={props.selectedDongs.includes(dong)}
              onPress={() => onSelectCategory(dong)}>
              <CategoryText selected={props.selectedDongs.includes(dong)}>{dong}동{dong === props.myDong ? ' (내 아파트)' : ''}</CategoryText>
            </Category>
          ))}
        </CategoryComponent>
      </SettingsComponent>
    );
  };
  
  export default NoticeSettingsDong;