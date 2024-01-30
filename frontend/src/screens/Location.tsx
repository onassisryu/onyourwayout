import React from 'react';
import {Button, Text} from 'react-native';
import {WebView} from 'react-native-webview';
import {Dimensions} from 'react-native';
import styled, {css} from '@emotion/native';

const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
};
const SafeContainer = styled.SafeAreaView`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: pink;
  height: ${dimensions.fullHeight}px;
  justify-content: center;
`;

const Map = styled(WebView)`
  flex: 1;
  /* width: ${dimensions.fullWidth};
  height: ${dimensions.fullHeight}; */
  width: 100px;
  height: 50px;
`;

const Location = () => {
  return (
    <SafeContainer>
      <Text
        style={css`
          background-color: red;
          width: 100%;
        `}>
        sf
      </Text>
      <Map originWhitelist={['*']} source={{uri: 'https://www.google.com/'}} />
    </SafeContainer>
  );
};

export default Location;
