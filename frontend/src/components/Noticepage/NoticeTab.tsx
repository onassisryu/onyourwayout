// import 내용
import React, {useState, useEffect} from 'react';
import styled, {css} from '@emotion/native';
import {NavigationProp} from '@react-navigation/native';
import theme from '@/Theme';
import moment from 'moment';
import 'moment/locale/ko';
import {GlobalButton, GlobalContainer, GlobalComponent} from '@/GlobalStyles';
import {View, TouchableOpacity, ImageSourcePropType, Modal, Button, Text, TouchableWithoutFeedback} from 'react-native';
import {GlobalText} from '@/GlobalStyles';
import SvgIcon from '@components/SvgIcon';
import PushNotification from 'react-native-push-notification';
import axiosAuth from '@/axios/axiosAuth';
import Entypo from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage';

const TotalDeleteContainer = styled(GlobalComponent)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  width: 96%;
  height: 40px;
`;

const TotalDelete = styled(GlobalButton)`
  align-items: center;
  justify-content: center;
  background-color: ${theme.color.primary};
  width: 26%;
  height: 40px;
`;

const TotalRead = styled(GlobalButton)`
  align-items: center;
  justify-content: center;
  background-color: ${theme.color.primary};
  width: 26%;
  height: 40px;
  margin-left: 20px;
`;

const TotalDeleteText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.white};
  font-weight: 900;
`;

const NoticeCard = styled(GlobalContainer)`
  width: 90%;
  height: initial;
  margin-left: 20px;
  margin-top: 10px;

`;

const CardButton = styled(GlobalButton)`
  background-color: white;
  padding-right: 5px;
  padding-left: 5px;
`

const CardHeader = styled(GlobalContainer)`
  height: initial;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CardTitle = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: 900;

`;

const CardContentComponent = styled(GlobalContainer)`
  height: initial;
`

const CardContent = styled(GlobalText)`
  font-size: ${theme.fontSize.small};
  color: ${theme.color.black};
  font-weight: 900;
  margin-bottom: 20px;
`;

const XImage = styled.Image`
  width: 15px;
  height: 15px;
  resize-mode: contain;
  margin-right: 5px;
  margin-top: 5px;
`;

const NoticeTime = styled(GlobalText)`
  font-size: ${theme.fontSize.small};
  color: #727272;
  font-weight: 900;
  margin-bottom: 20px;
`;

const DistinctLineGray = styled.View`
  width: 100%;
  border: 1px solid #b2b2b2;
  background-color: #b2b2b2;
`;

const DistinctLineGreen = styled.View`
  width: 100%;
  border: 1px solid #00D282;
  background-color: #00D282;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ModalBackground = styled(GlobalContainer)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  height: initial;
`;

const ModalComponent = styled(GlobalContainer)`
  width: 80%;
  height: initial;
  border: 2px solid #00d282;
  border-radius: 15px;
  background-color: white;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 10px 10px 10px;
`;

const ModalSubComponent = styled(GlobalContainer)`
  background-color: white;
  padding: 10px 2px 10px 2px;
  height: initial;
`;

const SelectButton = styled(GlobalButton)`
  background-color: ${theme.color.primary};
  width: 45%;
  padding: 10px;
`;

const ButtonText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.white};
  font-weight: bold;

`;

const ModalText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: bold;
  margin-bottom: 15px;
`;

const xImage: ImageSourcePropType = require('icons/x.png');

type Notice = {
  id: number;
  isRead: boolean;
  title: string;
  message: string;
  dealType: string;
  notificationType: string;
};

type NoticeId = {
  id: number;
};

const NoticeTab = () => {

  const notificationTime = new Date();
  console.log(notificationTime)

  const [notices, setNotices] = useState<Notice[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [readNoticeId, setReadNoticeId] = useState(null);

  useEffect(() => {
    if (readNoticeId !== null) {
      axiosAuth
      .put(`/notification/${readNoticeId}`)
      .then(resp => {
        console.log('알림', resp.data)
        setNotices(notices.map(notice => notice.id === readNoticeId ? {...notice, isRead: true} : notice));
      })
      .catch(error => {
        console.error('알림 읽음 중 오류 발생:', error);
      });
    }
  }, [readNoticeId]);

  const readAllNotices = () => {
    axiosAuth
    .put(`/notification`)
    .then(resp => {
      console.log('전체알림', resp.data)
      setNotices(notices.map(notice => ({...notice, isRead: true})));
    })
    .catch(error => {
      console.error('전체 알림 읽음 중 오류 발생:', error);
    });
  };

  const readNotice = (id: NoticeId) => {
    axiosAuth
    .put(`/notification/${id}`)
    .then(resp => {
      console.log('알림', resp.data)
      setNotices(notices.map(notice => notice.id === id.id ? {...notice, isRead: true} : notice));
    })
    .catch(error => {
      console.error('알림 읽음 중 오류 발생:', error);
    });
  };

  const deleteAllNotices = () => {
    axiosAuth
    .delete(`/notification`)
    .then(() => {
      console.log('전체 삭제 성공')
      setNotices([]);
      setModalVisible(false);
    })
    .catch(error => {
      console.error('전체 알림 삭제 중 오류 발생:', error);
    });
  };

  const deleteNotice = (id: NoticeId) => {
    axiosAuth
    .delete(`/notification/${id}`)
    .then(() => {
      axiosAuth
        .get(`/notification`)
        .then(resp => {
          // 새로운 배열을 생성하여 상태를 업데이트합니다.
          setNotices([...resp.data]);
        })
        .catch(error => {
          console.error('데이터를 가져오는 중 오류 발생:', error);
        });
    })
    .catch(error => {
      console.error('알림 삭제 중 오류 발생:', error);
    });
  };

  useEffect(() => {
    console.log('알림 데이터가 업데이트되었습니다:', notices);
  }, [notices]);

  useEffect(() => {
    axiosAuth
    .get(`/notification`)
    .then(resp => {
      console.log('성공----------------', resp.data);
      setNotices(resp.data)

    })
    .catch(error => {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    });
  }, []); 

  return (
    <GlobalContainer>
      <TotalDeleteContainer>
        <TotalRead onPress={readAllNotices}>
          <TotalDeleteText>알림 전체읽기</TotalDeleteText>
        </TotalRead>
        <TotalDelete onPress={() => setModalVisible(true)}>
          <TotalDeleteText>알림 전체삭제</TotalDeleteText>
        </TotalDelete>
      </TotalDeleteContainer>
      <DistinctLineGreen></DistinctLineGreen>
      {notices.map(notice => (

        <NoticeCard key={notice.id}>
          {!notice.isRead && <Entypo name='dot-single' size={30} color={'red'} style={css`position: absolute; bottom: 95px; right: 360px;`}/>}
          <CardButton onPress={() => setReadNoticeId(notice.id)}>
          
            <CardHeader>
              
              <View style={css`flex-direction: row; align-items: center;`}>
                {notice.dealType === 'PET' && <SvgIcon name="puppy" size={30} />}
                {notice.dealType === 'RECYCLE' && <SvgIcon name="shopping" size={30} />}
                {notice.dealType === 'SHOP' && <SvgIcon name="bags" size={30}/>}
                {notice.dealType === 'ETC' && <SvgIcon name="building" size={30} />}
                <CardTitle> {notice.title}</CardTitle>
              </View>
              <TouchableOpacity onPress={() => deleteNotice(notice.id)}>
                <XImage source={xImage}></XImage>
              </TouchableOpacity>
            </CardHeader>

            <CardContentComponent>
              <View>
                {notice.notificationType === 'CHAT' && <CardContent>{notice.dong}의 {notice.nickname}님과 채팅이 시작되었습니다.</CardContent>}
                {notice.notificationType === 'DEAL_NEW' && <CardContent>{notice.dong}의 {notice.nickname}님과 거래가 생성되었습니다.</CardContent>}
                {notice.notificationType === 'DEAL_ACCEPT' && <CardContent>{notice.dong}의 {notice.nickname}님과 거래가 수락되었습니다.</CardContent>}
                {notice.notificationType === 'DEAL_REJECT' && <CardContent>{notice.dong}의 {notice.nickname}님과 거래가 거절되었습니다.</CardContent>}
                {notice.notificationType === 'DEAL_CANCEL' && <CardContent>{notice.dong}의 {notice.nickname}님과 거래가 취소되었습니다.</CardContent>}
              </View>
            </CardContentComponent>

          <NoticeTime></NoticeTime>
          <DistinctLineGray></DistinctLineGray>
          </CardButton>
        </NoticeCard>
        
      ))}
      <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{zIndex: 1}}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)} >
            <ModalBackground style={{zIndex: 1}}>
              <ModalComponent>
                <ModalText>알림을  '전체삭제'하시겠습니까?</ModalText>
                <ModalSubComponent>
                  
                  <View style={css`flex-direction: row; margin-top: 10px; justify-content: space-between`}>
                    <SelectButton onPress={deleteAllNotices}>
                      <ButtonText>확인</ButtonText>
                    </SelectButton>
                    <SelectButton onPress={() => setModalVisible(false)} >
                      <ButtonText>취소</ButtonText>
                    </SelectButton>
                  </View>
                </ModalSubComponent>
              </ModalComponent>
            </ModalBackground>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    </GlobalContainer>
  );
};

export default NoticeTab;
