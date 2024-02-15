import React from 'react';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import {Button, Text, View, ScrollView, TouchableOpacity, TextInput, Pressable, Alert, Image} from 'react-native';
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
import {launchImageLibrary, ImageLibraryOptions, ImagePickerResponse, Asset} from 'react-native-image-picker';
import Entypo from 'react-native-vector-icons/Entypo';
import DefaultButton from '@/components/DefaultButton';

const TextEncodingPolyfill = require('text-encoding');

Object.assign('global', {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});
const StyledText = styled.Text`
  font-size: 23px;
`;
const ModalContainer = styled.View`
  padding: 5px;
  min-height: 100px;
  margin-top: 60px;
  z-index: 100;
  flex-direction: column;
  height: auto;
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  background-color: pink;
  top: 0;
`;
const ChatSendContainer = styled.View`
  padding: 5px;
  min-height: 60px;
  flex-direction: column;
  height: auto;
  align-items: center;
  border-top-width: 1px;
  border-top-color: #eaeaea;
  display: flex;
  justify-content: center;
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
  padding-left: 20px;
  background-color: #f4f5f9;
`;

const ReportButton = styled(GlobalButton)`
  background-color: white;
`;

const ChatMessageContainer = styled.View<{isModal: boolean}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
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
  margin-right: 5px;
`;
const SendImg = styled(Pressable)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d9d9d9;
  padding: 10px;
  border-radius: 20px;
  margin-right: 10px;
  margin-left: 10px;
`;

const DealContainer = styled.View`
  min-height: 90px;
  flex-direction: column;
  height: auto;
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  position: absolute;
  background-color: white;
  margin-top: 60px;
  z-index: 1000;
  flex: 1;
  top: 0;
`;
type ImgData = {
  uri: string | undefined;
  type: string | undefined;
  fileSize: number | undefined;
  name: string | undefined;
  imgUrl: string | undefined;
};

interface MyObject {
  id: number;
  title: string;
  content: string;
  requestId: number;
  acceptId: number;
  cash: number;
  request: boolean;
  item: null | string;
  rewardType: string;
  complaint: number;
  dealStatus: 'OPEN' | 'ING' | 'CLOSE';
  dealType: string;
  expireAt: string;
  dealImages: string[];
  imgUrl: string;
  userDong: string;
  createdAt: string;
  modifiedAt: string;
  deletedAt: null | string;
  complaints: null | string[];
}
const ChatDetail = ({navigation}: Props) => {
  const {params} = useRoute<ChatDetailScreenRouteProp>();
  const userData = useRecoilValue(userDataState);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const TextEncodingPolyfill = require('text-encoding');
  const [isRecent, setIsRecent] = useState(false);
  const [deal, setDeal] = useState<MyObject | null>(null);
  const [imageData, setImageData] = useState<ImgData>({
    uri: undefined,
    type: undefined,
    fileSize: undefined,
    name: undefined,
    imgUrl: undefined,
  });
  const [textDisabled, setTextDisabled] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if (messageText || imageData.uri) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [messageText, imageData]);
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
  const closeReview = async () => {
    console.log('거래 후기 작성', deal?.id);
    const gb = 'good' || 'bad';
    // await axiosAuth
    //   .put(`/deal/review/${deal.id}/${gb}`)
    //   .then()
    //   .catch(err => {
    //     console.log(err);
    //   });
  };
  const cancleDeal = async () => {
    console.log('거래 취소', deal?.id);
    await axiosAuth
      .put(`/deal/accept/${deal?.id}`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const closeDeal = async () => {
    console.log('거래 완료', deal?.id);
    await axiosAuth
      .put(`/deal/close/${deal?.id}`)
      .then(res => {
        closeReview();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getRecentDeal = async () => {
    console.log('거래 최신 조회 시작', userData.id, params.userId);
    await axiosAuth
      .get(`/deal/user/${userData.id}/${params.userId}`)
      .then(res => {
        const data = res.data;

        if (userData.id === res.data.requestId) {
          data.request = true;
        } else {
          data.request = false;
        }
        if (deal?.dealImages[0]) {
          data.imgUrl = data.dealImages[0].imgUrl;
        }
        const userDong = data.requestInfo.dongName + '동 ' + data.requestInfo.hoName;
        data.userDong = userDong;
        setDeal(data);
        console.log('거래 최신 조회 성공', data);
      })
      .catch(err => {
        console.log('Fffffffffffffff', err.response);
      });
  };
  const getChatDetail = async () => {
    console.log('채팅방 메시지 전송 시작');
    await axiosAuth
      .get(`/chat/room/detail`, {params: detailParams})
      .then(res => {
        const data = res.data.chatMessages;
        console.log(res.data.chatRoom);
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
  const sendMessage = async () => {
    console.log('메시지 전송중이여');
    console.log('메시지', messageText);
    console.log('이미지', imageData);
    if (!imageData.imgUrl) {
      console.log('이미지 없음');
      await client.current?.publish({
        destination: `/pub/channel`,
        skipContentLengthHeader: true,
        body: JSON.stringify({
          chatRoomId: params.roomId, // 채팅방 고유 번호
          sendId: userData.id, //
          msg: messageText,
          img: '',
        }),
      });
    } else {
      console.log('이미지 있음', imageData.imgUrl);
      await client.current?.publish({
        destination: `/pub/channel`,
        skipContentLengthHeader: true,
        body: JSON.stringify({
          chatRoomId: params.roomId, // 채팅방 고유 번호
          sendId: userData.id, //
          msg: '',
          img: imageData.imgUrl,
        }),
      });
    }
    setMessageText('');
    setTextDisabled(true);
    setImageData({uri: '', type: '', fileSize: 0, name: '', imgUrl: undefined});
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

  const showPhoto = async () => {
    const option: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 5,
      includeBase64: true,
    };
    const response = await launchImageLibrary(option);
    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error : ' + response.errorMessage);
    else {
      const asset = response.assets[0];
      const uri = asset.uri;
      const type = asset.type;
      const fileSize = asset.fileSize;
      const fileName = asset.fileName;
      const base64 = asset.base64;

      // console.log('이미지유', imgUrl);
      const source: ImgData = {
        uri: uri,
        type: type,
        fileSize: fileSize,
        name: fileName,
        imgUrl: base64,
      };
      setImageData(source);
      setTextDisabled(false);
    }
  };

  useEffect(() => {
    console.log('채팅방 상세정보', params.roomId);
    getChatDetail(); //채팅방 메시지 기록 조회
    connectChat(); // stomp 연결
    getRecentDeal(); // 거래 최신 조회
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
      <DealContainer>
        <View
          style={css`
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
            justify-content: start;
            min-height: 80px;
            height: auto;
            width: auto;
            background-color: #f8f8f8;
            flex: 1;
            padding: 10px;
            z-index: 10;
          `}>
          <View
            style={css`
              background-color: #00d282;
              margin-left: 20px;
              width: 6px;
              height: 100%;
            `}></View>
          <View
            style={css`
              font-size: 20px;
              color: #000;
              margin-left: 10px;
              display: flex;
              flex-direction: row;
              height: 100%;
              width: 100%;
            `}>
            <View
              style={css`
                width: 80px;
                height: 100%;
                margin-bottom: 20px;
                background-color: gray;
                border-radius: 5px;
              `}>
              {deal?.imgUrl && (
                <Image
                  style={css`
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                  `}
                  src={deal?.imgUrl}
                />
              )}
            </View>
            <View
              style={css`
                padding-left: 10px;
                font-size: 20px;
                width: auto;
              `}>
              <View
                style={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: start;
                `}>
                <Entypo name="dot-single" size={20} color={'black'} />
                <Text> 동호수 : {deal?.userDong}</Text>
              </View>
              <View
                style={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: start;
                  height: auto;
                `}>
                <Entypo name="dot-single" size={20} color={'black'} />
                <Text> 맡긴 일 : {deal?.title}</Text>
              </View>
              <View
                style={css`
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: start;
                `}>
                <Entypo name="dot-single" size={20} color={'black'} />
                {deal?.rewardType === 'CASH' ? <Text> 현금 : {deal?.cash}원</Text> : <Text> 물품 : {deal?.item}</Text>}
              </View>
            </View>
          </View>
        </View>
        <View
          style={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            margin-top: 10px;
            width: 100%;
            justify-content: center;
          `}>
          {deal?.request ? (
            <>
              <DefaultButton
                size={'sm'}
                color="primary"
                onPress={() => {
                  closeDeal();
                }}
                title="완료하기"
              />
              <DefaultButton size={'sm'} color="gray" title="취소하기" onPress={cancleDeal} />
            </>
          ) : (
            deal?.dealStatus === 'ING' && (
              <DefaultButton size={'sm'} color="gray" title="거절하기" onPress={cancleDeal} />
            )
          )}
        </View>
      </DealContainer>
      <View
        style={{
          marginBottom: 120,
        }}>
        <FlatList
          inverted
          style={css`
            margin-top: 150px;
          `}
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
        <View
          style={css`
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          `}>
          <SendImg onPress={showPhoto}>
            <Feather name="camera" size={18} color="white" />
          </SendImg>
          <ChatSendInput
            editable={textDisabled}
            placeholder={'채팅을 입력해주세요.'}
            onChangeText={text => {
              setMessageText(text);
            }}
            value={messageText}></ChatSendInput>
          <SendButton
            onPress={() => {
              sendMessage();
            }}
            disabled={isDisabled}>
            <Feather name="send" size={22} color="white" />
          </SendButton>
        </View>
        {imageData.uri && (
          <View
            style={css`
              align-items: center;
              justify-content: center;
              background-color: grey;
              width: 200px;
              height: 200px;
              border-radius: 10px;
            `}>
            {imageData && (
              <Image
                source={imageData}
                style={css`
                  margin-bottom: 20px;
                  margin-top: 10px;
                `}
              />
            )}
          </View>
        )}
      </ChatSendContainer>
    </GlobalContainer>
  );
};

export default ChatDetail;
