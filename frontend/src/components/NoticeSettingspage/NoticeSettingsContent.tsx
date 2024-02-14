import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import theme from '@/Theme';
import {Switch} from 'react-native';
import {GlobalText, GlobalContainer, GlobalButton} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {css} from '@emotion/native';

const SettingsContainer = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  width: 90%;
  height: initial;
  margin: 0 20px;
`;

const SettingComponent = styled(GlobalContainer)`
  padding-top: 10px;
  padding-bottom: 10px;
  height: initial;
`;

const SettingsContent = styled(GlobalText)`
  flex-direction: row;
  justify-content: space-between;
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
`;

const SettingsSubcomponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
  height: initial;
`;

const DistinctLine = styled.View`
  width: 95%;
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  border: 0.5px solid #b2b2b2;
  background-color: #b2b2b2;
`;

const TimeComponent = styled(GlobalContainer)`
  flex-direction: row;
  align-items: center;
  margin: 10px 15px 10px 15px;
  height: initial;
`;

const StyledInput = styled.TextInput`
  width: 100%;
  font-size: 18px;
  color: ${props => props.theme.color.primary};
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  margin: 5px 15px 5px 5px;
  border: 1px solid ${props => props.theme.color.primary};
  color: ${props => props.theme.color.black};
`;

interface Setting {
  id: string;
  title: string;
  value: boolean;
};

const NoticeSettings = () => {
  const [generalSettings, setGeneralSettings] = useState([
    {id: 'alaramDisplay', title: '모든 알림 표시', value: false},
    {id: 'time', title: '방해금지 시간 설정', value: false},
    {id: 'vibration', title: '진동', value: false},
  ]);

  const handleSwitchChange = (settings: Setting[], setFunc: React.Dispatch<React.SetStateAction<Setting[]>>, id: string, value: boolean) => {
    setFunc(settings.map(setting => (setting.id === id ? {...setting, value} : setting)));
  };

  return (
    <SettingsContainer>
      {generalSettings.map(setting => (
        <SettingComponent key={setting.id}>
          <SettingsSubcomponent>
            <SettingsContent>{setting.title}</SettingsContent>
            <Switch
              trackColor={{true: '#00D282', false: '#767577'}}
              thumbColor={setting.value ? 'white' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => handleSwitchChange(generalSettings, setGeneralSettings, setting.id, value)}
              value={setting.value}
              style={{transform: [{scaleX: 1.1}, {scaleY: 1.1}]}}
            />
          </SettingsSubcomponent>
          {setting.id === 'time' && setting.value && (
            // 방해금지 시간 설정 스위치가 켜져 있을 때만 이 설정에 관련된 추가 컴포넌트를 렌더링합니다.
            <>
              <TimeComponent>
                <SettingsContent>From : </SettingsContent>
                <StyledInput
                  style={css`
                    width: 32%;
                    font-weight: 500;
                    height: 40px;
                    color: ${theme.color.black};
                  `}
                />
                <SettingsContent>To : </SettingsContent>
                <StyledInput
                  style={css`
                    width: 32%;
                    font-weight: 500;
                    height: 40px;
                    color: ${theme.color.black};
                  `}
                />
              </TimeComponent>
            </>
          )}
        </SettingComponent>
    ))}
    <DistinctLine></DistinctLine>
    </SettingsContainer>
  );
};

export default NoticeSettings;
