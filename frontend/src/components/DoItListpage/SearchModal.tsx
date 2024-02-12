import React, {useState} from 'react';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {Modal, View, ImageSourcePropType, TouchableWithoutFeedback, TextInput} from 'react-native';
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
  top: 30px;
  width: 70%;
  height: initial;
  max-width: 250px;
  border: 2px solid #00d282;
  border-radius: 15px;
  background-color: white;
  justify-content: center;
  align-items: center;
`;

const ModalInputComponent = styled(TextInput)`
  flex-direction: row;
  justify-content: flex-start;
  background-color: white;
  align-items: flex-start;
  text-align: left; 
  padding: 15px 10px 15px 0px;
`;

const ModalSubComponent = styled(GlobalButton)`
  position: absolute;
  right: 2px;
  justify-content: center;
  background-color: ${props => props.theme.color.primary};
  align-items: center;
  padding: 10px 2px 10px 2px;
  
  width: 25%;
`;

const ModalText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;

`;

interface Props {
  isSearchModalVisible: boolean;
  setSearchModalVisible: (state: boolean) => void;
}

const MainModal = (props: Props) => {
  
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <GlobalContainer
      style={css`
        height: initial;
      `}>
        <Modal
            animationType="fade"
            transparent={true}
            visible={props.isSearchModalVisible}
            onRequestClose={() => {
                props.setSearchModalVisible(!props.isSearchModalVisible);
            }}
        >
        <TouchableWithoutFeedback onPress={() => props.setSearchModalVisible(false)} style={{zIndex: 1}}>
          <ModalBackground style={{zIndex: 1}}>
            <ModalComponent>
              <ModalInputComponent 
                placeholder="검색어를 입력하세요..." 
                onChangeText={text => setSearchTerm(text)}  
              />
              <ModalSubComponent>
                <ModalText>검색</ModalText>
              </ModalSubComponent>
            </ModalComponent>
            
            </ModalBackground>
        </TouchableWithoutFeedback>
      </Modal>
    </GlobalContainer>
  );
};

export default MainModal;

