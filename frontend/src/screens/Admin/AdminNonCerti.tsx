import {GlobalContainer} from '@/GlobalStyles';
import theme from '@/Theme';
import axiosAuth from '@/axios/axiosAuth';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import styled, {css} from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

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
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 15%;
`;

const BottomButton = ({func, color, text}: {func: () => void; color: any; text: string}) => {
  return (
    <View
      style={css`
        width: 45%;
        height: 70%;
        background-color: ${color};
        border-radius: 10px;
        justify-content: center;
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

const AdminNonCerti = ({navigation}: Props) => {
  const [responseData, setResponseData] = useState<any[]>([]);
  const [count, setCount] = useState<number>(-1);

  useEffect(() => {
    axiosAuth
      .get('/admin/manages/non-certified-member')
      .then(resp => {
        setResponseData(resp.data);
        setCount(0);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생');
      });
  }, []);

  return (
    <GlobalContainer
      style={css`
        position: relative;
        height: 100%;
      `}>
      <Header>
        <GoBack />
        <Text
          style={css`
            font-size: 27px;
            color: #000000;
            font-weight: bold;
          `}>
          인증 신청
        </Text>
        <View style={{width: 40}} />
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
      </AdminNonCertiCardComponent>
    </GlobalContainer>
  );
};

export default AdminNonCerti;
