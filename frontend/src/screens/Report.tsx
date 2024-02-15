import React, {useState, useEffect} from 'react';
import {Button, ScrollView} from 'react-native';
import styled, {css} from '@emotion/native';
import Header from '@/components/Header';
import Ant from 'react-native-vector-icons/AntDesign';
import { GlobalButton, GlobalContainer, GlobalText } from '@/GlobalStyles';
import theme from '@/Theme';
import axiosAuth from '@/axios/axiosAuth';

const ReportTitle = styled(GlobalText)`
  font-weight: bold;
  font-size: ${props => props.theme.fontSize.subtitle};
  color: ${props => props.theme.color.black};
  padding-bottom: 5px;
`;

const SubComponent = styled(GlobalContainer)`
  height: initial;
  margin: 15px 20px 15px 20px;  
`;

const ReportArticleTitle = styled(GlobalContainer)`
  height: initial;
  background-color: white;
  cursor: pointer;
  justify-content:  initial;
  align-items:  initial;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
`;

const ArticleTitle = styled(GlobalText)`
  font-weight: bold;
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  padding-bottom: 5px;
`;

const ReportArticleContent = styled(GlobalButton)`
  height: initial;
  background-color: white;
  cursor: pointer;
  justify-content:  initial;
  align-items:  initial;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  margin-top: 5px;
`;

const ArticleContent = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  padding-bottom: 5px;
`;

const StyledInputTitle = styled(GlobalText)`
  font-size: 18px;
  font-weight: 900;
  color: ${props => props.theme.color.black};
  margin-left: 20px;
  margin-bottom: 12px;
`;

const StyledInput = styled.TextInput`
  width: 90%;
  font-size: 18px;
  color: ${props => props.theme.color.primary};
  background-color: white;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.color.primary};
  color: ${props => props.theme.color.black};
  margin-left: 20px;
  margin-right: 20px;
`;

const StyledInputContainer = styled.View`


`;

const ButtonContainer = styled(GlobalContainer)`
  height: initial;
  margin: 15px 20px 15px 20px;  
  width: 90%;
  height: 30%;
  align-items: flex-end;
`;

const AddButton = styled(GlobalButton)`
  font-family: ${props => props.theme.font.primary};
  font-size: ${props => props.theme.fontSize.medium};
  cursor: pointer;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  color: ${props => props.theme.color.white};
  background-color: ${props => props.theme.color.primary};

`;

const ButtonText = styled(GlobalText)`
  font-weight: bold;
  font-family: ${props => props.theme.font.primary};
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.white};
  margin: 10px;
`;

const DistinctLine = styled.View`
  width: 90%;
  margin-top: 15px;
  margin-bottom: 15px;
  border: 0.5px solid #b2b2b2;
`;

const Report = ({route, navigation}: any) => {
  
  const param = route.params.card
  console.log(param)

  const [reportContent, setReportContent] = useState('');
  const [reportType, setReportType] = useState('');

  const reportHandle = (type: string) => {
    switch (type) {
      case '광고/사기인 것 같아요.':
        return 'Spam';
      case '유해한 내용이에요.':
        return 'Harmful';
      case '법적 문제가 있을 것 같아요.':
        return 'LegalIssue';
      case '욕설, 비방, 혐오 표현을 해요.':
        return 'Violent';
      case '성적인 내용이에요.':
        return 'Sexual'
      default:
        return 'ETC';
    }
  };
  
  const submitReport = () => {
    axiosAuth.put(`deal/complain/${param.id}`, { 
      complainType: reportType,
      content: reportContent 
    })
      .then(response => {
        if (response.status === 200) {
          // 요청이 성공하면 실행할 코드
          console.log('신고 성공');
          navigation.goBack();
        } else {
          // 요청이 실패하면 실행할 코드
          console.log('신고 실패');
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    // reportType이 바뀔 때마다 이 부분이 실행됩니다.
    console.log(`reportType이 ${reportType}으로 변경되었습니다.`);
  }, [reportType, reportContent]); // 의존성 배열에 reportType을 추가합니다.

  return (
    <ScrollView style={css`
      background-color: white;
    `}>
      <Header style={css`
        justify-content: flex-start;

      `}>
      <Ant
        name="arrowleft"
        size={40}
        color="black"
        onPress={() => navigation.goBack()}
        />
        <ReportTitle>       신고하기</ReportTitle>
        <ReportTitle></ReportTitle>
      </Header>

      <SubComponent>
        <ReportArticleTitle>
          <ArticleTitle> '{param.requestInfo.nickname}'님의 '{param.title}' 게시글을 </ArticleTitle>
          <ArticleTitle> 신고하려는 이유를 선택해주세요. </ArticleTitle>
          <DistinctLine></DistinctLine>
        </ReportArticleTitle>
          <ReportArticleContent onPress={() => {
            setReportContent(prevContent => `${prevContent} 광고/사기인 것 같아요. `);
            setReportType(reportHandle('광고/사기인 것 같아요.'));
          }}>
            <ArticleContent> 광고/사기인 것 같아요. </ArticleContent>
          </ReportArticleContent>
          <DistinctLine></DistinctLine>
          <ReportArticleContent onPress={() => {
            setReportContent(prevContent => `${prevContent} 유해한 내용이에요. `);
            setReportType(reportHandle('유해한 내용이에요.'));
          }}>
            <ArticleContent> 유해한 내용이에요. </ArticleContent>
          </ReportArticleContent>
          <DistinctLine></DistinctLine>
          <ReportArticleContent onPress={() => {
            setReportContent(prevContent => `${prevContent} 법적 문제가 있을 것 같아요. `);
            setReportType(reportHandle('법적 문제가 있을 것 같아요.'));
          }}>
            <ArticleContent> 법적 문제가 있을 것 같아요. </ArticleContent>
          </ReportArticleContent>
          <DistinctLine></DistinctLine>
          <ReportArticleContent onPress={() => {
            setReportContent(prevContent => `${prevContent} 욕설, 비방, 혐오 표현을 해요. `);
            setReportType(reportHandle('욕설, 비방, 혐오 표현을 해요.'));
          }}>
            <ArticleContent> 욕설, 비방, 혐오 표현을 해요. </ArticleContent>
          </ReportArticleContent>
          <DistinctLine></DistinctLine>
          <ReportArticleContent onPress={() => {
            setReportContent(prevContent => `${prevContent} 성적인 내용이에요. `);
            setReportType(reportHandle('성적인 내용이에요.'));
          }}>
            <ArticleContent> 성적인 내용이에요. </ArticleContent>
          </ReportArticleContent>
          <DistinctLine></DistinctLine>
          <ReportArticleContent onPress={() => {
            setReportContent(prevContent => `${prevContent} 비매너 사용자에요. `);
            setReportType(reportHandle('비매너 사용자에요.'));
          }}>
            <ArticleContent> 비매너 사용자에요. </ArticleContent>
          </ReportArticleContent>
          <DistinctLine></DistinctLine>
      </SubComponent>

      <StyledInputTitle>신고 상세정보</StyledInputTitle>
        <StyledInputContainer>
          <StyledInput
            style={css`
              height: 100px;
            `}
            placeholder='신고할 내용을 자세하게 작성해주세요.'
            placeholderTextColor={theme.color.gray100}
            defaultValue={reportContent}
            onChangeText={setReportContent}
            multiline={true}
            numberOfLines={4}
          />
      </StyledInputContainer>
      <ButtonContainer>
        <AddButton onPress={submitReport}>
          <ButtonText>신고하기</ButtonText>
        </AddButton>
      </ButtonContainer>
      
    </ScrollView>
  );
};

export default Report;