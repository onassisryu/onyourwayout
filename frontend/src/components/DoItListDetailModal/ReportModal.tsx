import React, {useState} from 'react';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {Modal, View, ImageSourcePropType, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationProp } from '@react-navigation/native';

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

`;

interface Props {
    modalVisible: boolean;
    setModalVisible: (state: boolean) => void;
    navigation: NavigationProp<any>
  }
  
  const ReportModal = ( props: Props ) => {
  

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
                    props.navigation.navigate('Bottom', {screen: '아파트'});
                    props.setModalVisible(false);
                  }}>
  
                  <ModalText> 신고하기 </ModalText>
                </ModalSubComponent>
                <DistinctLine/>
              </ModalComponent>
            </ModalBackground>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  };

export default ReportModal;
