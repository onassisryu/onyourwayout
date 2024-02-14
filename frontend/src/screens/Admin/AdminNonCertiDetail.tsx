import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';

import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';

const CertiImage = styled.Image`
  width: 100%;
  height: 65%;
  resize-mode: contain;
`;

const ContentComponent = styled(GlobalContainer)`
  flex-direction: column;
  align-items: flex-start;
`;

const TextContent = styled(GlobalText)`
  width: 390px;
  font-size: 30px;
  padding-left: 20px;
  font-weight: bold;
  color: ${props => props.theme.color.black};
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

const AvatarImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const MemberText = styled.Text`
  font-size: 20px;
  color: black;
  justify-content: center;
  align-items: center;
`;

interface AdminNonCerti {
  id: number;
}

type RootStackParamList = {
  AdminNonCertiDetail: {id: number};
};

const AdminNonCertiDetail = ({member}: {member: any}) => {
  console.log('===============route===========', member);
  // 비인증 사용자의 uuid를 가져온다.
  return (
    <View
      style={css`
        height: 85%;
      `}>
      <View
        style={css`
          height: 100%;
        `}>
        {member.certificationImg !== null ? (
          <CertiImage src={member.certificationImg} />
        ) : (
          <CertiImage
            src={
              'data:image/png;base64,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'
            }
          />
        )}
        <View
          style={css`
            background-color: white;
            flex: 1;
            width: 100%;
            border-top-color: grey;
            border-top-width: 1px;
            padding: 20px;
          `}>
          <View
            style={css`
              width: 100%;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
            `}>
            {member.profileImg !== null ? (
              <AvatarImage src={member.profileImg} />
            ) : (
              <AvatarImage
                src={
                  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxEii4P-FwrK9fY1RwR1_LR8sr2yuwc0NkSA&usqp=CAU'
                }
              />
            )}
            <View>
              <TextContent>{member.nickname}</TextContent>
            </View>
          </View>
          <View
            style={css`
              padding: 10px;
            `}>
            <MemberText
              style={css`
                font-weight: 600;
              `}>
              {member.aptName}
              {' 아파트 '}
            </MemberText>
            <MemberText>
              {member.dongName}
              {'동 '}
              {member.hoName}
              {'호'}
            </MemberText>
          </View>
        </View>
      </View>
    </View>
  );
};

export default AdminNonCertiDetail;
