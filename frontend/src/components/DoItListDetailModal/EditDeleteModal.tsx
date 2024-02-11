import React, {useState} from 'react';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {Modal, View, ImageSourcePropType, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';
import axiosAuth from '@/axios/axiosAuth';

const ModalBackground = styled(GlobalContainer)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  height: initial;
`;

const ModalComponent = styled(GlobalContainer)`
  position: absolute;
  right: 20px;
  top: 60px;
  height: initial;
  border: 2px solid #00d282;
  border-radius: 15px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const ModalSubComponent = styled(GlobalButton)`
  flex-direction: row;
  justify-content: flex-start;
  background-color: white;
  align-items: flex-start;
  padding: 15px 2px 15px 2px;
`;

const ModalText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: bold;
`;

const DistinctLine = styled(GlobalContainer)`
  width: 150px;
  height: initial;
  border: 0.51px solid #b2b2b2;
`;

interface Props {
  modalVisible: boolean;
  setModalVisible: (state: boolean) => void;
  navigation: NavigationProp<any>
  data: object;
}

const EditDeleteModal = ( props: Props ) => {
    console.log('성공해쪄요',props.data)

    const handleDelete = () => {
      const id = props.data.id;  // 삭제할 게시글의 ID
      axiosAuth.delete(`deal/${id}`)  // 서버에 DELETE 요청을 보냅니다.
        .then(() => {
          console.log('성공맨이야')
          props.setModalVisible(false);  // 모달을 닫습니다.
          props.navigation.navigate('Bottom', {screen: '아파트'});  // 아파트 페이지로 이동합니다.
        })
        .catch(error => {
          console.error('게시글을 삭제하는 중 오류 발생:', error);
        });
    };
    
    return (
        <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={props.modalVisible}
          onRequestClose={() => props.setModalVisible(false)}
          style={{zIndex: 1}}>
          <TouchableWithoutFeedback onPress={() => props.setModalVisible(false)} style={{zIndex: 1}}>
            <ModalBackground style={{zIndex: 1}}>
              <ModalComponent>
                <ModalSubComponent
                  onPress={() => {
                    props.navigation.navigate('DoItPut', {data: props.data});
                    props.setModalVisible(false);
                  }}>
  
                  <ModalText> 게시글 수정 </ModalText>
                </ModalSubComponent>
                <DistinctLine></DistinctLine>
                <ModalSubComponent
                  onPress={handleDelete}>
                  <ModalText> 게시글 삭제 </ModalText>
                </ModalSubComponent>
              </ModalComponent>
            </ModalBackground>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  };

export default EditDeleteModal;
