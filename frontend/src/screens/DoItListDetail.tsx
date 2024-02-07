import React, {useState} from 'react';
import { ImageSourcePropType, StatusBar, View, Text, ScrollView } from 'react-native';
import styled from '@emotion/native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { css } from '@emotion/react';
import { GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-vector-icons/Feather';
import SvgIcon from '@/components/SvgIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Container = styled(GlobalContainer)`
  justify-content: center;
  align-items: flex-start;
  height: initial;
`;

const SubContainer = styled(GlobalContainer)`
  align-items: flex-start;
  height: initial;
`;

const HeaderContainer = styled(Header)`
  width: 100%;
  height: 0px;

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
  width: 410px;
  height: 450px;
  resize-mode: contain;

`;

const TotalComponent = styled(ScrollView)`
  height: 800px
  
`;

const SubHeader = styled(GlobalContainer)`
  flex-direction: row;
  align-items: center;
  padding: 0px 0px 0px 15px;
  height: 80px;
`

const ProfileComponent = styled(GlobalContainer)`
  height: initial;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  padding: 7px 5px 0px 0px;
`

const TextNickname = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  number-of-lines: 1
  font-weight: bold;
  padding-bottom: 1px;
`;

const TextApart = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color:  ${props => props.theme.color.gray};
  font-weight: bold;
  padding-bottom: 12px;
`;

const DistinctLine = styled.View`
  width: 370px;
  margin-left: 20px;
  margin-right: 20px;
  border: 1px solid #B2B2B2;
`;

const ContentComponent = styled(GlobalContainer)`
  flex-direction: column;
  align-items: flex-start;
`;

const TextTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  padding: 30px 0px 0px 20px;
  font-weight: bold;

`;

const TextCategory = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.small};
  color:  ${props => props.theme.color.gray};
  padding: 10px 0px 0px 20px;
`;

const TextContent = styled(GlobalText)`
  width: 390px;
  line-height: 24px;
  font-size: ${props => props.theme.fontSize.medium};
  color:  ${props => props.theme.color.black};
  padding: 25px 0px 0px 20px;
`;

const InfoComponent = styled(GlobalContainer)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 390px;
  height: initial;
`;

const TextInfo = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color:  ${props => props.theme.color.gray};
  padding: 25px 0px 5px 20px;
`;

const TextPrice = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.subtitle};
  color:  ${props => props.theme.color.black};
  font-weight: bold;

`;

const TextReport = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color:  ${props => props.theme.color.gray};
  padding: 0px 0px 5px 20px;
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
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
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
  background-color: ${props => props.theme.color.primary};
`;

const ButtonText = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.white};
  font-weight: bold;
  margin-bottom: 4px;
`;


interface DoListCard {
  id: number;
  category: string;
  image: ImageSourcePropType;
  title: string;
  apart: string;
  uptime: string;
  nickname: string;
  content: string;
  price: string;
  remaintime: string;
};

type RootStackParamList = {
  DoItListDetail: { card: DoListCard };
  // 여기서 DoListCard는 카드의 타입입니다.
  // 다른 라우트 이름들도 이곳에 추가해야 합니다.
};

type DoItListDetailRouteProp = RouteProp<RootStackParamList, 'DoItListDetail'>;

interface Props {
  route: DoItListDetailRouteProp;
  navigation: NavigationProp<any>;
  // 필요하다면 다른 props들도 추가할 수 있습니다.
};

const DoItListDetail = ({ route, navigation }: Props) => {

  const { card } = route.params;

  const [name, setName] = useState('heart-o')

  const PushLike = () => {
    if (name == 'heart-o') {
      setName('heart');
    }
    else {
      setName('heart-o')
    }
  }

  return (
    <Container>
      
      <HeaderContainer style={{zIndex: 1}}>
        <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
        <GoBackButton onPress={() => navigation.goBack()}>
          <Ant name="arrowleft" size={35} color="black" />
        </GoBackButton>
        <ShareButton>
          <Share name="share" size={35} color="black"/>
        </ShareButton>
      </HeaderContainer>

      <TotalComponent>
        <View style={{zIndex: -99}}>
          <DoItListImage source={card.image} />
        </View>
        <SubContainer>
          
          <SubHeader>
            <SvgIcon name='profile' size={40}/>
            <ProfileComponent>
              <TextNickname> {card.nickname}</TextNickname>
              <TextApart> {card.apart} / {card.uptime} </TextApart>
            </ProfileComponent>
          </SubHeader>      
          <DistinctLine></DistinctLine>
          <ContentComponent>
            <TextTitle numberOfLines={1}>{card.title}</TextTitle>
            <InfoComponent>
              <TextCategory>{card.category}</TextCategory>
              <TextPrice>{card.price}</TextPrice>
            </InfoComponent> 
            <TextContent >{card.content}</TextContent>
            <TextInfo>찜 1 / 조회 208</TextInfo>
            <TextReport>게시글 신고하기</TextReport>
          </ContentComponent>
        </SubContainer>

      </TotalComponent>

        <ButtonComponent>
          <LikeButton onPress={PushLike}>
            <FontAwesome name={name} size={25} color='white'></FontAwesome>
          </LikeButton>
          <AgreeButton>
            <FontAwesome name='handshake-o' size={20} color='white'></FontAwesome>
            <ButtonText> 수락하기 </ButtonText>
          </AgreeButton>
          <ChatButton>
            <Ionicons name='chatbox-ellipses-outline' size={20} color='white'></Ionicons>
            <ButtonText> 채팅하기 </ButtonText>
          </ChatButton>
        </ButtonComponent>

    </Container>
  );
};

export default DoItListDetail;
