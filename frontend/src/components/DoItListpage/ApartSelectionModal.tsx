import React, {useState} from 'react';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {Modal, View, ImageSourcePropType, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ModalBackground = styled(GlobalContainer)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  height: initial;
`;

const ModalComponent = styled(GlobalContainer)`
  position: absolute;
  left: 20px;
  top: 100px;
  width: 200px;
  height: initial;
  max-width: 250px;
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
  flex: 1;
`;

const DistinctLine = styled(GlobalContainer)`
  width: 170px;
  height: initial;
  border: 0.51px solid #b2b2b2;
`;

interface Props {
  apartModalVisible: boolean;
  setApartModalVisible: (com: boolean) => void;
  setSelectedApart: (apart: string) => void;
}

const MainModal = (props: Props) => {
  const Apartlist = [
    {id: 1, apart: '싸피아파트', name: '303동', default: true},
    {id: 2, apart: '궁전아파트', name: '403동', default: false},
    {id: 3, name: '503동', default: false},
  ];

  return (
    <GlobalContainer
      style={css`
        height: initial;
      `}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.apartModalVisible}
        onRequestClose={() => {
          props.setApartModalVisible(false);
        }}
        style={{zIndex: 1}}>
        <TouchableWithoutFeedback onPress={() => props.setApartModalVisible(false)} style={{zIndex: 1}}>
          <ModalBackground style={{zIndex: 1}}>
            <ModalComponent>
              {Apartlist.map(apart => (
                <View key={apart.id}>
                  <ModalSubComponent
                    onPress={() => {
                      props.setSelectedApart(apart.name);
                      props.setApartModalVisible(false);
                    }}>
                    <MaterialIcons name="apartment" size={25}></MaterialIcons>
                    <ModalText>
                      {' '}
                      {apart.name} {apart.default ? '(기본)' : ''}
                    </ModalText>
                  </ModalSubComponent>
                  <DistinctLine />
                </View>
              ))}
              <ModalSubComponent>
                <GlobalText
                  style={css`
                    font-weight: bold;
                    margin: 1.5px;
                  `}>
                  {' '}
                  내 아파트 설정{' '}
                </GlobalText>
              </ModalSubComponent>
            </ModalComponent>
          </ModalBackground>
        </TouchableWithoutFeedback>
      </Modal>
    </GlobalContainer>
  );
};

export default MainModal;
