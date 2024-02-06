import React, {useState} from 'react';
import { ImageSourcePropType, StatusBar, View, Text } from 'react-native';
import styled from '@emotion/native';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { css } from '@emotion/react';
import { GlobalContainer, GlobalButton, GlobalText} from '@/GlobalStyles';
import Header from '@components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-vector-icons/Feather';
import SvgIcon from '@/components/SvgIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Container = styled(GlobalContainer)`
  justify-content: center;
  align-items: flex-start;
  height: initial
`;

const HeaderContainer = styled(Header)`
  justify-content: space-between;
  align-items: flex-start;
  height: 480px;
`;

const GoBackButton = styled(GlobalButton)`
  position: absolute;
  top: 10px;
  left: 10px;
  margin: 30px 0px 30px 0px;
  background-color: transparent;
`;

const ShareButton = styled(GlobalButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  margin: 30px 0px 30px 0px;
  background-color: transparent;
`;

const DoItListImage = styled.ImageBackground`
  position: absolute;
  width: 410px;
  height: 480px;
  resize-mode: contain;

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
  width: 90%;
  margin-left: 20px;
  margin-right: 20px;
  border: 1px solid #B2B2B2;
`;

const ContentComponent = styled(GlobalContainer)`
  height: initial;
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
  align-items: flex-end;
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
  margin-left: 200px;
`;

const TextReport = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.short};
  color:  ${props => props.theme.color.gray};
  padding: 0px 0px 5px 20px;
  text-decoration-line: underline;
`;



const ButtonComponent = styled(GlobalContainer)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 40px 20px 40px 20px;
  height: 150px;
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
  border-right-width: 2px;
  border-right-color: white;
`;

const AgreeButton = styled(GlobalButton)`
  flex-direction: row;

  width: 150px;
  height: 60px;
  background-color: ${props => props.theme.color.primary};
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
`;

const ChatButton = styled(GlobalButton)`
  flex-direction: row;
  border: white;
  width: 150px;
  height: 60px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  background-color: ${props => props.theme.color.primary};
  border-right
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
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content"/>
      <HeaderContainer>
        <DoItListImage source={card.image}/>
        <GoBackButton onPress={() => navigation.goBack()}>
          <Ant name="arrowleft" size={35} color="white" />
        </GoBackButton>
        <ShareButton>
          <Share name="share" size={35} color="white"/>
        </ShareButton>
      </HeaderContainer>

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
        <TextCategory>{card.category}</TextCategory>
        <TextContent>{card.content}</TextContent>
        <InfoComponent>
          <TextInfo>찜 1 / 조회 208</TextInfo>
          <TextPrice>{card.price}</TextPrice>
        </InfoComponent>
        <TextReport>게시글 신고하기</TextReport>
      </ContentComponent>

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
