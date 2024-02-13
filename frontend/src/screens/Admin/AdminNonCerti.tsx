import React, {useState, useEffect} from 'react';
import {Button, ScrollView, View, ImageSourcePropType} from 'react-native';
import styled, {css} from '@emotion/native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';

interface Props {
  navigation: NavigationProp<any>;
}
const AdminNonCertiCardComponent = styled(ScrollView)`
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
`;

const NonCertiButton = styled(GlobalButton)`
  padding-right: 260px;
  border-radius: 15px;
  background-color: white;
`;

const AdminNonCertiCard = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 130px;
`;

const TextComponent = styled(GlobalContainer)`
  width: 230px;
  height: initial;
  flex-direction: column;
  align-items: flex-start;
`;

const TextContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.black};
  padding: 5px 0px 5px 0px;
`;

interface NonCertiMember {
  id: number;
  username: String;
  phoneNumber: String;
  aptId: number;
  aptName: String;
  dongId: number;
  dongName: String;
  hoId: number;
  hoName: String;
}

const AdminNonCerti = ({navigation}: Props) => {
  const [responseData, setResponseData] = useState([]);
  useEffect(() => {
    axiosAuth
      .get('/admin/manages/non-certified-member')
      .then(resp => {
        setResponseData(resp.data);
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생');
      });
  }, []);

  return (
    <GlobalContainer>
      <ScrollView overScrollMode="never">
        <AdminNonCertiCardComponent>
          {responseData.map((member, index) => (
            <View key={index}>
              <NonCertiButton onPress={() => navigation.navigate('AdminNonCertiDetail', {id: member.id})}>
                <AdminNonCertiCard>
                  <TextComponent>
                    <TextContent>{member.username}</TextContent>
                    <TextContent>{member.phoneNumber}</TextContent>
                    <TextContent>
                      {member.aptName}
                      {member.dongName}
                      {member.hoName}
                    </TextContent>
                  </TextComponent>
                </AdminNonCertiCard>
              </NonCertiButton>
            </View>
          ))}
        </AdminNonCertiCardComponent>
      </ScrollView>
    </GlobalContainer>
  );
};

export default AdminNonCerti;
