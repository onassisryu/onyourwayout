import {atom} from 'recoil';
export const tokenState = atom({
  key: 'tokenState',
  default: '',
});

export const isLoggedInState = atom({
  key: 'isLoggedInState',
  default: false, // 기본적으로 로그인되어 있지 않음
});
