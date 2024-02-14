import React from 'react';
import {FlatList, Button, Text, View, ScrollView, TouchableOpacity} from 'react-native';
import DefaultButton from '@/components/DefaultButton';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import styled, {css} from '@emotion/native';
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';
import {useRef, useEffect, useState} from 'react';
import axiosAuth from '@/axios/axiosAuth';

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
  oppId: number;
  createdAt: string;
  // 추가적인 채팅방 정보를 정의할 수 있습니다.
  dong: {
    id: number;
    //동이름
    name: string;
  };
}
const ChatMain = ({navigation}: any) => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const userData = useRecoilValue(userDataState);
  const user = {
    memberNickname: userData.nickname,
    otherNickname: '가영가영이',
  };
  //채팅방생성
  const makeChatRoom = () => {
    axiosAuth
      .post('/chat/room', user)
      .then(res => {
        console.log('채팅방생성', res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  //채팅방 조회
  const getChatRoom = () => {
    console.log(userData.id);
    axiosAuth
      .get(`/chat/room/${userData.id}`)
      .then(res => {
        console.log('채팅방목록', res.data);
        const chatRooms = res.data.map((chatRoom: ChatRoom) => {
          const createdAt = chatRoom.createdAt;
          const formattedTime = formatChatTime(createdAt);
          return {...chatRoom, createdAt: formattedTime};
        });
        return setChatRooms(chatRooms);
      })
      .catch(err => {
        console.log(err);
      });
  };

  function formatChatTime(chatTime: string): string {
    const now = new Date();
    const chatDateTime = new Date(chatTime);
    const diff = now.getTime() - chatDateTime.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // 오늘
      const hours = chatDateTime.getHours();
      const minutes = chatDateTime.getMinutes();
      const meridiem = hours < 12 ? '오전' : '오후';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${meridiem} ${formattedHours}:${formattedMinutes}`;
    } else if (diffDays <= 7) {
      // 1주일 이내
      return `${diffDays}일 전`;
    } else if (diffDays <= 30) {
      // 1달 이내
      const diffWeeks = Math.floor(diffDays / 7);
      return `${diffWeeks}주 전`;
    } else {
      // 1달 이상
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths}달 전`;
    }
  }
  useEffect(() => {
    getChatRoom();
  }, []);

  return (
    <GlobalContainer>
      <StyledText>Chat</StyledText>
      <DefaultButton color="primary" title="채팅방생성" onPress={makeChatRoom} />
      <ChatRoomsContainer contentInsetAdjustmentBehavior="automatic">
        {chatRooms.map(chatRoom => (
          <ChatRoomContainer
            key={chatRoom.id}
            onPress={() => {
              navigation.navigate('ChatDetail', {
                roomId: chatRoom.id,
                userId: chatRoom.oppId,
                name: chatRoom.oppNickName,
                dong: chatRoom.dong.name,
              });
            }}>
            <View
              style={css`
                height: 52px;
                width: 52px;
                border-radius: 30px;
                background-color: #eaeaea;
                margin-right: 10px;
              `}
            />
            <ChatTextContainer>
              <Text>상대방 닉네임: {chatRoom.oppNickName}</Text>
              <Text>상대방 id: {chatRoom.oppId}</Text>
              <Text>동: {chatRoom.dong.name}</Text>
              <Text>시간: {chatRoom.createdAt}</Text>
            </ChatTextContainer>
          </ChatRoomContainer>
        ))}
      </ChatRoomsContainer>
    </GlobalContainer>
  );
};

export default ChatMain;
