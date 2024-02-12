import React from 'react';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import {Button, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, FlatList} from 'react-native';
import DefaultButton from '@/components/DefaultButton';
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
import {get} from 'axios';
import {getStorage} from '@/storage/common_storage';
import {getAccessToken} from '@/utils/common';
import {useNavigation} from '@react-navigation/native';
import {send} from 'process';

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

  justify-content: space-between;
  background-color: #ffffff;
`;
const ChatSendInput = styled.TextInput`
  flex: 1;
  height: 40px;
  margin-right: 5px;
  border-radius: 20px;
  padding: 10px;
  background-color: #f4f5f9;
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
const ReportButton = styled(GlobalButton)`
  background-color: white;
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

const ChatDetail = ({navigation}: Props) => {
  const {params} = useRoute<ChatDetailScreenRouteProp>();
  const [chatRoom, setChatRoom] = useState<ChatRoom[]>([]);
  const userData = useRecoilValue(userDataState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const TextEncodingPolyfill = require('text-encoding');

  Object.assign('global', {
    TextEncoder: TextEncodingPolyfill.TextEncoder,
    TextDecoder: TextEncodingPolyfill.TextDecoder,
  });
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

    if (minutes < 10) {
      minutes = Number('0' + minutes);
    }

    return timeSuffix + ' ' + hours + ':' + minutes;
  }
  const detailParams = {
    room: params.roomId,
    id: userData.id,
  };

  const getChatDetail = () => {
    axiosAuth
      .get(`/chat/room/detail`, {params: detailParams})
      .then(res => {
        console.log('채팅방 상세정보', res.data);
        console.log('채팅방 상세정보', res.data.chatMessages);
        const data = res.data.chatMessages;

        const msg = data.map((message: any) => {
          console.log('메시지', message.msg);
          console.log('메시지', message.senderId);
          console.log('메시지', message.imgUrl);
          const convertedTime = convertTimeFormat(message.createdAt);
          console.log('메시지', convertedTime);

          return {
            msg: message.msg,
            senderId: message.senderId,
            imgUrl: message.imgUrl,
            createdAt: convertedTime,
          };
        });
        console.log(msg);
        setMessages(msg);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const sendMessage = (message: string) => {
    console.log('-----------------메시지 보낸다.', message);
    console.log('-----------------채팅방 아이디', params.userId);
    client.current?.publish({
      destination: `/pub/channel`,
      skipContentLengthHeader: true,
      body: JSON.stringify({
        chatRoomId: params.roomId, // 채팅방 고유 번호
        sendId: 23, // 메시지 발신자 uuid
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
          // setMessages(prev => [...prev, json_body])
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
    console.log('채팅방 상세정보', params.name);
    getChatDetail();
    // connectChat();
    return () => {
      client.current?.deactivate();
    };
  }, []);

  return (
    <GlobalContainer>
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
          padding: 5,
          flexGrow: 1,
        }}>
        <FlatList
          data={messages}
          renderItem={({item}) => (
            <View
              style={{
                padding: 10,
                backgroundColor: item.senderId === userData.id ? '#27D894' : '#EAEAEA',
                alignSelf: item.senderId === userData.id ? 'flex-end' : 'flex-start',
                borderRadius: 10,
                marginBottom: 10,
              }}>
              <Text>{item.msg}</Text>
              <Text>{item.createdAt}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}></FlatList>
      </View>
      <ChatSendContainer>
        <ChatSendInput
          placeholder={'채팅을 입력해주세요.'}
          onChangeText={text => {
            setMessageText(text);
          }}
          value={messageText}></ChatSendInput>
        <Pressable
          onPress={() => {
            sendMessage(messageText);
          }}
          disabled={messageText == ''}>
          <Text>전송</Text>
        </Pressable>
      </ChatSendContainer>
    </GlobalContainer>
  );
};

export default ChatDetail;
