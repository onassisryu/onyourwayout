// import 내용
import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { NavigationProp } from '@react-navigation/native';
import { xdeleteIcon } from '~/icons';
import theme from '@/Theme';

import {
  View,
  TouchableOpacity,
  ImageSourcePropType,
  Switch,
  TextInput
} from 'react-native';
import { GlobalText, GlobalContainer, GlobalButton } from '@/GlobalStyles';

const SettingsComponent = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  margin-left: 30px;
  margin-right: 30px;

`;

const SettingsTitle = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.black};
  font-weight: bold;
  margin-bottom: 15px;
`;

const KeywordInput = styled.TextInput`
  border: 1px solid #00D282;
  border-radius: 15px;
  padding: 10px;
  color: ${theme.color.gray};
  margin-bottom: 10px;
  color: ${theme.color.black}
`;

const KeywordButton = styled(GlobalButton)`
  position: absolute;
  right: 10px;
  top: 40px;
  background-color: white;
  color: ${theme.color.primary};
  margin-left: 10px;
`;

const KeywordButtonText = styled(GlobalText)`
  color: ${theme.color.primary};
  font-weight: bold;
`;

const KeywordContainer = styled(GlobalContainer)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;

`;

const KeywordsubContainer = styled(GlobalContainer)`
  max-width: 500px;
  max-height: 300px;
  flex-direction: row;
  border-radius: 10px;
  background-color: #E6FBF4;
  margin: 5px;
`;

const KeywordList = styled(GlobalText)`
  font-size: ${theme.fontSize.medium};
  color: ${theme.color.primary};
  font-weight: 900;
  padding: 10px;
`;

const KeywordDelete = styled.Image`
  width: 12px;
  height: 12px;
  resize-mode: contain;
  margin-right: 5px;
`;

const NoticeSettingsKeyword = () => {
   
  const [inputKeyword, setInputKeyword] = useState('알림 받을 키워드를 입력해주세요');
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleKeywordChange = (text: string) => {
    if (text === '') {
      setInputKeyword('알림 받을 키워드를 입력해주세요');
    } else {
      setInputKeyword(text);
    }
  };

  const handleKeywordSubmit = () => {
    if (inputKeyword && inputKeyword !== '알림 받을 키워드를 입력해주세요') {
      setKeywords([...keywords, inputKeyword]);
    }
    setInputKeyword('알림 받을 키워드를 입력해주세요');
  };


  const handleInputFocus = () => {
    if (inputKeyword === '알림 받을 키워드를 입력해주세요') {
      setInputKeyword('');
    }
  };

  const handleKeywordDelete = (keywordToDelete: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
  };

  return (
    <SettingsComponent>
      <SettingsTitle> 거래 키워드 </SettingsTitle>
      
        <KeywordInput
          value={inputKeyword === '알림 받을 키워드를 입력해주세요' ? '' : inputKeyword}
          onChangeText={handleKeywordChange}
          onFocus={handleInputFocus}
          placeholder='알림 받을 키워드를 입력해주세요'
          placeholderTextColor={theme.color.gray}
        />
        <KeywordButton onPress={handleKeywordSubmit}>
          <KeywordButtonText>등록</KeywordButtonText>
        </KeywordButton>

        
            <KeywordContainer>
              {keywords.map((keyword, index) => (
              <KeywordsubContainer>
                <KeywordList>{keyword}</KeywordList>
                <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeywordDelete(keyword)}>
                  <KeywordDelete source={xdeleteIcon}/>
                </TouchableOpacity>   
              </KeywordsubContainer>
            ))}
            </KeywordContainer>

    </SettingsComponent>
  );
};

export default NoticeSettingsKeyword;