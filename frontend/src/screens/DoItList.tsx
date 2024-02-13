import React, {useState, useEffect} from 'react';
import {Button, ScrollView, View, ImageSourcePropType, Text} from 'react-native';
import styled, {css} from '@emotion/native';
import Feather from 'react-native-vector-icons/Feather';
import DoItListHeader from '@components/DoItListpage/DoItListHeader';
import DoItListCategory from '@components/DoItListpage/DoItListCategory';
import ApartSelectionModal from '@components/DoItListpage/ApartSelectionModal';
import ReportModal from '@components/DoItListpage/ReportModal';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';
import SvgIcon from '@components/SvgIcon';
import {useRecoilValue} from 'recoil';
import {userDataState} from '@/recoil/atoms';

const DoItListCardComponent = styled(ScrollView)`
  padding: 10px 20px;
`;

const DoItListButton = styled(GlobalButton)`
  background-color: white;
  border-radius: 0px;
  padding: 10px 0px;
`;

const DoItListCard = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 130px;
`;

const DoItListImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  resize-mode: cover;
`;

const CardTextContainer = styled(GlobalContainer)`
  position: relative;
  flex: 1;
  width: 100%;
  margin-left: 20px;
  flex-direction: column;
  align-items: flex-start;
`;

const ReportButton = styled(GlobalButton)`
  position: absolute;
  background-color: white;
  top: 7px;
  right: 5px;
`;

const TextTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  margin-bottom: 1px;
`;

const TextApart = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color: ${props => props.theme.color.gray};
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 12px;
`;

const TextContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.black};
  padding: 5px 0px 5px 0px;
`;

const TextPrice = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  margin-right: 10px;
  font-weight: bold;
`;

const DistinctLine = styled.View`
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid #efefef;
`;

const CardImageContainer = styled(View)`
  width: 130px;
  height: 100%;
  border-radius: 10px;
  background-color: aliceblue;
`;

interface DealImage {
  // DealImage에 대한 필드를 정의해주세요.
  imgUrl: string;
}

interface DoListCard {
  id: number;
  title: string;
  content: string;
  requestId: number;
  acceptId: number | null;
  cash: number;
  item: any;
  rewardType: string;
  complaint: number;
  dealStatus: string;
  dealType: string;
  expireAt: string;
  dealImages: DealImage[];
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
  requestInfo: {
    dongId: number;
    dongName: string;
    requestType: string;
    requestContent: string;
    requestStatus: string;
    createdAt: string;
    modifiedAt: string;
    deletedAt: string | null;
  };
}

const DoItList = ({navigation}: any) => {
  const userData = useRecoilValue(userDataState);
  const [selectedApartCategory, setSelectedApartCategory] = useState<string>('');
  const [selectedTypeCategory, setSelectedTypeCategory] = useState<string>('');

  const [apartModalVisible, setApartModalVisible] = useState<boolean>(false);
  const [selectedApart, setSelectedApart] = useState('');

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [cardListData, setCardListData] = useState<DoListCard[]>([]);

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

  useEffect(() => {
    axiosAuth
      .get('deal/dong/list')
      .then(resp => {
        setCardListData(resp.data);
        console.log('카드리스트 api 호출 성공', resp.data[0]);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, [userData]);
  //한번렌더링하고 새로고침하면 다시랜더링 해야됨~

  const categoryToDealType = (category: string) => {
    switch (category) {
      case '반려동물 산책':
        return 'PET';
      case '심부름':
        return 'SHOP';
      case '분리수거':
        return 'RECYCLE';
      case '기타':
        return 'ETC';
      default:
        return '';
    }
  };

  let filteredData = cardListData;
  if (selectedTypeCategory) {
    filteredData = cardListData.filter(card => card.dealType === categoryToDealType(selectedTypeCategory));
  }

  return (
    <GlobalContainer>
      <DoItListHeader navigation={navigation}></DoItListHeader>
      <DoItListCategory
        selectedApartCategory={selectedApartCategory}
        selectedTypeCategory={selectedTypeCategory}
        setSelectedApartCategory={setSelectedApartCategory}
        setSelectedTypeCategory={setSelectedTypeCategory}
        setApartModalVisible={setApartModalVisible}
        selectedApart={selectedApart}
        setSelectedApart={setSelectedApart}
      />
      <ScrollView overScrollMode="never">
        <DoItListCardComponent>
          {filteredData.map((card, index) => (
            <View key={index}>
              <DoItListButton onPress={() => navigation.navigate('DoItListDetail', {id: card.id})}>
                <DoItListCard>
                  <CardImageContainer>
                    {card.dealImages.length > 0 && <DoItListImage src={card.dealImages[0].imgUrl} />}
                  </CardImageContainer>

                  <CardTextContainer>
                    <ReportButton onPress={() => setReportModalVisible(true)}>
                      <Feather
                        name="more-vertical"
                        size={25}
                        style={css`
                          color: #c4c4c4;
                        `}></Feather>
                    </ReportButton>

                    <View
                      style={css`
                        flex: 1;
                        margin-top: 10px;
                      `}>
                      <TextTitle numberOfLines={1}>{card.title}</TextTitle>

                      <TextApart>
                        {card.requestInfo.dongName}동 / {calculateTimeAgo(card.createdAt)}
                        {card.id}
                      </TextApart>
                    </View>
                    <View
                      style={css`
                        width: 100%;
                        flex-direction: row;
                        justify-content: flex-end;
                        margin-top: 10px;
                      `}>
                      <TextPrice>
                        {' '}
                        {card.rewardType === 'CASH'
                          ? `${card.cash.toLocaleString()}원`
                          : card.rewardType === 'ITEM'
                          ? card.item
                          : 'Unknown Reward Type'}
                      </TextPrice>
                    </View>
                  </CardTextContainer>
                </DoItListCard>
              </DoItListButton>
              <DistinctLine />
            </View>
          ))}
        </DoItListCardComponent>
      </ScrollView>
      <ApartSelectionModal
        apartModalVisible={apartModalVisible}
        setApartModalVisible={setApartModalVisible}
        setSelectedApart={setSelectedApart}
      />
      <ReportModal reportModalVisible={reportModalVisible} setReportModalVisible={setReportModalVisible} />
    </GlobalContainer>
  );
};

export default DoItList;
