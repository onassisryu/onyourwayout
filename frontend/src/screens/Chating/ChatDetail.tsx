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
      destination: `/pub/channel`,
      skipContentLengthHeader: true,
      body: JSON.stringify({
        chatRoomId: params.roomId, // 채팅방 고유 번호
        sendId: 3, // 메시지 발신자 uuid
        msg: message,
        img: 'data:image/jpeg;base64,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',
      }),
    });
  };
  const client = useRef<Client | null>(null);
  // const socket = new SockJS(`${API_BASE_URL}/stomp/chat`);
  const connectChat = async () => {
    client.current = new StompJs.Client();
    client.current.configure({
      brokerURL: 'ws://i10a302.p.ssafy.io:8080/ws/chat',
      connectHeaders: {
        Authorization: `${await getAccessToken()}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      debug: function (str) {
        console.log(str);
      },
      onConnect: e => {
        console.log('Connected to the WebSocket server', e);
        client.current?.subscribe(`/sub/channel/${params.roomId}`, message => {
          console.log(message);
          // const json_body = JSON.parse(body.body);
        });
        if (client.current?.connected) {
          console.log('연결됨');
        }
        sendMessage('안녕하세요');
      },
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
