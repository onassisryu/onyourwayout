import React from 'react';
import styled from '@emotion/native';
import {Text, View} from 'react-native';

const MessageContainer = styled.View<{isSender: boolean}>`
  align-self: ${({isSender}) => (isSender ? 'flex-end' : 'flex-start')};
  display: flex;
  flex-direction: ${({isSender}) => (isSender ? 'row-reverse' : 'row')};
  margin-bottom: 10px;
  width: 200px;
  height: auto;
  background-color: white;
`;

const MessageBubble = styled.View<{isSender: boolean}>`
  padding: 10px;
  background-color: ${({isSender}) => (isSender ? '#27D894' : '#F4F5F9')};
  border-radius: 10px;
`;

const MessageText = styled.Text``;

const MessageTimestamp = styled.View<{isSender: boolean}>`
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  margin-left: ${({isSender}) => (isSender ? '0' : '5px')};
  margin-right: ${({isSender}) => (isSender ? '5px' : '0')};
`;
const TimestampText = styled.Text`
  height: auto;
  width: 100%;
  background-color: white;
`;
const ChatImage = styled.Image`
  height: 400px;
  width: 100%;
  padding: 0;
`;

const ChatMessage = ({item, userId}: any) => {
  const isSender = item.senderId === userId;
  return (
    <MessageContainer isSender={isSender}>
      <MessageBubble isSender={isSender}>
        <MessageText>{item.msg}</MessageText>
        {item.imgUrl && <ChatImage source={{uri: item.imgUrl}} />}
      </MessageBubble>
      <MessageTimestamp isSender={isSender}>
        <TimestampText>{item.createdAt}</TimestampText>
      </MessageTimestamp>
    </MessageContainer>
  );
};

export default ChatMessage;
