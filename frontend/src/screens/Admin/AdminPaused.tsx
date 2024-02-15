import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import styled, {css} from '@emotion/native';
import React, {useEffect, useState} from 'react';
import {Animated, ScrollView, TouchableOpacity, View, Text} from 'react-native';

const TextComponent = styled(GlobalContainer)`
  width: 230px;
  height: initial;
  flex-direction: column;
  align-items: flex-start;
`;

const TextContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  padding: 5px 0px 5px 0px;
`;

const Card = styled.View`
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid #bbbbbb;
  height: 100px;
  flex-direction: row;
  margin-bottom: 10px;
`;

const PausedUserCard = ({member}: {member: any}) => {
  return (
    <Card>
      <View
        style={css`
          width: 70%;
        `}>
        <TextComponent>
          <TextContent>{'아이디 : ' + member.nickname}</TextContent>
          <TextContent>{'정지횟수 : ' + member.penaltyCount}</TextContent>
          <TextContent>{'정지 해제 일자 : ' + member.pauseEndAt.substring(0, 10)}</TextContent>
        </TextComponent>
      </View>
    </Card>
  );
};

// 정지된 사용자의 정보를 보여주는 페이지
const AdminPaused = () => {
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    // 정지 사용자 데이터를 받아온다.
    axiosAuth
      .get('/admin/manages/pause')
      .then(resp => {
        setResponseData(resp.data);
        responseData.map((member: any) => {
          console.log(member);
        });
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생: ', error);
      });
  }, []);

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
        <Text
          style={css`
            font-size: 27px;
            color: #000000;
            font-weight: bold;
          `}>
          정지 사용자 목록
        </Text>
        <View style={{width: 40}} />
      </Header>
      <ScrollView
        overScrollMode="never"
        style={css`
          padding: 10px;
        `}>
        {responseData.map((member, index) => (
          <PausedUserCard key={index} member={member} />
        ))}
      </ScrollView>
    </GlobalContainer>
  );
};

export default AdminPaused;
