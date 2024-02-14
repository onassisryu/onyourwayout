import React, {useState, useEffect} from 'react';
import styled from '@emotion/native';
import theme from '@/Theme';
import {Switch} from 'react-native';
import {GlobalText, GlobalContainer, GlobalButton} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContainer = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  width: 88%;
  height: initial;
  margin: 0 20px;
`;

const SettingComponent = styled(GlobalContainer)`
  padding-top: 20px;
  padding-bottom: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #b2b2b2;
  height: initial;
`;

const SettingsTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  margin-bottom: 15px;
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
  margin-bottom: 15px;
  padding: 0 15px;
  height: initial;
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


  // useEffect(() => {
  //   AsyncStorage.getItem('token').then((token) => {
  //     axiosAuth.get(`/alarm/get/1`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // 토큰을 Bearer 토큰으로 설정
  //       }
  //     })
  //       .then(response => {
  //         console.log(response.data);
  //         const data = Array.isArray(response.data) ? response.data : [response.data];
  //         console.log(data)

  //       })
  //       .catch(error => console.error(error));
  //   });
  // }, []);

  const handleSwitchChange = (settings: Setting[], setFunc: React.Dispatch<React.SetStateAction<Setting[]>>, id: string, value: boolean) => {
    setFunc(settings.map(setting => (setting.id === id ? {...setting, value} : setting)));
  };

  return (
    <SettingsContainer>
      <SettingComponent>
        <SettingsTitle> 일반 </SettingsTitle>
        {generalSettings.map(setting => (
          <SettingsSubcomponent key={setting.id}>
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
        ))}
      </SettingComponent>

    </SettingsContainer>
  );
};

export default NoticeSettings;
