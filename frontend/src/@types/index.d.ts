declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';

declare module '*.svg' {
  import React from 'react';
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
interface ITheme {
  color: {
    white: string;
    black: string;
  };
  fonts: {
    normal: string;
  };
}
export type RootStackParamList = {
  DoIt2: {
    type: string;
    icon: 'puppy' | 'puppyOff' | 'bags' | 'bagsOff' | 'building' | 'buildingOff' | 'shopping' | 'shoppingOff';
  };
  ChatDetail: {
    roomId: long;
  };
  DoItListDetail: {
    id: long;
  };
};
