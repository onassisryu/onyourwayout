import React, {useState} from 'react';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {Modal, View, ImageSourcePropType, TouchableWithoutFeedback} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {userDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';

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
  width: 42%;
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
  padding: 15px 10px 15px 10px;
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

const ApartSelectionModal = (props: Props) => {
  const userData = useRecoilValue(userDataState);

  // apt 값이 배열인지 확인
  const isAptArray = Array.isArray(userData.apt.name);
  // apt 값이 배열이면 그대로 사용하고, 아니라면 배열로 변환
  const aptArray = isAptArray ? userData.apt.name : [userData.apt.name];

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
              {aptArray.map((apart:string) => (
                <View>
                  <ModalSubComponent
                    onPress={() => {
                      props.setSelectedApart(apart);
                      props.setApartModalVisible(false);
                    }}>
                    <MaterialIcons name="apartment" size={25}></MaterialIcons>
                    <ModalText>
                      {' '}
                      {apart}
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

export default ApartSelectionModal;
