import {atom, AtomEffect} from 'recoil';

let userData: any = {};

//사용자 데이터
export const userDataState = atom({
  key: 'userDataState',
  default: userData,
});

export const userSignUpDataState = atom({
  key: 'userSignUpDataState',
  default: {
    username: '',
    phoneNumber: '',
    birthDate: '',
    password: '',
  },
});

//자동 로그인 여부
export const isLoggedInState = atom({
  key: 'isLoggedInState',
  default: false,
});

//로딩 상태
export const loadingState = atom({
  key: 'loadingState',
  default: false,
});
