import React, { useState, useEffect } from 'react';
import {View} from 'react-native';
import {GlobalButton, GlobalContainer, GlobalText} from '@/GlobalStyles';
import styled, {css} from '@emotion/native';
import axiosAuth from '@/axios/axiosAuth';
import axiosBasic from '@/axios/axios';
import DefaultButton from '@/components/DefaultButton';
import {getAccessToken} from '@/utils/common';
import {NavigationProp, RouteProp} from '@react-navigation/native';

import NoticeSettingsHeader from '@components/NoticeSettingspage/NoticeSettingsHeader';
import NoticeSettingsCategory from '@/components/NoticeSettingspage/NoticeSettingsCategory';
import NoticeSettingsContent from '@/components/NoticeSettingspage/NoticeSettingsContent';
import NoticeSettingsDong from '@/components/NoticeSettingspage/NoticeSettingsDong';

const SaveButton = styled(DefaultButton)`
  width: 88%;
  font-size: 18px;
  height: 50px;
  margin-left: 25px;
  padding: 10px;
  background-color: #00D282;
`;

type Category = {
  createdAt: string;
  dealType: string;
  deletedAt: string | null;
  id: number;
  member: number;
  modifiedAt: string;
};

type NotiDong = {
  createdAt: string;
  deletedAt: string | null;
  dongId: number;
  id: number;
  member: number;
  modifiedAt: string;
};

type ResponseData = {
  categories: Category[];
  memberId: number;
  notiDongs: NotiDong[];
  notificationEnd: string;
  notificationStart: string;
};

interface Props {
  navigation: NavigationProp<any>;
}

const NoticeSettings = ({navigation} : Props) => {
  const initialCategories = ['반려동물 산책', '분리수거', '심부름', '기타'];

  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectAllCategoriesText, setSelectAllCategoriesText] = useState('모두 선택');

  const [myDong, setMyDong] = useState('');
  const [myId, setMyId] = useState(0);
  const [dongsId, setDongsId] = useState<string[]>([]);
  const [selectedDongIds, setSelectedDongIds] = useState<string[]>([]);
  const [dongs, setDongs] = useState<string[]>(['']);
  const [selectedDongs, setSelectedDongs] = useState<string[]>([]);
  const [selectAllDongsText, setSelectAllDongsText] = useState('모두 선택');
  
  useEffect(() => {
    axiosAuth
      .get('/members/auth') // access token이 async에 저장되어 있난?
      .then(resp => {
        console.log('성공', resp.data);
        setMyDong(resp.data.dongName);
        setMyId(resp.data.id)

        axiosAuth
          .get(`apart/dong/${resp.data.aptId}`)
          .then(resp => {
              console.log('성공', resp.data.data);
          })
        })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);
  
    // 예시로 현재 시간을 해당 형식으로 변환
  function formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  const now = new Date();
  const formattedNow = formatTime(now);
  console.log(formattedNow); // "HH:mm:ss"

  const onSave = async () => {
    
    const notificationStart: Date = new Date();
    const notificationEnd: Date = new Date(notificationStart.getTime() + (1000 * 60 * 60)); // 1시간을 밀리초로 변환하여 더함

    const formattedStart: string = formatTime(notificationStart);
    const formattedEnd: string = formatTime(notificationEnd);

    const isNotiDongAll: boolean = selectedDongs.length === dongs.length;
    const isNotiCategoryAll: boolean = selectedCategories.length === categories.length;
    
    axiosAuth.post('/alarm/set', {
      memberId: myId,
      isNotiDongAll: isNotiDongAll,
      isNotiCategoryAll: isNotiCategoryAll,
      dealTypeList: isNotiCategoryAll ? [] : selectedCategories,
      dongIdList: isNotiDongAll ? [] : selectedDongIds,
      notificationStart: formattedStart,
      notificationEnd: formattedEnd
    })
    .then(response => {
      console.log(response.data);

    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <GlobalContainer
      style={css`
        height: 100%;
      `}>
      <NoticeSettingsHeader navigation={navigation}></NoticeSettingsHeader>
      <NoticeSettingsContent></NoticeSettingsContent>
      <NoticeSettingsCategory
        categories={categories}
        selectedCategories={selectedCategories}
        selectAllText={selectAllCategoriesText}
        setCategories={setCategories}
        setSelectedCategories={setSelectedCategories}
        setSelectAllText={setSelectAllCategoriesText} 
      ></NoticeSettingsCategory>
      <NoticeSettingsDong
        myDong={myDong}
        dongs={dongs}
        dongsId={dongsId}
        selectedDongIds={selectedDongIds}
        selectedDongs={selectedDongs}
        selectAllText={selectAllDongsText}
        setMyDong={setMyDong}
        setDongs={setDongs}
        setDongsId={setDongsId}
        setSelectedDongIds={setSelectedDongIds}
        setSelectedDongs={setSelectedDongs}
        setSelectAllText={setSelectAllDongsText}
      ></NoticeSettingsDong>
      <SaveButton title="저장하기" color="white" size="lg" onPress={onSave}/>

    </GlobalContainer>
  );
};

export default NoticeSettings;
