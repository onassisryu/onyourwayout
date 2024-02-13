import React from 'react';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import {Button, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable} from 'react-native';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import Feather from 'react-native-vector-icons/Feather';
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
import {getAccessToken} from '@/utils/common';
import ChatMessage from '@/components/Chatpage/ChatMessage';

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});
const StyledText = styled.Text`
  font-size: 23px;
`;
const ChatSendContainer = styled.View`
  padding: 5px;
  flex-direction: row;
  height: 60px;
  align-items: center;
  border-top-width: 1px;
  border-top-color: #eaeaea;
  display: flex;
  justify-content: space-between;
  width: 100%; // 이 부분이 추가되었습니다.
  position: absolute;
  background-color: white;
  bottom: 0;
`;
const ChatSendInput = styled.TextInput`
  flex: 1;
  height: 40px;
  margin-right: 5px;
  border-radius: 20px;
  padding: 10px;
  background-color: #f4f5f9;
`;
const MessageContainer = styled.View<{isSender: boolean}>`
  align-self: ${({isSender}) => (isSender ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
  background-color: white;
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
const ReportButton = styled(GlobalButton)`
  background-color: white;
`;

type Message = {
  msg: string;
  senderId: number;
  imgUrl: string;
  createdAt: string;
};
type ChatDetailScreenRouteProp = RouteProp<RootStackParamList, 'ChatDetail'>;

interface Props {
  navigation: NavigationProp<any>;
}
const SendButton = styled(Pressable)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #27d894;
  padding: 8px;
  padding-top: 10px;
  border-radius: 20px;
  margin-left: 10px;
`;
const SendImg = styled(Pressable)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d9d9d9;
  padding: 5px;
  border-radius: 20px;
  margin-left: 10px;
  margin-right: 15px;
`;

const ChatDetail = ({navigation}: Props) => {
  const {params} = useRoute<ChatDetailScreenRouteProp>();
  const userData = useRecoilValue(userDataState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const TextEncodingPolyfill = require('text-encoding');

  Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
  });
  const flatListRef = useRef<FlatList>(null);
  function convertTimeFormat(dateTime: string): string {
    const dateObj = new Date(dateTime);
    let hours: number = dateObj.getHours();
    let minutes: number = dateObj.getMinutes();
    let timeSuffix: string = '오전';

    if (hours >= 12) {
      timeSuffix = '오후';
      hours -= 12;
    }

    if (hours === 0) {
      hours = 12;
    }

    const paddedMinutes = minutes.toString().padStart(2, '0');

    return timeSuffix + ' ' + hours + ':' + paddedMinutes;
  }
  const detailParams = {
    room: params.roomId,
    id: userData.id,
  };

  const getChatDetail = async () => {
    console.log('채팅방 메시지 전송 시작');
    await axiosAuth
      .get(`/chat/room/detail`, {params: detailParams})
      .then(res => {
        const data = res.data.chatMessages;
        const msg = data.map((message: any) => {
          const convertedTime = convertTimeFormat(message.createdAt);

          return {
            msg: message.msg,
            senderId: message.senderId,
            imgUrl: message.imgUrl,
            createdAt: convertedTime,
          };
        });
        console.log('채팅방 불러오기 완료');
        const msgR = msg.reverse();
        setMessages(msgR);
      })
      .catch(err => {
        console.log(err);
      });
    flatListRef.current?.scrollToEnd({animated: true});
  };
  const sendMessage = (message: string) => {
    client.current?.publish({
      destination: `/pub/channel`,
      skipContentLengthHeader: true,
      body: JSON.stringify({
        chatRoomId: params.roomId, // 채팅방 고유 번호
        sendId: userData.id, //
        msg: message,
        img: '',
      }),
    });
  };

  const client = useRef<Client | null>(null);
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
          const json_body = JSON.parse(message.body);
          console.log('구독', json_body);
          const msg = {
            msg: json_body.msg,
            senderId: json_body.sendId,
            imgUrl: json_body.img,
            createdAt: convertTimeFormat(json_body.createdAt),
          };

          setMessages(prev => [msg, ...prev]);
        });
        if (client.current?.connected) {
          console.log('연결됨');
        }
      },
    });
    client.current.activate();
  };

  useEffect(() => {
    console.log('채팅방 상세정보', params.roomId);
    getChatDetail();
    connectChat();
    return () => {
      client.current?.deactivate();
    };
  }, []);

  return (
    <GlobalContainer style={{position: 'relative'}}>
      <Header>
        <GoBack />
        <StyledText>{params.name}</StyledText>
        <ReportButton>
          <Feather
            name="more-vertical"
            size={25}
            style={css`
              color: #c4c4c4;
            `}
          />
        </ReportButton>
      </Header>
      <View
        style={{
          marginBottom: 120,
        }}>
        <FlatList
          inverted
          style={{}}
          data={messages}
          ref={flatListRef}
          contentContainerStyle={{
            marginLeft: 20,
            marginRight: 20,
          }}
          renderItem={({item}) => <ChatMessage item={item} userId={userData.id} />}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <ChatSendContainer>
        <SendImg>
          <Feather name="camera" size={18} color="white" />
        </SendImg>
        <ChatSendInput
          placeholder={'채팅을 입력해주세요.'}
          onChangeText={text => {
            setMessageText(text);
          }}
          value={messageText}></ChatSendInput>
        <SendButton
          onPress={() => {
            sendMessage(messageText);
          }}
          disabled={messageText == ''}>
          <Feather name="send" size={22} color="white" />
        </SendButton>
      </ChatSendContainer>
    </GlobalContainer>
  );
};

export default ChatDetail;
