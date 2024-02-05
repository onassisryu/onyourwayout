import styled from '@emotion/native';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React, {useState} from 'react';
import {Modal, TouchableWithoutFeedback, ImageSourcePropType} from 'react-native';

const ButtonContainer = styled(GlobalButton)`
  position: absolute;
  right: 20px;
  bottom: 10px;
  width: 50px;
  height: 50px;
  border-radius: 30px;
  background-color: ${props => props.theme.color.primary};
  z-index: 200;
`;

const ModalText = styled(GlobalText)`
  color: ${props => props.theme.color.black};
  font-weight: bold;
  line-height: 45px;
`;

const ModalBackground = styled(GlobalContainer)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalComponent = styled(GlobalContainer)`
  position: absolute;
  right: 20px;
  bottom: 130px;
  width: 170px;
  height: 150px;
  border: 2px solid ${props => props.theme.color.primary};
  border-radius: 15px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const ModalSubComponent = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const ModalImage = styled.Image`
  width: 50px;
  height: 50px;
  resize-mode: contain;
`;

const DistinctLine = styled.View`
  width: 140px;
  border: 1px solid #b2b2b2;
`;

const outImage: ImageSourcePropType = require('images/나가요잉.png');
const inImage: ImageSourcePropType = require('images/해줘요잉.png');

const MainPlusButton = ({navigation}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <ButtonContainer onPress={() => setModalVisible(true)}>
        <FontAwesome5 name="plus" size={25} color="white" />
      </ButtonContainer>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        style={{zIndex: 1}}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)} style={{zIndex: 1}}>
          <ModalBackground style={{zIndex: 1}}>
            <ModalComponent>
              <ModalSubComponent
                onPress={() => {
                  navigation.navigate('GoOut1');
                  setModalVisible(false);
                }}>
                <ModalImage source={outImage} />
                <ModalText> 나가요잉 </ModalText>
              </ModalSubComponent>
              <DistinctLine></DistinctLine>
              <ModalSubComponent
                onPress={() => {
                  navigation.navigate('DoIt1');
                  setModalVisible(false);
                }}>
                <ModalImage source={inImage} />
                <ModalText> 해줘요잉 </ModalText>
              </ModalSubComponent>
            </ModalComponent>
          </ModalBackground>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default MainPlusButton;
