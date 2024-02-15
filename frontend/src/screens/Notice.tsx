import React, {useState} from 'react';
import {ScrollView} from 'react-native';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';

import NoticeHeader from '@components/Noticepage/NoticeHeader';
import NoticeTab from '@/components/Noticepage/NoticeTab';
import { useRecoilState } from 'recoil';
import { noticeCountState } from '@/recoil/atoms'; 

interface Props {
  navigation: NavigationProp<any>;
}

const Notice = ({navigation}: Props) => {

  const [noticeCount, setNoticeCount] = useRecoilState(noticeCountState);
  console.log(noticeCount)

  return (
    <ScrollView overScrollMode='never'>
      <NoticeHeader 
        navigation={navigation}
        noticeCount={noticeCount}
        setNoticeCount={setNoticeCount}
      />
      <NoticeTab
        noticeCount={noticeCount}
        setNoticeCount={setNoticeCount}
      />
    </ScrollView>
  );
};

export default Notice;
