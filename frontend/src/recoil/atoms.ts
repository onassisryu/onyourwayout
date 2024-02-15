import {atom, AtomEffect} from 'recoil';

let userData: any = {};

//사용자 데이터
export const userDataState = atom({
  key: 'userDataState',
  default: userData,
});

//아파트 데이터
export const apartDataState = atom({
  key: 'apartDataState',
  default: [],
});
export const alaramState = atom({
  key: 'alaramState',
  default: {},
});

export const fcmTokenState = atom({
  key: 'fcmTokenState',
  default: {
    fcmToken: '',
  },
});

export const userSignUpDataState = atom({
  key: 'userSignUpDataState',
  default: {
    username: '',
    phoneNumber: '',
    birthDate: '',
    password: '',
    inviteCode: '',
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

export const noticeCountState = atom({
  key: 'noticeCountState', // unique ID
  default: 0, // default value
});