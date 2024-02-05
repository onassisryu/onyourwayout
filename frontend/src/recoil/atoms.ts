import {atom} from 'recoil';
export const tokenState = atom({
  key: 'tokenState',
  default: '',
});

export const isLoggedInState = atom({
  key: 'isLoggedInState',
  default: false, // 기본적으로 로그인되어 있지 않음
});

export const userDataState = atom({
  key: 'userDataState', // 고유한 식별자
  default: null, // 초기값
});

export const userSignUpDataState = atom({
  key: 'userSignUpDataState',
  default: null,
});
