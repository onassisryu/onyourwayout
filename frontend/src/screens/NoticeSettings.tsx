import React from 'react';
import {View} from 'react-native';
import styled from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';

import NoticeSettingsHeader from '@components/NoticeSettingspage/NoticeSettingsHeader'
import NoticeSettingsContent from '@/components/NoticeSettingspage/NoticeSettingsContent'

interface Props {
    navigation: NavigationProp<any>;
}
  
const NoticeSettings = ({navigation} : Props) => {
  return (
    <View>
      <NoticeSettingsHeader navigation={navigation}></NoticeSettingsHeader>
      <NoticeSettingsContent></NoticeSettingsContent>
    </View>

  );
};

export default NoticeSettings;
