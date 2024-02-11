import React from 'react';
import {Button, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import DefaultButton from '@/components/DefaultButton';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import styled, {css} from '@emotion/native';
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';
import {useRef, useEffect, useState} from 'react';
import axiosAuth from '@/axios/axiosAuth';
import {NavigationProp} from '@react-navigation/native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '@/@types';
import SockJS from 'sockjs-client';
import StompJs, {Client} from '@stomp/stompjs';
import * as encoding from 'text-encoding';
import {get} from 'axios';
import {getStorage} from '@/storage/common_storage';
import {getAccessToken} from '@/utils/common';

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});
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
  const [messages, setMessages] = useState([]);
  const TextEncodingPolyfill = require('text-encoding');

  Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
  });
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
  const sendMessage = (message: string) => {
    client.current?.publish({
      destination: `/pub/channel/${params.roomId}`,
      body: JSON.stringify({
        chatRoomId: params.roomId, // 채팅방 고유 번호
        sendId: 47, // 메시지 발신자 uuid
        msg: message,
        img: '',
      }),
    });
  };
  const client = useRef<Client | null>(null);
  const socket = new SockJS('ws/chat');

  const connectChat = async () => {
    client.current = new StompJs.Client({
      brokerURL: 'ws://i10a302.p.ssafy.io:8080/ws/chat',
      // webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `${await getAccessToken()}`,
      },
      debug: str => {
        console.log('디버그', str);
      },
      onConnect: e => {
        console.log(e);
      },
      onStompError: frame => {
        console.error('Broker reported error:', frame.headers['message']);
        console.error('Additional details:', frame.body);
      },
      onDisconnect: () => {
        console.log('Disconnected from the WebSocket server');
      },
      onWebSocketClose: async e => {
        console.log('Closed', e.reason);
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 40000,
    });
    client.current.activate();
  };
  connectChat();
  useEffect(() => {
    getChatDetail();
  }, []);

  return (
    <GlobalContainer>
      <StyledText>Chat</StyledText>
      <Text>{params.roomId}</Text>
    </GlobalContainer>
  );
};

export default ChatDetail;
