import styled, {css} from '@emotion/native';
import {useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, Text, Image} from 'react-native';
import DefaultButton from '@/components/DefaultButton';
import SvgIcon from '@/components/SvgIcon';
import Entypo from 'react-native-vector-icons/Entypo';
import axiosAuth from '@/axios/axiosAuth';

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

const DealContent = ({img, icon, deal, client, roomId, sendId}: any) => {
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
        // closeReview();
      })
      .catch(err => {
        console.log(err);
      });
    client.current?.publish({
      destination: `/pub/channel`,
      skipContentLengthHeader: true,
      body: JSON.stringify({
        chatRoomId: roomId, // 채팅방 고유 번호
        sendId: sendId, //
        msg: '--거래완료--',
        img: '',
      }),
    });
  };

  useEffect(() => {
    // deal 데이터를 가져오는 로직 추가
    console.log(deal?.dealStatus);
  }, [deal]);

  return (
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
              border-radius: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
            `}>
            {img ? (
              <Image
                style={css`
                  width: 100%;
                  height: 100%;
                  border-radius: 5px;
                `}
                src={img}
              />
            ) : (
              <SvgIcon name={icon} size={60} />
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
          deal?.dealStatus === 'CLOSE' ? (
            <></>
          ) : (
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
          )
        ) : (
          deal?.dealStatus === 'ING' && <DefaultButton size={'sm'} color="gray" title="거절하기" onPress={cancleDeal} />
        )}
      </View>
    </DealContainer>
  );
};
export default DealContent;
