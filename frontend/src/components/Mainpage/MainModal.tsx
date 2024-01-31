import React, { useState } from 'react';
import styled from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import { 
    Modal,
    View,
    ImageSourcePropType,
    TouchableWithoutFeedback,
} from 'react-native';


const AddButton = styled(GlobalButton)`
  position: absolute;

  bottom: 1px;
  width: 50px;
  height: 50px;
  border-radius: 30px;
  background-color: #00D282;
`;

const PlusText = styled(GlobalText)`
  color: white;
  font-size: 45px;
  line-height: 40px;
`;


const ModalBackground = styled(GlobalContainer)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
`;

const ModalComponent = styled(GlobalContainer)`
  position: absolute;
  right: 20px;
  bottom: 160px;
  width: 170px;
  height: 150px;
  border: 2px solid #00D282;
  border-radius: 15px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const ModalSubComponent = styled(GlobalButton)`
  flex-direction: row;
  justify-content: space-between;
  background-color: white;
  align-items: center;
  padding: 10px;
`;

const ModalText = styled(GlobalText)`
  font-size: ${theme.fontSize.subtitle};
  color:  ${theme.color.black};
  font-weight: bold;
  line-height: 45px;
`;

const ModalImage = styled.Image`
  width: 50px;
  height: 50px;
  resize-mode: contain;
`;

const DistinctLine = styled(GlobalContainer)`
  width: 140px;
  border: 1px solid #B2B2B2;
`;


const MainModal = () => {
     
    const [modalVisible, setModalVisible] = useState(false);
    
    const outImage: ImageSourcePropType = require('images/나가요잉.png');
    const inImage: ImageSourcePropType = require('images/해줘요잉.png');

    return (
        <View>
          <AddButton onPress={() => setModalVisible(true)}>
            <PlusText>+</PlusText>
          </AddButton>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(false);
            }}
        >
            <TouchableWithoutFeedback style={{ position: 'absolute', bottom: 20, right: 20 }} onPress={() => setModalVisible(false)}>
                <ModalBackground>
                <ModalComponent>
                    <ModalSubComponent onPress={() => {}}>
                    <ModalImage source={outImage}/> 
                    <ModalText> 나가요잉 </ModalText>
                    </ModalSubComponent>
                    <DistinctLine></DistinctLine>
                    <ModalSubComponent onPress={() => {}}>
                    <ModalImage source={inImage}/> 
                    <ModalText> 해줘요잉 </ModalText>
                    </ModalSubComponent>
                </ModalComponent>
                </ModalBackground>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
    )
        }

export default MainModal;