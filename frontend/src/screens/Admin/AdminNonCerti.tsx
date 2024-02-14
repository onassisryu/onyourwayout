import React, {useState, useEffect} from 'react';
import {Button, ScrollView, View, ImageSourcePropType, Text, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import theme from '@/Theme';

import AdminNonCertiDetail from './AdminNonCertiDetail';

interface Props {
  navigation: NavigationProp<any>;
}
const AdminNonCertiCardComponent = styled(View)`
  margin-top: 10px;
  flex: 1;
`;

const BottomButtonComponent = styled.View`
  height: 100px;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const BottomButtonBar = styled.View`
  bottom: 0;
  position: absolute;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 15%;
`;

const BottomButton = ({func, color, text}: {func: () => void; color: any; text: string}) => {
  return (
    <View
      style={css`
        width: 50%;
        background-color: ${color};
      `}>
      <TouchableOpacity onPress={func}>
        <BottomButtonComponent>
          <Text
            style={css`
              color: white;
              font-size: ${theme.fontSize.subtitle};
              font-weight: bold;
            `}>
            {text}
          </Text>
        </BottomButtonComponent>
      </TouchableOpacity>
    </View>
  );
};

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
  certificationImg: String;
}

const certiMember = (memberId: number) => {
  // axiosAuth
  //   .put(`/admin/manages/non-certified-member/${memberId}/certification`)
  //   .then(resp => {
  //     console.log('인증을 완료하였습니다', resp.data);
  //   })
  //   .catch(error => {
  //     console.error('인증을 처리하는 중 오류가 발생:', error);
  //   });
};

const AdminNonCerti = ({navigation}: Props) => {
  const [responseData, setResponseData] = useState<any[]>([]);
  const [count, setCount] = useState<number>(-1);
  const [result, setResult] = useState({});
  const [currentMember, setCurrentMember] = useState<NonCertiMember>();
  useEffect(() => {
    axiosAuth
      .get('/admin/manages/non-certified-member')
      .then(resp => {
        setResponseData(resp.data);
        setCount(0);
        console.log('response 성공');
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생');
      });
  }, []);

  useEffect(() => {
    if (count === -1) {
      return;
    }
    const member = responseData[count];
    if (!member) {
      return;
    }
    axiosAuth
      .get(`/admin/manages/non-certified-member/${member.id}`)
      .then(resp => {
        setCurrentMember(resp.data);
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, [count]);

  return (
    <GlobalContainer
      style={css`
        position: relative;
        height: 100%;
      `}>
      <Header>
        <GoBack />
      </Header>
      <AdminNonCertiCardComponent>
        {responseData.length === 0 || count >= responseData.length || count < 0 ? (
          <View
            style={css`
              justify-content: center;
              flex: 1;
            `}>
            <Text
              style={css`
                font-size: 30px;
                color: ${theme.color.black};
                text-align: center;
              `}>
              신청 내역이 없습니다.
            </Text>
          </View>
        ) : (
          <View
            style={css`
              height: 100%;
            `}>
            {/* {CardMember(responseData[count], navigation)} */}
            <AdminNonCertiDetail member={responseData[count]} />
            <BottomButtonBar>
              <BottomButton
                func={() => {
                  certiMember(responseData[count].id);
                  setCount(count + 1);
                }}
                color={theme.color.primary}
                text="수락하기"></BottomButton>
              <BottomButton
                func={() => {
                  setCount(count + 1);
                }}
                color={theme.color.gray200}
                text="거절하기"></BottomButton>
            </BottomButtonBar>
          </View>
        )}
        {/* // {responseData.map((member, index) => (
          //   <View key={index}>{CardMember(member, navigation)}</View>
          // ))} */}
      </AdminNonCertiCardComponent>
      {/* <View>
      {responseData.length === 0 || count >= responseData.length ?:():()}
      </View> */}
    </GlobalContainer>
  );
};

export default AdminNonCerti;
