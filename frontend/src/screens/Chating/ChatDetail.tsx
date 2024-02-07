import React from 'react';
import {Button, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import DefaultButton from '@/components/DefaultButton';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import styled, {css} from '@emotion/native';
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';
import {useRef, useEffect, useState} from 'react';
import axiosAuth from '@/axios/axiosAuth';
import {get} from 'axios';
import {NavigationProp} from '@react-navigation/native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '@/@types';

// import SockJS from 'sockjs-client';
// import Stomp from '@stomp/stompjs'
// import { Client } from '@stomp/stompjs'
const StyledText = styled.Text`
  font-size: 30px;
  margin-bottom: 10px;
`;

const ChatRoomsContainer = styled(ScrollView)`
  padding: 0 20px;
`;
const ChatRoomContainer = styled.TouchableOpacity`
  height: 80px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: pink;
`;
const ChatTextContainer = styled.View`
  flex: 1;
  background-color: #eaeaea;
`;

interface ChatRoom {
  id: number;
  oppNickName: string;
  createdAt: string;
  // 추가적인 채팅방 정보를 정의할 수 있습니다.
  dong: {
    id: number;
    //동이름
    name: string;
  };
}
type ChatDetailScreenRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>;

interface Props {
  navigation: NavigationProp<any>;
}
const ChatDetail = ({navigation}: Props) => {
  const {params} = useRoute<ChatDetailScreenRouteProp>();
  const [chatRoom, setChatRoom] = useState<ChatRoom[]>([]);
  const userData = useRecoilValue(userDataState);

  const detailParams = {
    room: params.roomId,
    id: userData.id,
  };
  const getChatDetail = () => {
    axiosAuth
      .get(`/chat/room/detail`, {params: detailParams})
      .then(res => {
        console.log('채팅방 상세정보', res.data);
        setChatRoom(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  // const connectChat = () => {
  //   //1. sockejs객체 생성
  //   var url = 'ws://i10a302.p.ssafy.io:8080/ws';
  //   var client = Stomp.client({
  //     brokerURL: '/api/ws',
  //     connectHeaders: {
  //       login: 'user',
  //       passcode: 'password',
  //     },
  //     debug: function (str) {
  //       console.log(str);
  //     },
  //     reconnectDelay: 5000, //자동 재 연결
  //     heartbeatIncoming: 4000,
  //     heartbeatOutgoing: 4000,
  //   });
  //   const socket = new SockJS(url);
  //   console.log('채팅 연결 시작');
  //   //2. stomp 객체 생성
  //   const stompClient = Stomp.over(socket);
  //   var headers = {
  //     'login': 'mylogin',
  //     'passcode': 'mypasscode',
  //     // additional header
  //     'client-id': 'my-client-id',
  //   };
  // };

  useEffect(() => {
    getChatDetail();
    // connectChat();
  }, []);

  return (
    <GlobalContainer>
      <StyledText>Chat</StyledText>
      <Text>{params.roomId}</Text>
    </GlobalContainer>
  );
};

export default ChatDetail;
