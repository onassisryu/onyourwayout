import axios from 'axios';
import React, {useState, useEffect} from 'react';
import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import {TouchableOpacity, Text, View, ImageSourcePropType, Animated} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';

// 배경
const NotificationBar = styled.View`
  background-color: #00d282;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 140px;
  align-items: center;
`;

const NotificationBottom = styled.View`
  background-color: #d9d9d9;
  padding-top: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 205px;
`;

const NotificationText = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.white};
  font-weight: bold;
  margin-left: 5px;
`;

// 탭 컨테이너 스타일 정의
const TabsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const Tab = styled.TouchableOpacity<{selected?: boolean}>`
  align-items: center;
  padding: 10px;
  margin-right: 10px;
  margin-left: 10px;
  ${props =>
    props.selected &&
    css`
      border-top-width: 2px;
      border-top-color: white;
    `}
`;

// 탭 텍스트의 스타일 정의
const TabText = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.white};
  font-weight: bold;
`;

// 카드 스타일 정의
const Card = styled.View`
  position: absolute;
  right: 35px;
  left: 35px;
  align-items: center;
  background-color: white;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid #bbbbbb;
`;

const AnimatedCard = Animated.createAnimatedComponent(Card);

const Card1 = styled(AnimatedCard)`
  top: 110px;
`;

const Card2 = styled(AnimatedCard)`
  top: 320px;
`;

const CardTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.primary};
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardComponent = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const CardText = styled.Text`
  color: #000000;
  width: 180px;
  font-size: 28px;
`;

const CardImage1 = styled.Image`
  width: 80px;
  height: 130px;
  resize-mode: contain;
`;

const CardImage2 = styled.Image`
  width: 120px;
  height: 90px;
  resize-mode: contain;
`;

const ContourLine = styled.View`
  position: relative;
  width: 100%;
  height: 1px;
  background-color: #c2c2c2;
`;

// 페이지 컴포넌트 정의
const Page1 = () => (
  <View>
    <Text>Page 1</Text>
  </View>
);

const Page2 = () => (
  <View>
    <Text>Page 2</Text>
  </View>
);

// 서브 컴포넌트
const MainComponent = ({navigation}: {navigation?: any}) => {
  const [recentNotification, setRecentNotification] = useState<string>('이것은 가장 최근의 알림입니다!');
  const [selectedTab, setSelectedTab] = useState<string>('나가요잉');

  const [fadeValue, setFadeValue] = useState(new Animated.Value(0));

  useEffect(() => {
    fadeValue.setValue(0);

    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [selectedTab]);

  // useEffect(() => {
  //   const fetchNotification = async () => {
  //     try {
  //       // 백엔드 API 호출하여 알림 내용 가져오는 코드
  //       const response = await axios.get('http://your-backend-api/notification');
  //       // response.data는 백엔드에서 보내주는 json 데이터를 의미합니다.
  //       // 이 부분은 백엔드 API의 응답 형식에 따라 달라질 수 있습니다.
  //       setRecentNotification(response.data.message);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchNotification();
  // }, []);

  return (
    <View>
      <NotificationBar>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Fontisto name="bell" size={22} color="white" />
          <NotificationText>{recentNotification}</NotificationText>
        </View>
        <TabsContainer>
          <Tab selected={selectedTab === '나가요잉'} onPress={() => setSelectedTab('나가요잉')}>
            <TabText>나가요잉</TabText>
          </Tab>
          <Tab selected={selectedTab === '해줘요잉'} onPress={() => setSelectedTab('해줘요잉')}>
            <TabText>해줘요잉</TabText>
          </Tab>
        </TabsContainer>
      </NotificationBar>
      <NotificationBottom></NotificationBottom>

      {selectedTab === '나가요잉' && (
        <>
          <Card1 style={{opacity: fadeValue}}>
            <TouchableOpacity onPress={() => navigation.navigate('Page2')}>
              <CardTitle>이가영님의 근처에는 어떤 이웃이 있을까요?</CardTitle>
              <CardComponent>
                <CardText>
                  {`이웃들의\n`}
                  <Text style={{fontWeight: 'bold'}}>심부름</Text>
                  {`을\n해볼까요? ➔`}
                </CardText>
                <CardImage1 source={require('images/trash2.png')} />
              </CardComponent>
            </TouchableOpacity>
          </Card1>

          <Card2 style={{opacity: fadeValue}}>
            <TouchableOpacity onPress={() => navigation.navigate('Page2')}>
              <CardComponent>
                <CardText>
                  <Text style={{fontWeight: 'bold'}}>쓰레기</Text>
                  {`\n버려볼까요? ➔`}
                </CardText>
                <CardImage2 source={require('images/trash.png')} />
              </CardComponent>
            </TouchableOpacity>
          </Card2>
        </>
      )}

      {selectedTab === '해줘요잉' && (
        <>
          <Card1 style={{opacity: fadeValue}}>
            <TouchableOpacity onPress={() => navigation.navigate('Page2')}>
              <CardTitle>이가영님의 근처에는 어떤 이웃이 있을까요?</CardTitle>
              <CardComponent>
                <CardText>
                  {`이웃들에게\n`}
                  <Text style={{fontWeight: 'bold'}}>심부름</Text>
                  {`을\n요청할까요? ➔`}
                </CardText>
                <CardImage1 source={require('images/trash2.png')} />
              </CardComponent>
            </TouchableOpacity>
          </Card1>

          <Card2 style={{opacity: fadeValue}}>
            <TouchableOpacity onPress={() => navigation.navigate('Page2')}>
              <CardComponent>
                <CardText>
                  <Text style={{fontWeight: 'bold'}}>쓰레기</Text>
                  {`\n버려주세요. ➔`}
                </CardText>
                <CardImage2 source={require('images/trash.png')} />
              </CardComponent>
            </TouchableOpacity>
          </Card2>
        </>
      )}
    </View>
  );
};

export default MainComponent;
