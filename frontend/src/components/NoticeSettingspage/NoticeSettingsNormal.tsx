// import 내용
import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';
import theme from '@/Theme';

import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  Switch,
  TextInput
} from 'react-native';
import { GlobalText, GlobalContainer, GlobalButton } from '@/GlobalStyles';

const SettingsComponent = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
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

const SettingsSubcomponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 15px;
`;

const SettingsContent = styled(GlobalText)`
  font-size: ${theme.fontSize.small};
  color: ${theme.color.black};
  font-weight: 900;
`

const DistinctLine = styled.View`
  width: 100%;
  border: 1px solid #B2B2B2;
  margin-bottom: 15px;
`;

const NoticeSettingsContent = () => {
  
  const [settings, setSettings] = useState([
    { id: 'notice', title: '모든 알림 표시', value: true },
    { id: 'disturb', title: '방해금지 시간 설정', value: false },
    { id: 'sound', title: '소리', value: true },
    { id: 'vibration', title: '진동', value: false },
  ]);

  const handleSwitchChange = (id: string, value: boolean) => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, value } : setting
    ));
  };

  return (
    <SettingsComponent>
      <SettingsTitle> 일반 </SettingsTitle>
      {settings.slice(0, 2).map(setting => (
        <SettingsSubcomponent key={setting.id}>
          <SettingsContent>{setting.title}</SettingsContent>
          <Switch
            trackColor={{ true: "#00D282", false: "#767577"}}
            thumbColor={setting.value ? "white" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(value) => handleSwitchChange(setting.id, value)}
            value={setting.value}
            style={{ transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] }}
          /> 
        </SettingsSubcomponent>
      ))}
      <DistinctLine></DistinctLine>
    </SettingsComponent>
  );
};

export default NoticeSettingsContent;