import styled, {css} from '@emotion/native';
import {useTheme} from '@emotion/react';
import DefaultButton from '@/components/DefaultButton';
import {GlobalContainer, GlobalText, GlobalButton} from '@/GlobalStyles';
import React from 'react';
import { NavigationProp } from '@react-navigation/native';

import MainComponent from '@components/Mainpage/MainNotice';
import MainHeader from '@components/Mainpage/MainHeader';
import MainDoList from '@components/Mainpage/MainDoList';
import { ScrollView } from 'react-native'


// const StyledText = styled(GlobalText)`
//   font-size: 30px;
// `;
interface Props {
  navigation: NavigationProp<any>;
}

const Home = ({ navigation }: Props) => {
  const theme = useTheme();
  return (
    <GlobalContainer>
      {/* <StyledText
        style={css`
          background-color: ${theme.color.primary};
        `}>
        Home
      </StyledText>
      <GlobalButton>
        <GlobalText>go to the chat screen</GlobalText>
      </GlobalButton>
      <DefaultButton title="수락하기" color="primary" size="md" />
      <DefaultButton title="수락하기" color="primary" size="lg" /> */}
      <ScrollView style={{ width: '100%' }}>
        <MainHeader navigation={navigation} />
        <MainComponent /> 
        <MainDoList />
      </ScrollView>
    </GlobalContainer>
  );
};

export default Home;
