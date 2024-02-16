// import 내용
import React, {useState, useEffect, useRef} from 'react';
import styled, {css} from '@emotion/native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import theme from '@/Theme';
import moment from 'moment';
import 'moment/locale/ko';
import {GlobalButton, GlobalContainer, GlobalComponent} from '@/GlobalStyles';
import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  Modal,
  Button,
  Text,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {GlobalText} from '@/GlobalStyles';
import SvgIcon from '@components/SvgIcon';
import axiosAuth from '@/axios/axiosAuth';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {userDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';

const TotalDeleteContainer = styled(GlobalComponent)`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 10px;
  width: 96%;
  height: 40px;
`;

const TotalDelete = styled(GlobalButton)`
  align-items: center;
  justify-content: center;
  background-color: #dcdcdc;
  width: 120px;
  height: 40px;
`;

const TotalRead = styled(GlobalButton)`
  align-items: center;
  justify-content: center;
  background-color: ${theme.color.primary};
  width: 120px;
  height: 40px;
  margin-left: 20px;
`;

const TotalDeleteText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.white};
  font-weight: 900;
`;

const NoticeCard = styled(GlobalContainer)`
  width: 90%;
  height: initial;
  margin-left: 20px;
  margin-top: 10px;
`;

const CardButton = styled(GlobalButton)`
  background-color: white;
  padding-right: 5px;
  padding-left: 5px;
`;

const CardHeader = styled(GlobalContainer)`
  height: initial;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const CardTitle = styled(GlobalText)`
  font-size: 18px;
  color: ${theme.color.black};
  font-weight: 900;
`;

const CardContentComponent = styled(GlobalContainer)`
  height: initial;
  flex-direction: column;
  align-items: flex-start;
`;

const CardContent = styled(GlobalText)`
  flex-direction: row;
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: 900;
  padding-bottom: 10px;
  justify-content: center;
  align-items: center;
  background-color: pink;
`;

const XImage = styled.Image`
  width: 15px;
  height: 15px;
  resize-mode: contain;
  margin-right: 5px;
  margin-top: 5px;
`;

const DistinctLineGray = styled.View`
  width: 100%;
  border: 1px solid #b2b2b2;
  background-color: #b2b2b2;
  margin-bottom: 5px;
`;

const DistinctLineGreen = styled.View`
  width: 100%;
  border: 1px solid #00d282;
  background-color: #00d282;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ModalBackground = styled(GlobalContainer)`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.7);
  justify-content: center;
  align-items: center;
  height: initial;
`;

const ModalComponent = styled(GlobalContainer)`
  width: 80%;
  height: initial;
  border: 2px solid #00d282;
  border-radius: 15px;
  background-color: white;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 10px 10px 10px;
`;

const ModalSubComponent = styled(GlobalContainer)`
  background-color: white;
  padding: 10px 2px 10px 2px;
  height: initial;
`;

const SelectButton = styled(GlobalButton)`
  background-color: ${theme.color.primary};
  width: 45%;
  padding: 10px;
`;

const ButtonText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.white};
  font-weight: bold;
`;

const ModalText = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: bold;
  margin-bottom: 15px;
`;

// 알림
const InfoComponent = styled(GlobalContainer)`
  flex-direction: row;
  align-items: flex-end;
  width: 90%;
  height: initial;
`;

const TextCategory = styled(GlobalText)`
  font-size: 18px;
  color: ${props => props.theme.color.black};
  padding: 10px 0px 0px 0px;
`;

const NoticeTime = styled(GlobalText)`
  font-size: ${theme.fontSize.small};
  color: #727272;
  font-weight: 900;
  margin-bottom: 15px;
  padding: 1px;
`;

const xImage: ImageSourcePropType = require('icons/x.png');

type Notice = {
  deal: object;
  id: number;
  isRead: boolean;
  title: string;
  message: string;
  dealType: string;
  notificationType: string;
};

type AnimatedNotice = {
  notice: Notice;
  position: Animated.ValueXY;
};

type NoticeId = {
  id: number;
};

// type AnimatedNotice = {
//   notice: Notice;
//   position: Animated.ValueXY;
// };

interface Props {
  noticeCount: number;
  setNoticeCount: (notice: number) => void;
}

const categoryToDealType = (category: string) => {
  switch (category) {
    case 'PET':
      return '반려동물 산책';
    case 'SHOP':
      return '장보기';
    case 'RECYCLE':
      return '분리수거';
    case 'ETC':
      return '기타';
    default:
      return '';
  }
};

const NoticeTab = (props: Props) => {
  const userData = useRecoilValue(userDataState);
  const navigation = useNavigation();
  const notificationTime = new Date();
  const [animatedNotices, setAnimatedNotices] = useState<AnimatedNotice[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [readNoticeId, setReadNoticeId] = useState(null);
  // console.log('1111', notices)
  const categoryToDealType = (category: string) => {
    switch (category) {
      case 'PET':
        return '반려동물 산책';
      case 'SHOP':
        return '장보기';
      case 'RECYCLE':
        return '분리수거';
      case 'ETC':
        return '기타';
      default:
        return '';
    }
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

  // Animated.ValueXY는 x와 y 값을 모두 가진 애니메이션 값입니다.
  const position = useRef(new Animated.ValueXY()).current;

  // 알림 읽음 상태 업데이트
  useEffect(() => {
    if (readNoticeId !== null) {
      axiosAuth
        .put(`/notification/${readNoticeId}`)
        .then(resp => {
          setAnimatedNotices(
            animatedNotices.map(aNotice =>
              aNotice.notice.id === readNoticeId ? {...aNotice, notice: {...aNotice.notice, isRead: true}} : aNotice
            )
          );
          const unreadNoticesCount = animatedNotices.filter(aNotice => !aNotice.notice.isRead).length;
          props.setNoticeCount(unreadNoticesCount);
        })
        .catch(error => {
          console.error('알림 읽음 중 오류 발생:', error);
        });
    }
  }, [readNoticeId]);

  const readAllNotices = () => {
    axiosAuth
      .put(`/notification`)
      .then(resp => {
        setAnimatedNotices(animatedNotices.map(aNotice => ({...aNotice, notice: {...aNotice.notice, isRead: true}})));
        props.setNoticeCount(0);
      })
      .catch(error => {
        console.error('전체 알림 읽음 중 오류 발생:', error);
      });
  };

  const deleteAllNotices = () => {
    axiosAuth
      .delete(`/notification`)
      .then(() => {
        console.log('전체 삭제 성공');
        setAnimatedNotices([]);
        setModalVisible(false);
      })
      .catch(error => {
        console.error('전체 알림 삭제 중 오류 발생:', error);
      });
  };

  const deleteNotice = (id: NoticeId) => {
    const targetIndex = animatedNotices.findIndex(aNotice => aNotice.notice.id === id);

    if (targetIndex !== -1) {
      Animated.timing(animatedNotices[targetIndex].position, {
        toValue: {x: 1000, y: 0},
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        axiosAuth
          .delete(`/notification/${id}`)
          .then(() => {
            axiosAuth
              .get(`/notification`)
              .then(resp => {
                const newAnimatedNotices = resp.data.map(notice => ({
                  notice,
                  position: new Animated.ValueXY(),
                }));
                setAnimatedNotices(newAnimatedNotices);
              })
              .catch(error => {
                console.error('데이터를 가져오는 중 오류 발생:', error);
              });
          })
          .catch(error => {
            console.error('알림 삭제 중 오류 발생:', error);
          });
      });
    }
  };

  useEffect(() => {
    // console.log('알림 데이터가 업데이트되었습니다:', notices);
  }, [animatedNotices]);

  useEffect(() => {
    axiosAuth
      .get(`/notification`)
      .then(resp => {
        const newAnimatedNotices = resp.data.map(notice => ({
          notice,
          position: new Animated.ValueXY(),
        }));
        console.log(resp.data[5]);
        console.log(resp.data[5].deal.id);
        setAnimatedNotices(newAnimatedNotices);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      });
  }, []);

  return (
    <GlobalContainer>
      <TotalDeleteContainer>
        <TotalRead onPress={readAllNotices}>
          <TotalDeleteText>알림 전체읽기</TotalDeleteText>
        </TotalRead>
        <TotalDelete onPress={() => setModalVisible(true)}>
          <TotalDeleteText>알림 전체삭제</TotalDeleteText>
        </TotalDelete>
      </TotalDeleteContainer>
      <DistinctLineGreen></DistinctLineGreen>
      {animatedNotices.length > 0 &&
        animatedNotices.map(({notice, position}) => (
          <Animated.View style={position.getLayout()}>
            <NoticeCard key={notice.id}>
              {!notice.isRead && (
                <Entypo
                  name="dot-single"
                  size={40}
                  color={'red'}
                  style={css`
                    position: absolute;
                    bottom: 130px;
                    right: 355px;
                  `}
                />
              )}
              <CardButton
                onPress={() => {
                  setReadNoticeId(notice.id);
                }}>
                <CardHeader>
                  <View
                    style={css`
                      flex-direction: row;
                      align-items: center;
                    `}>
                    <CardTitle>{notice.title} </CardTitle>
                    <MaterialCommunityIcons name="bell-ring-outline" size={25}></MaterialCommunityIcons>
                  </View>
                  <TouchableOpacity onPress={() => deleteNotice(notice.id)}>
                    <XImage source={xImage}></XImage>
                  </TouchableOpacity>
                </CardHeader>

                <CardContentComponent>
                  {notice && notice.deal && notice.notificationType === 'CHAT' && (
                    <CardContent>
                      {notice.deal.dong}의 {notice.nickname}님과 채팅이 시작되었습니다.
                    </CardContent>
                  )}

                  {notice && notice.deal && notice.notificationType === 'CHAT' && (
                    <CardContent>
                      {notice.dong.name}의 {notice.nickname}님과 채팅이 시작되었습니다.
                    </CardContent>
                  )}
                  {/* 해줘요잉 추천 */}
                  {notice && notice.deal && notice.notificationType === 'DEAL_NEW' && (
                    <TouchableOpacity onPress={() => navigation.navigate('DoItListDetail', {id: notice.deal.id})}>
                      {notice.deal.dealType === 'PET' && (
                        <InfoComponent>
                          <TextCategory>
                            {userData.dongName === notice.dong.name ? '내 아파트에서' : `${notice.dong.name}동에서`}{' '}
                          </TextCategory>
                          <SvgIcon name="puppy" size={37} />
                          <TextCategory
                            style={css`
                              font-weight: 900;
                              padding-bottom: 3px;
                            `}>
                            '반려동물 산책'{' '}
                          </TextCategory>
                          <TextCategory>요청이 있어요.</TextCategory>
                        </InfoComponent>
                      )}
                      {notice && notice.deal && notice.notificationType === 'RECYCLE' && (
                        <InfoComponent>
                          <TextCategory>
                            {userData.dongName === notice.dong.name ? '내 아파트에서' : `${notice.dong.name}동에서`}{' '}
                          </TextCategory>
                          <SvgIcon name="bags" size={37} />
                          <TextCategory
                            style={css`
                              font-weight: 900;
                              padding-bottom: 3px;
                            `}>
                            '분리수거'{' '}
                          </TextCategory>
                          <TextCategory>요청이 있어요.</TextCategory>
                        </InfoComponent>
                      )}
                      {notice.deal.dealType === 'SHOP' && (
                        <InfoComponent>
                          <TextCategory>
                            {userData.dongName === notice.dong.name ? '내 아파트에서' : `${notice.dong.name}동에서`}{' '}
                          </TextCategory>
                          <SvgIcon name="shopping" size={37} />
                          <TextCategory
                            style={css`
                              font-weight: 900;
                              padding-bottom: 3px;
                            `}>
                            '심부름'{' '}
                          </TextCategory>
                          <TextCategory>요청이 있어요.</TextCategory>
                        </InfoComponent>
                      )}
                      {notice.deal.dealType === 'ETC' && (
                        <InfoComponent>
                          <TextCategory>
                            {userData.dongName === notice.dong.name ? '내 아파트에서' : `${notice.dong.name}동에서`}{' '}
                          </TextCategory>
                          <SvgIcon name="building" size={37} />
                          <TextCategory
                            style={css`
                              font-weight: 900;
                              padding-bottom: 3px;
                            `}>
                            '기타'{' '}
                          </TextCategory>
                          <TextCategory>요청이 있어요.</TextCategory>
                        </InfoComponent>
                      )}
                    </TouchableOpacity>
                  )}

                  {/* 해줘요잉 수락 */}
                  {notice && notice.deal && notice.notificationType === 'DEAL_ACCEPT' && (
                    <View>
                      <TextCategory
                        style={css`
                          font-size: 16px;
                          width: 100%;
                        `}>
                        {notice.message}
                      </TextCategory>
                      <TouchableOpacity
                        onPress={() => {
                          setReadNoticeId(notice.id);
                          navigation.navigate('DoItListDetail', {id: notice.deal.id});
                        }}>
                        <InfoComponent>
                          <TextCategory
                            style={css`
                              font-size: 16px;
                              font-weight: 900;
                              text-decoration: underline;
                            `}>
                            제목 : {notice.deal.title}
                          </TextCategory>
                          <TextCategory
                            style={css`
                              font-size: 16px;
                              font-weight: 900;
                              text-decoration: underline;
                              color: gray;
                              margin-left: 5px;
                            `}>
                            바로가기
                          </TextCategory>
                        </InfoComponent>
                      </TouchableOpacity>
                    </View>
                  )}
                  {/* 해줘요잉 수락 취소 */}
                  {notice && notice.deal && notice.notificationType === 'DEAL_CANCEL' && (
                    <View>
                      <TextCategory
                        style={css`
                          font-size: 16px;
                        `}>
                        {notice.message}
                      </TextCategory>
                      <TextCategory
                        style={css`
                          font-weight: 900;
                          font-size: 16px;
                          text-decoration: underline;
                        `}>
                        제목 : {notice.deal.title}
                      </TextCategory>
                    </View>
                  )}
                </CardContentComponent>
                <InfoComponent
                  style={css`
                    justify-content: flex-end;
                  `}>
                  <NoticeTime
                    style={css`
                      margin-top: 10px;
                    `}>
                    {calculateTimeAgo(notice.deal.createdAt)}
                  </NoticeTime>
                </InfoComponent>

                <DistinctLineGray></DistinctLineGray>
              </CardButton>
            </NoticeCard>
          </Animated.View>
        ))}
      <>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          style={{zIndex: 1}}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <ModalBackground style={{zIndex: 1}}>
              <ModalComponent>
                <ModalText>알림을 '전체삭제'하시겠습니까?</ModalText>
                <ModalSubComponent>
                  <View
                    style={css`
                      flex-direction: row;
                      margin-top: 10px;
                      justify-content: space-between;
                    `}>
                    <SelectButton onPress={deleteAllNotices}>
                      <ButtonText>확인</ButtonText>
                    </SelectButton>
                    <SelectButton onPress={() => setModalVisible(false)}>
                      <ButtonText>취소</ButtonText>
                    </SelectButton>
                  </View>
                </ModalSubComponent>
              </ModalComponent>
            </ModalBackground>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    </GlobalContainer>
  );
};

export default NoticeTab;
