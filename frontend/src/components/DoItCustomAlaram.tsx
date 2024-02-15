import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import theme from '@/Theme';
import Modal from 'react-native-modal';
import ProgressBarComponent from './ProgressBarComponent';
import {Text, View} from 'react-native';
import axiosAuth from '@/axios/axiosAuth';
import {useState} from 'react';

const CustomAlertContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CustomAlertContent = styled.View`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 95%;
  height: 55%;
  align-items: center;
`;

const CustomAlertTitle = styled.Text`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 5px;
`;

const CustomAlertText = styled.Text`
  font-size: 17px;
  margin-bottom: 20px;
  color: gray;
`;

const CustomAlertCard = styled.View`
  width: 80%;
  height: 150px;
  border: 1px solid gray;
  border-radius: 10px;
  margin-bottom: 20px;
`;

const CustomAlertCardRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 100%;
`;

const CustomAlertAvatar = styled.View`
  height: 100px;
  width: 40%;
  border-radius: 100px;
  margin: 10px;
  background-color: ${({theme}) => theme.color.gray100};
`;

const CustomAlertUserInfo = styled.View`
  width: 50%;
`;

const CustomAlertUserInfoName = styled.Text`
  font-size: 20px;
  font-weight: 700;
`;

const CustomAlertUserInfoLocation = styled.Text`
  font-size: 15px;
  font-weight: 700;
  color: ${({theme}) => theme.color.gray300};
  margin-bottom: 10px;
`;

const CustomAlertNeighborIndex = styled.Text`
  /* 이웃지수 스타일링 */
`;

const CustomAlertProgressBar = styled.View`
  height: 30px;
  width: 90%;
  margin-bottom: 20px;
  justify-content: flex-start;
  padding: 2px;
`;

const CustomAlertTimerContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 90%;
`;
const Scorebarbackground = styled.View`
  height: 15px;
  width: 100%;
  border-radius: 10px;
  background-color: #eaeaea;
  position: relative;
`;
const Scorebar = styled.View`
  height: 15px;
  border-radius: 10px;
  background-color: ${theme.color.primary};
  position: absolute;
`;

const CustomAlertAcceptButton = styled.TouchableOpacity`
  width: 47%;
  height: 50px;
  background-color: ${({theme}) => theme.color.primary};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

const CustomAlertRejectButton = styled.TouchableOpacity`
  width: 47%;
  height: 50px;
  background-color: ${({theme}) => theme.color.gray};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

interface CustomAlertProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  dealId: string;
  acceptId: string;
  nickname: string;
  dong: string;
  memberScore: number;
  time: number;
}

const CustomAlert = ({
  visible,
  title,
  onClose,
  dealId,
  acceptId,
  nickname,
  dong,
  memberScore,
  time,
}: CustomAlertProps) => {
  function acceptGoOut(dealId: string, acceptId: string) {
    console.log('dealId', dealId);
    console.log('acceptId', acceptId);
    axiosAuth
      .put(`deal/out-recommend/${dealId}/${acceptId}`)
      .then(resp => {
        console.log('나가요잉 매칭 성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }

  function cancelGoOut(dealId: string, acceptId: string) {
    console.log('dealId', dealId);
    console.log('acceptId', acceptId);
    axiosAuth
      .get(`deal/out-recommend/${dealId}/${acceptId}/cancel`)
      .then(resp => {
        console.log('나가요잉 매칭 실패', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }
  return (
    <Modal isVisible={visible}>
      <CustomAlertContainer>
        <CustomAlertContent>
          <CustomAlertTitle>[{title}]</CustomAlertTitle>
          <CustomAlertText>매칭을 기다리고 있습니다</CustomAlertText>
          <CustomAlertCard>
            <CustomAlertCardRow>
              <CustomAlertAvatar />
              <CustomAlertUserInfo>
                <CustomAlertUserInfoName>{nickname}</CustomAlertUserInfoName>
                <CustomAlertUserInfoLocation>{dong}동</CustomAlertUserInfoLocation>
                <CustomAlertNeighborIndex>이웃지수</CustomAlertNeighborIndex>
                <View
                  style={css`
                    width: 100%;
                    margin-top: 5px;
                  `}
                />
                <Scorebarbackground>
                  <Scorebar
                    style={css`
                      width: ${memberScore}%;
                    `}></Scorebar>
                </Scorebarbackground>
              </CustomAlertUserInfo>
            </CustomAlertCardRow>
          </CustomAlertCard>
          <CustomAlertProgressBar>
            <ProgressBarComponent dealId={dealId} acceptId={acceptId} />
          </CustomAlertProgressBar>
          <CustomAlertTimerContainer>
            <CustomAlertAcceptButton onPress={() => acceptGoOut(dealId, acceptId)}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>수락하기</Text>
            </CustomAlertAcceptButton>
            <CustomAlertRejectButton onPress={() => cancelGoOut(dealId, acceptId)}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 700}}>거절하기</Text>
            </CustomAlertRejectButton>
          </CustomAlertTimerContainer>
        </CustomAlertContent>
      </CustomAlertContainer>
    </Modal>
  );
};

export default CustomAlert;
