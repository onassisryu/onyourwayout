import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { Switch } from 'react-native-switch';
import { GlobalText, GlobalContainer, GlobalButton } from '@/GlobalStyles';

const SettingsComponent = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  margin-left: 30px;
  margin-right: 30px;
`;

const SettingsTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
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
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.black};
  font-weight: 900;
`;

const DistinctLine = styled.View`
  width: 100%;
  border: 1px solid #B2B2B2;
  margin-bottom: 15px;
`;

const NoticeSettingsSound = () => {
  
    const [settings, setSettings] = useState([
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
  
        <SettingsTitle> 소리/진동 </SettingsTitle>
        {settings.slice(0, 2).map(setting => (
          <SettingsSubcomponent key={setting.id}>
            <SettingsContent>{setting.title}</SettingsContent>
            <Switch
            value={setting.value}
            onValueChange={(value) => handleSwitchChange(setting.id, value)}
            activeText={''}
            inActiveText={''}
            circleSize={20}
            barHeight={20}
            backgroundActive={'#00D282'}
            backgroundInactive={'#B2B2B2'}
            circleBorderActiveColor={'#00D282'}
            switchLeftPx={2}
            switchRightPx={2}
          /> 
          </SettingsSubcomponent>
        ))}
        <DistinctLine></DistinctLine>
      </SettingsComponent>
    );
};

export default NoticeSettingsSound;