import React from 'react';
import {View} from 'react-native';
import {GlobalContainer} from '@/GlobalStyles';
import styled, {css} from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';

import NoticeSettingsHeader from '@components/NoticeSettingspage/NoticeSettingsHeader';
import NoticeSettingsCategory from '@/components/NoticeSettingspage/NoticeSettingsCategory';
import NoticeSettingsContent from '@/components/NoticeSettingspage/NoticeSettingsContent';

const NoticeSettings = () => {
  return (
    <GlobalContainer
      style={css`
        height: 100%;
      `}>
      <NoticeSettingsHeader></NoticeSettingsHeader>
      <NoticeSettingsContent></NoticeSettingsContent>
      <NoticeSettingsCategory></NoticeSettingsCategory>
    </GlobalContainer>
  );
};

export default NoticeSettings;
