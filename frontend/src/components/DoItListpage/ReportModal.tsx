import React, { useState, useEffect, useRef} from 'react';
import styled, {css} from '@emotion/native';
import theme from '@/Theme';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import { 
    Modal,
    Animated,
    TouchableOpacity,
    View,
    ImageSourcePropType,
    TouchableWithoutFeedback,
} from 'react-native';
import {NavigationProp} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';


const ModalBackground = styled(GlobalButton)`
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: 0px;
`;

const ModalComponent = styled(Animated.View)`
  position: absolute;
  bottom: 0px;
  width: 100%;
  height: 75px;
  border: 2px solid #00D282;
  border-radius: 10px 10px 0px 0px;
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
  font-size: ${theme.fontSize.subtitle};
  color:  ${theme.color.black};
  font-weight: bold;

`;


interface Props {
  navigation: NavigationProp<any>;
  reportModalVisible: boolean;
  selectedCard: object;
  setReportModalVisible: (state: boolean) => void;
}

const ReportModal = (props: Props) => {
   
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(1000)).current;  // 초기 위치를 화면 밖으로 설정

    const fadeIn = () => {
        Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,  // 'useNativeDriver'를 true로 설정하여 성능을 향상시킵니다.
        }).start();
    };

    const slideUp = () => {
        Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        }).start();
    };

    const openModal = () => {
        fadeIn();
        slideUp();
    };

    useEffect(() => {
        if (props.reportModalVisible) {
        openModal();
        }
    }, [props.reportModalVisible]);
   

    return (
        <>
            {props.reportModalVisible && (
                <Modal
                animationType="none" 
                transparent={true}
                visible={props.reportModalVisible}
                onRequestClose={() => {
                    props.setReportModalVisible(false);
                }}
                >
                <ModalBackground onPress={() => {props.setReportModalVisible(false); }}> 
                  <TouchableWithoutFeedback>
                    <View></View>
                  </TouchableWithoutFeedback>
                </ModalBackground>
                

                <ModalComponent > 
                    <ModalSubComponent onPress={() => {props.navigation.navigate('Report', {card: props.selectedCard}); props.setReportModalVisible(false);}}>
                      <Octicons name='report' size={30}/>
                      <ModalText> 신고하기 </ModalText >
                    </ModalSubComponent>
                </ModalComponent>
                </Modal>
            )}
        </>
      );
    };
    

export default ReportModal;