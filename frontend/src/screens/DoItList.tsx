import React, {useState, useEffect} from 'react';
import {Button, ScrollView, View, ImageSourcePropType} from 'react-native';
import styled, {css} from '@emotion/native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import DoItListHeader from '@components/DoItListpage/DoItListHeader';
import DoItListCategory from '@components/DoItListpage/DoItListCategory';
import DoItListContent from '@components/DoItListpage/DoItListContent';
import ApartSelectionModal from '@components/DoItListpage/ApartSelectionModal';
import ReportModal from '@components/DoItListpage/ReportModal';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';

interface Props {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}
const DoItListCardComponent = styled(ScrollView)`
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
`;

const DoItListButton = styled(GlobalButton)`
  padding-right: 260px;
  border-radius: 15px;
  background-color: white;
`;

const DoItListCard = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 130px;
`;

const DoItListImage = styled.Image`
  width: 120px;
  height: 110px;
  margin-right: 15px;
  resize-mode: cover;
  border-radius: 15px;
`;

const TextComponent = styled(GlobalContainer)`
  width: 230px;
  height: initial;
  flex-direction: column;
  align-items: flex-start;
`;

const ReportButton = styled(GlobalButton)`
  background-color: white;
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
  margin-bottom: 12px;
`;

const TextContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color: ${props => props.theme.color.black};
  padding: 5px 0px 5px 0px;
`;

const TextPrice = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  margin-bottom: 10px;
`;

const DistinctLine = styled.View`
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border: 1px solid #b2b2b2;
`;

interface DealImage {
  // DealImage에 대한 필드를 정의해주세요.
  // 예: id, url 등
}

interface DoListCard {
  id: number;
  title: string;
  content: string;
  requestId: number;
  acceptId: number | null;
  cash: number;
  item: any; // 'item'의 구조에 따라 적절한 타입을 지정해주세요.
  rewardType: string;
  complaint: number;
  dealStatus: string;
  dealType: string;
  expireAt: string;
  dealImages: DealImage[];
  createdAt: string;
  modifiedAt: string;
  deletedAt: string | null;
}

interface Props {
  navigation: NavigationProp<any>;
  selectedApartCategory: string;
  selectedTypeCategory: string;
  setReportModalVisible: (state: boolean) => void;
}
const dogImage: ImageSourcePropType = require('images/dog.png');
const turtleImage: ImageSourcePropType = require('images/turtle.png');
const DoItList = ({navigation, route}: Props) => {
  const [doListCards, setDoListCards] = useState<DoListCard[]>([
    {
      id: 50,
      title: '뽀삐 산책시켜주세요',
      content: 'content2',
      requestId: 13,
      acceptId: null,
      cash: 1110,
      item: null,
      rewardType: 'CASH',
      complaint: 0,
      dealStatus: 'OPEN',
      dealType: 'PET',
      expireAt: '2025-03-03T00:00:00',
      dealImages: [dogImage],
      createdAt: '2024-02-02T14:47:35.251175',
      modifiedAt: '2024-02-02T14:47:35.251175',
      deletedAt: null,
    },
    {
      id: 50,
      title: 'title2',
      content: 'content2',
      requestId: 13,
      acceptId: null,
      cash: 1110,
      item: null,
      rewardType: 'CASH',
      complaint: 0,
      dealStatus: 'OPEN',
      dealType: 'PET',
      expireAt: '2025-03-03T00:00:00',
      dealImages: [turtleImage],
      createdAt: '2024-02-02T14:47:35.251175',
      modifiedAt: '2024-02-02T14:47:35.251175',
      deletedAt: null,
    },
    {
      id: 50,
      title: 'title2',
      content: 'content2',
      requestId: 13,
      acceptId: null,
      cash: 1110,
      item: null,
      rewardType: 'CASH',
      complaint: 0,
      dealStatus: 'OPEN',
      dealType: 'PET',
      expireAt: '2025-03-03T00:00:00',
      dealImages: [turtleImage],
      createdAt: '2024-02-06T14:47:35.251175',
      modifiedAt: '2024-02-06T14:47:35.251175',
      deletedAt: null,
    },
    {
      id: 172,
      title: 'title2',
      content: 'content2',
      requestId: 13,
      acceptId: null,
      cash: 0,
      item: '담배3갑',
      rewardType: 'ITEM',
      complaint: 0,
      dealStatus: 'OPEN',
      dealType: 'PET',
      expireAt: '2025-03-03T00:00:00',
      dealImages: [turtleImage],
      createdAt: '2024-02-07T14:47:35.251175',
      modifiedAt: '2024-02-07T14:47:35.251175',
      deletedAt: null,
    },
  ]);
  const [selectedApartCategory, setSelectedApartCategory] = useState<string>('');
  const [selectedTypeCategory, setSelectedTypeCategory] = useState<string>('');

  const [apartModalVisible, setApartModalVisible] = useState<boolean>(false);
  const [selectedApart, setSelectedApart] = useState('');

  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [responseData, setResponseData] = useState([]);

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
        setResponseData(resp.data);
        console.log('성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);
  //한번렌더링하고 새로고침하면 다시랜더링 해야됨~

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
          {responseData.map((card, index) => (
            <View key={index}>
              <DoItListButton onPress={() => navigation.navigate('DoItListDetail', {id: card.id})}>
                <DoItListCard>
                  {card.dealImages.length > 0 ? (
                    <DoItListImage source={card.dealImages[0]} />
                  ) : (
                    <View
                      style={css`
                        width: 100px;
                        height: 110px;
                        margin-right: 15px;
                        border-radius: 15px;
                        background-color: lightgray;
                      `}></View>
                  )}
                  <TextComponent>
                    <ReportButton onPress={() => setReportModalVisible(true)}>
                      <Feather
                        name="more-vertical"
                        size={25}
                        style={css`
                          position: absolute;
                          top: 7px;
                          left: 230px;
                        `}></Feather>
                    </ReportButton>
                    <View
                      style={css`
                        flex: 1;
                        margin-top: 10px;
                      `}>
                      <TextTitle numberOfLines={1}>{card.title}</TextTitle>

                      <TextApart>303동 / {calculateTimeAgo(card.createdAt)}</TextApart>
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
                          ? `${card.cash}원`
                          : card.rewardType === 'ITEM'
                          ? card.item
                          : 'Unknown Reward Type'}
                      </TextPrice>
                    </View>
                  </TextComponent>
                </DoItListCard>
              </DoItListButton>
              <DistinctLine></DistinctLine>
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
