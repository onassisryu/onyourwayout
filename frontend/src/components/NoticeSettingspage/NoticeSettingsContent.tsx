// import 내용
import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';

import {View, TouchableOpacity, ImageSourcePropType} from 'react-native';
import {GlobalText} from '@/obalStyles';

const SettingsComponent = styled.View`
  margin-left: 30px;
  margin-right: 30px;
  margin-top: 20px;
`;

const SettingsTitle = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: bold;
  margin-bottom: 15px;
`;

const SettingsContent = styled(GlobalText)`
  flex-direction: row;
  justify-content: space-between;
  font-size: ${theme.fontSize.small};
  color: ${theme.color.black};
  font-weight: 900;
  margin-bottom: 20px;
`;

const NoticeSettingsContent = () => {
  return (
    <SettingsComponent>
      <SettingsTitle> 일반 </SettingsTitle>
      <SettingsContent>모든 알림 표시</SettingsContent>
    </SettingsComponent>
  );
};

export default NoticeSettingsContent;
