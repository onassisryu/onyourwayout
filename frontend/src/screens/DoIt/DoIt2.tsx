import React from 'react';
import {css} from '@emotion/native';
import {ScrollView} from 'react-native';
import {GlobalContainer, GlobalText} from '@/GlobalStyles';
import {NavigationProp} from '@react-navigation/native';
import DefaultButton from '@/components/DefaultButton';

interface Props {
  navigation: NavigationProp<any>;
}

const DoIt = ({navigation}: Props) => {
  return (
    <GlobalContainer>
      <ScrollView
        style={css`
          width: '100%';
        `}>
        <GlobalText>f</GlobalText>
        <DefaultButton onPress={() => navigation.navigate('홈')} color="primary" title="test" />
      </ScrollView>
    </GlobalContainer>
  );
};

export default DoIt;
