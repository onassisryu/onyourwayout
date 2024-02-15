import React, {useState, useEffect} from 'react';
import {ScrollView, View, Text, TouchableOpacity} from 'react-native';
import styled, {css} from '@emotion/native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import axiosAuth from '@/axios/axiosAuth';
import Header from '@/components/Header';
import GoBack from '@/components/Signup/GoBack';
import {useIsFocused} from '@react-navigation/native';

const TextComponent = styled(GlobalContainer)`
  width: 230px;
  height: initial;
  flex-direction: column;
  align-items: flex-start;
`;

const TextContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  padding: 5px 0px 5px 0px;
`;

// 카드 스타일 정의
const Card = styled.View`
  align-items: center;
  padding: 15px;
  border-radius: 15px;
  border: 1px solid #bbbbbb;
  height: 100px;
  flex-direction: row;
  margin-bottom: 10px;
`;

const PausedUserCard = ({deal, navigation}: {deal: any; navigation: any}) => {
  const complaint = deal.complaint;

  var color;
  var text_color;
  if (complaint >= 5) {
    color = 'red';
    text_color = 'white';
  } else if (complaint >= 3) {
    color = 'orange';
    text_color = 'white';
  } else if (complaint >= 1) {
    color = 'yellow';
    text_color = 'grey';
  }

  return (
    <TouchableOpacity onPress={() => navigation.navigate('AdminComplainDealDetail', {id: deal.id})}>
      <Card>
        <View
          style={css`
            width: 70%;
          `}>
          <TextComponent>
            <TextContent>{deal.requestInfo.apt.name + ' 아파트'}</TextContent>
            <TextContent>{'[' + deal.title + ']'}</TextContent>
          </TextComponent>
        </View>
        <View
          style={css`
            position: absolute;
            right: 20px;
            width: 50px;
            border-radius: 25px;
            height: 50px;
            justify-content: center;
            background-color: ${color};
          `}>
          <Text
            style={css`
              text-align: center;
              font-size: 20px;
              color: ${text_color};
            `}>
            {deal.complaint}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

// 정지된 사용자의 정보를 보여주는 페이지
const AdminComplainDeal = ({navigation}: any) => {
  const [responseData, setResponseData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    // 정지 사용자 데이터를 받아온다.
    axiosAuth
      .get('/admin/manages/deal')
      .then(resp => {
        setResponseData(resp.data);
      })
      .catch(error => {
        console.error('데이터를 가져오는 중 오류 발생: ', error);
      });
  }, [isFocused]);

  return (
    <GlobalContainer>
      <Header>
        <GoBack />
        <Text
          style={css`
            font-size: 27px;
            color: #000000;
            font-weight: bold;
          `}>
          신고 거래 조회
        </Text>
        <View style={{width: 40}} />
      </Header>
      <ScrollView
        overScrollMode="never"
        style={css`
          padding: 10px;
        `}>
        {responseData.map((deal, index) => (
          <PausedUserCard key={index} deal={deal} navigation={navigation} />
        ))}
      </ScrollView>
    </GlobalContainer>
  );
};

export default AdminComplainDeal;
