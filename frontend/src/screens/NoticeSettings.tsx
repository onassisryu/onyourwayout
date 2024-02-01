import React from 'react';
import {View} from 'react-native';
import styled from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';

import NoticeSettingsHeader from '@components/NoticeSettingspage/NoticeSettingsHeader';
import NoticeSettingsContent from '@components/NoticeSettingspage/NoticeSettingsNormal';
import NoticeSettingsSound from '@components/NoticeSettingspage/NoticeSettingsSound';
import NoticeSettingsCategory from '@components/NoticeSettingspage/NoticeSettingsCategory';
import NoticeSettingsKeyword from '@components/NoticeSettingspage/NoticeSettingsKeyword';

interface Props {
    navigation: NavigationProp<any>;
}
  
const NoticeSettings = ({navigation} : Props) => {
  return (
    <View>
      <NoticeSettingsHeader navigation={navigation}></NoticeSettingsHeader>
      <NoticeSettingsContent></NoticeSettingsContent>
      <NoticeSettingsSound></NoticeSettingsSound>
      <NoticeSettingsCategory></NoticeSettingsCategory>
      <NoticeSettingsKeyword></NoticeSettingsKeyword>
    </View>

  );
};

export default NoticeSettings;
