// import 내용
import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { xdeleteIcon } from '~/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TouchableOpacity,
  Modal,
  View,
  Text,
  Switch,
  Button,
} from 'react-native';
import { GlobalText, GlobalContainer, GlobalButton } from '@/GlobalStyles';

const SettingsComponent = styled(GlobalContainer)`
  justify-content: initial;
  align-items: initial;
  margin-left: 30px;
  margin-right: 30px;
`;

const SettingsTitle = styled(GlobalText)`
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.black};
  font-weight: bold;
  margin-bottom: 15px;
`;

const KeywordInput = styled.TextInput`
  border: 1px solid #00D282;
  border-radius: 15px;
  padding: 10px;
  margin-bottom: 10px;
`;

const KeywordButton = styled(GlobalButton)`
  position: absolute;
  right: 15px;
  top: 50px;
  background-color: white;
  color: ${props => props.theme.color.primary};
  margin-left: 10px;
`;

const KeywordButtonText = styled(GlobalText)`
  color: ${props => props.theme.color.primary};
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
  font-size: ${props => props.theme.fontSize.medium};
  color: ${props => props.theme.color.primary};
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
   
  const placeholderText = '알림 받을 키워드를 입력해주세요';
  const [inputKeyword, setInputKeyword] = useState(placeholderText);
  const [keywords, setKeywords] = useState<string[]>([]);

  // 사용자가 키워드 입력란에 입력하는 글자
  const handleKeywordChange = (text: string) => {
    setInputKeyword(text || placeholderText);
  };
  
  // 사용자가 '등록' 버튼을 누르면 입력한 키워드를 키워드 목록에 추가하고, 입력란을 초기화
  const handleKeywordSubmit = () => {
    if (inputKeyword && inputKeyword !== placeholderText) {
      setKeywords([...keywords, inputKeyword]);
      setInputKeyword(placeholderText);
    }
  };
  
  // 사용자가 키워드 입력란을 누르면, 초기 안내 메시지를 지움
  const handleInputFocus = () => {
    if (inputKeyword === placeholderText) {
      setInputKeyword('');
    }
  };
  
  const [modalVisible, setModalVisible] = useState(false);
  const [keywordToDelete, setKeywordToDelete] = useState('')
  const [doNotShowAgain, setDoNotShowAgain] = useState(false);

  const handleDoNotShowAgainChange = (newValue: boolean) => {
    setDoNotShowAgain(newValue);
  };

  const handleKeywordDelete = (keywordToDelete: string) => {
    setKeywordToDelete(keywordToDelete);
    setModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToDelete));
    setModalVisible(false);
  };

  

  return (
    <SettingsComponent>
      <SettingsTitle> 거래 키워드 </SettingsTitle>
      <KeywordInput
        value={inputKeyword === placeholderText ? '' : inputKeyword}
        onChangeText={handleKeywordChange}
        onFocus={handleInputFocus}
        placeholder={placeholderText}
        placeholderTextColor={'#B2B2B2'}
      />
      <KeywordButton onPress={handleKeywordSubmit}>
        <KeywordButtonText>등록</KeywordButtonText>
      </KeywordButton>
      <KeywordContainer>
        {keywords.map((keyword, index) => (
          <KeywordsubContainer key={keyword}>
            <KeywordList key={index}>{keyword}</KeywordList>
            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }} onPress={() => handleKeywordDelete(keyword)}>
              <KeywordDelete source={xdeleteIcon}/>
            </TouchableOpacity>   
          </KeywordsubContainer>
        ))}
      </KeywordContainer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View>
          <Text>정말로 삭제하시겠습니까?</Text>
          <Switch
            onValueChange={handleDoNotShowAgainChange}
            value={doNotShowAgain}
          />
          <Text>다시 보지 않기</Text>
          <Button
            onPress={handleDeleteConfirm}
            title="삭제"
          />
          <Button
            onPress={() => setModalVisible(false)}
            title="취소"
          />
        </View>
      </Modal>
    </SettingsComponent>
  );
};

export default NoticeSettingsKeyword;