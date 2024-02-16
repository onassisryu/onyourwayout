import React, {useState, useEffect} from 'react';
import {ImageSourcePropType, StatusBar, View, Text, ScrollView, TouchableOpacity, Modal} from 'react-native';
import styled, {css} from '@emotion/native';
import EditDeleteModal from '@/components/DoItListDetailModal/EditDeleteModal';
import ReportModal from '@/components/DoItListDetailModal/ReportModal';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-vector-icons/Feather';
import SvgIcon from '@/components/SvgIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GoBack from '@/components/Signup/GoBack';
import axiosAuth from '@/axios/axiosAuth';
import Feather from 'react-native-vector-icons/Feather';
import {getStorage} from '@/storage/common_storage';
import {useRecoilState, useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';

const SubContainer = styled(GlobalContainer)`
  width: 100%;
  margin: 10px;
  height: initial;
  margin-right: 20px;
  margin-left: 20px;
`;

const HeaderContainer = styled(Header)`
  width: 100%;
  height: 20px;
`;

const GoBackButton = styled(GlobalButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: transparent;
  margin: 30px 0px 30px 0px;
`;

const ShareButton = styled(GlobalButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  margin: 30px 0px 30px 0px;
`;

const DoItListImage = styled.Image`
  height: 400px;
  width: 100%;
  padding: 0;
`;

const TotalComponent = styled(ScrollView)`
  height: 2000px;
`;

const SubHeader = styled(GlobalContainer)`
  flex-direction: row;
  align-items: center;
  height: 80px;
`;

const ProfileComponent = styled(GlobalContainer)`
  height: initial;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 7px 5px 0px 5px;
`;

const TextNickname = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  padding-bottom: 1px;
`;

const TextApart = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  font-weight: bold;
  padding-bottom: 12px;
`;

const DistinctLine = styled.View`
  width: 100%;
  border: 1px solid #b2b2b2;
`;

const ContentComponent = styled(GlobalContainer)`
  flex-direction: column;
  align-items: flex-start;
  height: initial;
`;

const TextTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  padding: 30px 0px 0px 0px;
  font-weight: bold;
`;

const TextCategory = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.gray};
  padding: 10px 0px 0px 0px;
`;

const TextContent = styled(GlobalText)`
  width: 390px;
  line-height: 24px;
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  padding: 25px 0px 0px 0px;
`;

const InfoComponent = styled(GlobalContainer)`
  flex-direction: row;
  align-items: flex-end;
  width: 100%;
  height: initial;
`;

const TextInfo = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  padding: 25px 0px 5px 0px;
`;

const TextPrice = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  font-weight: bold;
`;

const TextReport = styled(GlobalText)`
  margin-top: 10px;
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  padding: 0px 0px 5px 0px;
  text-decoration-line: underline;
`;

const ButtonComponent = styled(GlobalContainer)`
  position: absolute;
  top: 800px;
  display: flex;
  flex-direction: row;
  padding: 10px 20px 10px 20px;
  height: initial;
`;

const LikeButton = styled(GlobalButton)`
  width: 70px;
  height: 60px;
  border: white;
  background-color: ${props => props.theme.color.primary};
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const AgreeButton = styled(GlobalButton)`
  flex-direction: row;
  width: 150px;
  height: 60px;
  border: white;
  background-color: ${props => props.theme.color.primary};
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const ChatButton = styled(GlobalButton)`
  flex-direction: row;
  width: 150px;
  height: 60px;
  border: white;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: #f44747;
`;

const ButtonText = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.white};
  font-weight: bold;
  margin-left: 5px;
  margin-bottom: 4px;
`;

const dealTypeTextMap = {
  PET: '애완동물 산책',
  RECYCLE: '분리수거',
  SHOP: '장보기',
  ETC: '기타',
};

const ComplaintTag = ({complainType}: {complainType: any}) => {
  var type;
  var backgroundColor;
  if (complainType === 'Sexual') {
    type = '선정성';
    backgroundColor = '#ff5151';
  } else if (complainType === 'Spam') {
    type = '광고';
    backgroundColor = '#eb8039';
  } else if (complainType === 'Violent') {
    type = '욕설';
    backgroundColor = '#e2c860';
  } else if (complainType === 'LegalIssue') {
    type = '법적문제';
    backgroundColor = '#0c7d0c';
  } else if (complainType === 'Harmful') {
    type = '유해정보';
    backgroundColor = '#5c9bf9';
  } else {
    type = '기타';
    backgroundColor = '#9a59fb';
  }

  return (
    <View
      style={css`
        background-color: ${backgroundColor};
        justify-content: center;
        text-align: center;
        align-items: center;
        width: 70px;
        height: 30px;
        border-radius: 15px;
      `}>
      <Text
        style={css`
          font-size: 15px;
          color: #ffffff;
        `}>
        {type}
      </Text>
    </View>
  );
};

const ComplainCard = ({complaint}: {complaint: any}) => {
  return (
    <View
      style={css`
        width: 90%;
        align-items: center;
        padding: 15px;
        border-radius: 15px;
        border: 1px solid #bbbbbb;
        height: 100px;
        flex-direction: row;
        margin-top: 5px;
        margin-bottom: 5px;
      `}>
      <View
        style={css`
          flex-direction: column;
          height: 100%;
          padding: 10px;
          justify-content: space-between;
        `}>
        <ComplaintTag complainType={complaint.complaintType} />
        <Text
          style={css`
            font-size: 10px;
            color: #000000;
            font-weight: bold;
            text-align: center;
          `}>
          {complaint.createdAt.substring(0, 10)}
        </Text>
      </View>
      <Text
        style={css`
          font-size: 17px;
          color: #000000;
          font-weight: bold;
          padding-bottom: 1px;
          padding-left: 10px;
          width: 70%;
        `}>
        {complaint.content}
      </Text>
    </View>
  );
};

const AdminComplainDealDetail = ({route, navigation}: any) => {
  const param = route.params;

  const [responseData, setResponseData] = useState<any>({});
  const [userInfo, setUserInfo] = useState<any>({});
  const [detailImage, setDetailImage] = useState<any[]>([]);
  const [complaintDetail, setComplaintDetail] = useState<any[]>([]);
  const [dealId, setDealId] = useState<number>(0);

  useEffect(() => {
    console.log('param', param);
    axiosAuth
      .get(`/deal/${param.id}`)
      .then(resp => {
        setResponseData(resp.data);
        setUserInfo(resp.data.requestInfo);
        setDetailImage(resp.data.dealImages);
        setDealId(resp.data.id);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });

    axiosAuth
      .get(`/admin/manages/deal/${param.id}`)
      .then(resp => {
        setComplaintDetail(resp.data.complaints);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, [param]);

  const penaltyMember = (memberId: number, dealId: number) => {
    console.log('penaltyMember memberId', memberId);
    axiosAuth
      .put(`/admin/manages/pause?memberId=${memberId}&dealId=${dealId}`)
      .then(resp => {
        console.log('패널티 처리를 완료하였습니다', resp.data);
        navigation.goBack();
      })
      .catch(error => {
        console.error('인증을 처리하는 중 오류가 발생:', error);
      });
  };

  const reOpenDeal = (dealId: number) => {
    axiosAuth
      .put(`/admin/manages/deal/re-open/${dealId}`)
      .then(resp => {
        navigation.goBack();
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  };

  const calculateTimeAgo = (createdAt: string) => {
    const now = new Date(); // 현재 시간
    const created = new Date(createdAt); // createdAt을 Date 객체로 변환
    const diff = now.getTime() - created.getTime(); // 현재 시간과 createdAt 사이의 차이(밀리초)
    const minutesAgo = Math.floor(diff / (1000 * 60)); // 밀리초를 분으로 변환하여 계산
    const hoursAgo = Math.floor(minutesAgo / 60); // 분을 시간으로 변환하여 계산
    const daysAgo = Math.floor(hoursAgo / 24); // 시간을 일로 변환하여 계산

    if (daysAgo > 30) {
      // 30일 이상인 경우 한 달 전을 반환
      const monthsAgo = Math.floor(daysAgo / 30);
      return `${monthsAgo}달 전`;
    } else if (daysAgo > 7) {
      // 7일 이상인 경우 일주일 전을 반환
      const weeksAgo = Math.floor(daysAgo / 7);
      return `${weeksAgo}주일 전`;
    } else if (daysAgo > 0) {
      // 1일 이상인 경우 일수로 반환
      return `${daysAgo}일 전`;
    } else if (hoursAgo > 0) {
      // 1시간 이상인 경우 시간으로 반환
      return `${hoursAgo}시간 전`;
    } else {
      // 1시간 미만인 경우 분으로 반환
      return `${minutesAgo}분 전`;
    }
  };

  return (
    <View
      style={css`
        width: 100%;
        position: relative;
        background-color: white;
        align-items: center;
      `}>
      <View // 헤더
        style={css`
          height: 60px;
          width: 100%;
        `}>
        <Header>
          <GoBack />
          <Text
            style={css`
              font-size: 27px;
              color: #000000;
              font-weight: bold;
            `}>
            신고 글 조회
          </Text>
          <View style={{width: 40}} />
        </Header>
      </View>
      <View
        style={css`
          width: 100%;
        `}>
        <ScrollView showsVerticalScrollIndicator={false} overScrollMode="never">
          <View style={css``}>
            <View>
              {detailImage.length > 0 ? (
                <DoItListImage src={detailImage[0].imgUrl} />
              ) : (
                <DoItListImage
                  src={
                    'data:image/png;base64,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'
                  }
                />
              )}
            </View>
            <SubContainer>
              <SubHeader>
                <SvgIcon name="profile" size={40} />
                <ProfileComponent>
                  <TextNickname> {userInfo.nickname}</TextNickname>
                  <TextApart>
                    {' '}
                    {userInfo.dongName}동 / {calculateTimeAgo(responseData.createdAt)}
                  </TextApart>
                </ProfileComponent>
              </SubHeader>
              <DistinctLine></DistinctLine>
              <ContentComponent>
                <TextTitle numberOfLines={1}>{responseData.title}</TextTitle>
                <InfoComponent>
                  {responseData.dealType === 'PET' && <SvgIcon name="puppy" size={20} />}
                  {responseData.dealType === 'RECYCLE' && <SvgIcon name="bags" size={23} />}
                  {responseData.dealType === 'SHOP' && <SvgIcon name="shopping" size={20} />}
                  {responseData.dealType === 'ETC' && <SvgIcon name="building" size={20} />}
                  <TextCategory> {dealTypeTextMap[responseData.dealType]}</TextCategory>
                </InfoComponent>
                <InfoComponent>
                  {responseData.rewardType === 'CASH' && <TextPrice>{responseData.cash.toLocaleString()}원</TextPrice>}
                  {responseData.rewardType === 'ITEM' && <TextPrice>{responseData.item}</TextPrice>}
                </InfoComponent>

                <TextContent>{responseData.content}</TextContent>
              </ContentComponent>
            </SubContainer>
          </View>
          <View
            style={css`
              height: 60px;
              justify-content: center;
              border-top-width: 2px;
              border-style: dashed;
              border-top-color: #000000;
              margin: 10px;
            `}>
            <Text
              style={css`
                text-align: center;
                font-size: 30px;
              `}>
              신고 내역
            </Text>
          </View>
          <View
            style={css`
              width: 100%;
            `}>
            {complaintDetail.map((complaint: any, index: number) => (
              <View
                key={index}
                style={css`
                  width: 100%;
                  align-items: center;
                `}>
                <ComplainCard complaint={complaint} />
              </View>
            ))}
          </View>
          <View style={{height: 200}}></View>
        </ScrollView>
      </View>
      <View
        style={css`
          flex-direction: row;
          position: absolute;
          height: 30px;
          bottom: 100px;
          z-index: 1;
        `}>
        <View
          style={css`
            flex-direction: row;
          `}>
          <AgreeButton
            onPress={() => {
              reOpenDeal(dealId);
            }}>
            <FontAwesome name="close" size={20} color="white"></FontAwesome>
            <ButtonText> 신고 취소 </ButtonText>
          </AgreeButton>
          <ChatButton
            onPress={() => {
              penaltyMember(userInfo.id, dealId);
            }}>
            <FontAwesome name="legal" size={20} color="white"></FontAwesome>
            <ButtonText> 패널티 주기 </ButtonText>
          </ChatButton>
        </View>
      </View>
    </View>
  );
};

export default AdminComplainDealDetail;
