import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';

const CertiImage = styled.Image`
  width: 410px;
  height: 450px;
  resize-mode: contain;
`;

const ContentComponent = styled(GlobalContainer)`
  flex-direction: column;
  align-items: flex-start;
`;

const TextContent = styled(GlobalText)`
  width: 390px;
  line-height: 24px;
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  padding: 25px 0px 0px 0px;
`;

const CertiButton = styled(GlobalButton)`
  flex-direction: row;
  width: 150px;
  height: 60px;
  border: white;
  background-color: ${props => props.theme.color.primary};
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;
interface AdminNonCerti {
  id: number;
}

type RootStackParamList = {
  AdminNonCertiDetail: {id: number};
};

type AdminNonCertiDetailRouteProp = RouteProp<RootStackParamList, 'AdminNonCertiDetail'>;

const AdminNonCertiDetail = ({route, navigation}: any) => {
  // 비인증 사용자의 uuid를 가져온다.
  const param = route.params['id'];
  const [responseData, setResponseData] = useState({});

  const certiMember = (memberId: number) => {
    axiosAuth
      .put(`/admin/manages/non-certified-member/${memberId}/certification`)
      .then(resp => {
        console.log('인증을 완료하였습니다', resp.data);
      })
      .catch(error => {
        console.error('인증을 처리하는 중 오류가 발생:', error);
      });
  };

  useEffect(() => {
    axiosAuth
      .get(`/admin/manages/non-certified-member/${param}`)
      .then(resp => {
        setResponseData(resp.data);
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  return (
    /**
     * responseData.username
     * responseData.phoneNumber
     * responseData.aptName
     * responseData.dongName
     * responseData.hoName
     * responseData.certificationImg
     * 을 보여준다.
     * */
    <View>
      <ContentComponent>
        <TextContent>사용자 아이디 {responseData.username}</TextContent>
        <TextContent>전화번호 {responseData.phoneNumber}</TextContent>
        <TextContent>아파트 이름 {responseData.aptName}</TextContent>
        <TextContent>동 이름 {responseData.dongName}</TextContent>
        <TextContent>호 이름 {responseData.hoName}</TextContent>
        <CertiImage source={responseData.certificationImg} />
      </ContentComponent>

      <CertiButton onPress={() => certiMember(responseData.id)}>인증하기</CertiButton>
    </View>
  );
};

export default AdminNonCertiDetail;
