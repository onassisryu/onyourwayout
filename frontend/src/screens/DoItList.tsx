import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Button,
  Animated,
  View,
  Text,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import styled, {css} from '@emotion/native';
import Feather from 'react-native-vector-icons/Feather';
import DoItListHeader from '@components/DoItListpage/DoItListHeader';
import DoItListCategory from '@components/DoItListpage/DoItListCategory';
import ApartSelectionModal from '@components/DoItListpage/ApartSelectionModal';
import ReportModal from '@components/DoItListpage/ReportModal';
import {GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';
import SvgIcon from '@components/SvgIcon';
import {useFocusEffect} from '@react-navigation/native';
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
  width: 130px;
  height: 100%;
  border-radius: 10px;
  resize-mode: cover;
`;

const CardTextContainer = styled(GlobalContainer)`
  position: relative;
  flex: 1;
  width: 100%;
  margin-left: 10px;
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
  background-color: yellow;
  justify-content: center;
  align-items: center;
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

  const categoryToDealType = (category: string) => {
    switch (category) {
      case '반려동물 산책':
        return 'PET';
      case '장보기':
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

  const [selectedCard, setSelectedCard] = useState({});

  // 검색어를 기반으로 카드를 필터링하는 함수

  const [openSearch, setOpenSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [searchResults, setSearchResults] = useState<DoListCard[]>(cardListData);

  const filterAndUpdateResults = React.useCallback(() => {
    let results = cardListData; // 먼저 카테고리 필터링이 적용될 것입니다.
    // 카테고리 필터링
    if (selectedTypeCategory) {
      results = results.filter(card => card.dealType === categoryToDealType(selectedTypeCategory));
    }
    // 아파트 필터링
    if (selectedApart) {
      results = results.filter(card => card.requestInfo.dongName === selectedApart);
    }
    // 검색어가 있는 경우에만 검색 필터링을 적용합니다.
    if (searchTerm !== '') {
      results = results.filter(
        card =>
          card.title.includes(searchTerm) ||
          card.content.includes(searchTerm) ||
          card.cash.toString().includes(searchTerm)
      );
    }
    // 필터링된 결과를 searchResults로 세팅합니다.
    setSearchResults(results);
  }, [selectedTypeCategory, selectedApart, searchTerm, cardListData]);

  // 카테고리가 변경될 때마다 필터링을 다시 수행
  useEffect(() => {
    filterAndUpdateResults();
  }, [selectedTypeCategory, selectedApart, cardListData, searchTerm]);

  // useEffect 부분
  useFocusEffect(
    React.useCallback(() => {
      axiosAuth
        .get('deal/dong/list')
        .then(resp => {
          // 모든 카드 데이터를 저장
          setCardListData(resp.data);
          // 필터링된 결과를 저장
          filterAndUpdateResults();
        })
        .catch(error => {
          console.error('데이터를 가져오는 중 오류 발생:', error);
        });
    }, [])
  );

  //----------
  const [scrollY, setScrollY] = useState<number>(0); // 스크롤 위치 상태 변수
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 변수
  const [isUpdating, setIsUpdating] = useState<boolean>(false); // 업데이트 상태 변수

  const fetchNewData = (): Promise<void> => {
    setIsUpdating(true); // 데이터를 가져오기 시작하므로 로딩 상태를 true로 설정
    return axiosAuth
      .get<DoListCard[]>('deal/dong/list')
      .then(resp => {
        console.log('1111111111', resp);
        // 모든 카드 데이터를 추가
        setCardListData(prevData => [...prevData, ...resp.data]);
        // 필터링된 결과를 추가
        filterAndUpdateResults();

        console.log('카드리스트 api 호출 성공', resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      })
      .finally(() => {
        setIsUpdating(false); // 데이터를 모두 가져왔으므로 로딩 상태를 false로 설정
      });
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = (event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y); // 스크롤 위치 업데이트

    // 스크롤이 최상단에 도달했을 때 페이지 상태 업데이트
    if (event.nativeEvent.contentOffset.y <= 0 && !isUpdating) {
      // 로딩 중이 아닐 때만 데이터를 가져옴
      fetchNewData()
        .then(() => console.log('--새로운 데이터를 가져왔습니다.'))
        .catch(error => console.error(error));
    }
  };

  // useEffect 부분
  useFocusEffect(
    React.useCallback(() => {
      if (isLoading) {
        // 로딩 상태가 true일 때만 데이터를 가져옴
        axiosAuth
          .get('deal/dong/list')
          .then(resp => {
            setCardListData(resp.data);
            setSearchResults(resp.data);
            console.log('카드리스트 api 호출 성공', resp.data);
          })
          .catch(error => {
            console.error('데이터를 가져오는 중 오류 발생:', error);
          })
          .finally(() => {
            setIsLoading(false); // 데이터를 모두 가져왔으므로 로딩 상태를 false로 설정
          });
      }
    }, [isLoading]) // isLoading 상태가 변경될 때마다 이 훅이 실행됨
  );
  //한번렌더링하고 새로고침하면 다시랜더링 해야됨~

  return (
    <GlobalContainer>
      <DoItListHeader
        navigation={navigation}
        setOpenSearch={setOpenSearch}
        openSearch={openSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}></DoItListHeader>

      <DoItListCategory
        selectedApartCategory={selectedApartCategory}
        selectedTypeCategory={selectedTypeCategory}
        setSelectedApartCategory={setSelectedApartCategory}
        setSelectedTypeCategory={setSelectedTypeCategory}
        setApartModalVisible={setApartModalVisible}
        selectedApart={selectedApart}
        setSelectedApart={setSelectedApart}
      />
      {isUpdating ? (
        <View style={{alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#6CA5FA" />
          <Text>데이터 업데이트 중입니다.</Text>
        </View>
      ) : null}
      <ScrollView onScroll={handleScroll}>
        {isLoading ? (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={100} color="#00D282" />
            <Text>해줘요잉 로딩 중입니다.</Text>
          </View>
        ) : null}
        <DoItListCardComponent>
          {searchResults.map((card, index) => (
            <View key={index}>
              <DoItListButton onPress={() => navigation.navigate('DoItListDetail', {id: card.id})}>
                <DoItListCard>
                  {card.dealImages.length === 0 ? (
                    <CardImageContainer
                      style={{
                        backgroundColor:
                          card.dealType === 'PET'
                            ? '#FADE6C'
                            : card.dealType === 'SHOP'
                            ? '#6CA5FA'
                            : card.dealType === 'RECYCLE'
                            ? '#00D282'
                            : 'gray',
                      }}>
                      {card.dealType === 'PET' && <SvgIcon name="puppy" size={100} />}
                      {card.dealType === 'SHOP' && <SvgIcon name="shopping" size={90} />}
                      {card.dealType === 'RECYCLE' && <SvgIcon name="bags" size={100} />}
                      {card.dealType === 'ETC' && <SvgIcon name="building" size={100} />}
                    </CardImageContainer>
                  ) : (
                    <DoItListImage src={card.dealImages[0].imgUrl} />
                  )}

                  <CardTextContainer>
                    {userData.id === card.requestId ? (
                      <></>
                    ) : (
                      <ReportButton
                        onPress={() => {
                          setReportModalVisible(true);
                          setSelectedCard(card);
                        }}>
                        <Feather
                          name="more-vertical"
                          size={25}
                          style={css`
                            color: #c4c4c4;
                          `}></Feather>
                      </ReportButton>
                    )}

                    <View
                      style={css`
                        flex: 1;
                        margin-top: 10px;
                      `}>
                      <TextTitle numberOfLines={1}>{card.title}</TextTitle>

                      <TextApart>
                        {card.requestInfo.dongName}동 / {calculateTimeAgo(card.createdAt)}
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

      <ReportModal
        reportModalVisible={reportModalVisible}
        setReportModalVisible={setReportModalVisible}
        navigation={navigation}
        selectedCard={selectedCard}
      />
    </GlobalContainer>
  );
};

export default DoItList;
