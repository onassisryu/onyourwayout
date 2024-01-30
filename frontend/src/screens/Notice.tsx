import React from 'react';
import {ScrollView} from 'react-native';
import styled from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';

import NoticeHeader from '@components/Noticepage/NoticeHeader'
import NoticeTab from '@components/Noticepage/NoticeTab'

interface Props {
    navigation: NavigationProp<any>;
  }
  
const Notice = ({navigation}: Props) => {
  return (
    <ScrollView>
      <NoticeHeader navigation={navigation}></NoticeHeader>
      <NoticeTab></NoticeTab>
    </ScrollView>

  );
};

export default Notice;
