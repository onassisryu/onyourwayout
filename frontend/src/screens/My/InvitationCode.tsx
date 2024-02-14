import React, {useState} from 'react';
import styled, {css} from '@emotion/native';
import {GlobalContainer} from '@/GlobalStyles';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import MypageButton from '@/components/Mypage/MypageButton';
import {MypageBodyContainer} from '@/components/Mypage/MypageBodyContainer';
import {View, ToastAndroid} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard'; // clipboard 추가
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';

const BodyContainer = styled(MypageBodyContainer)`
  justify-content: center;
  align-items: center;
`;
const HeadText = styled.Text`
  font-size: 25px;
  font-weight: 700;
  margin-top: 150px;
  padding-bottom: 30px;
`;
const StyledText = styled.Text`
  font-size: 22px;
  margin-bottom: 10px;
`;

const InvitationCode = () => {
  const userData = useRecoilValue(userDataState);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(userData.inviteCode);
    // ToastAndroid.show('클립보드에 복사되었습니다.', ToastAndroid.SHORT);
    setCopied(true);
  };

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
      </Header>
      <BodyContainer>
        <HeadText>나의 초대 코드</HeadText>
        <View
          style={css`
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 20px;
            height: 130px;
            width: 100%;
            border-radius: 10px;
            background-color: #f2f2f2;
            margin-bottom: 30px;
            padding: 10px;
          `}>
          {copied ? <StyledText>{userData.inviteCode}</StyledText> : <StyledText>코드를 발급해주세요</StyledText>}
        </View>

        <MypageButton title={copied ? '복사 완료' : '초대코드 발급'} color="primary" onPress={copyToClipboard} />
      </BodyContainer>
    </GlobalContainer>
  );
};

export default InvitationCode;
