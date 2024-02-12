import {AppRegistry} from 'react-native';
import {RecoilRoot} from 'recoil'; // RecoilRoot import 추가
import App from './App';
import {name as appName} from './app.json';
import React from 'react';
import * as encoding from 'text-encoding';
const RootComponent = () => (
  <RecoilRoot>
    <App />
  </RecoilRoot>
);

AppRegistry.registerComponent(appName, () => RootComponent);
