import {Theme} from '@emotion/react';

const color = {
  white: '#FFFFFF',
  black: '#262626',
  primary: '#00D282',
  lightgray: '#F9F9F9',
  gray0: '#E9E9E9',
  gray100: '#DCDCDC',
  gray200: '#C4C4C4',
  gray300: '#ABABAB',
  gray: '#B2B2B2',
};
const font = {
  primary: 'PretendardVariable',
  clover: 'YClover TTF-Bold',
};

const fontSize = {
  short: '12px',
  small: '14px',
  medium: '16px',
  title: '42px',
  subtitle: '20px',
};

const border = {
  primary: '#00D282',
};

export type ColorsTypes = typeof color;
export type FontsTypes = typeof font;
export type FontSizeTypes = typeof fontSize;
export type BordersTypes = typeof border;

// 이 부분은 ThemeProvider로 적용하기 위한 과정이다.
const theme: Theme = {
  color,
  font,
  fontSize,
  border,
};

export default theme;
