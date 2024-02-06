import {atom, AtomEffect} from 'recoil';

let userData: any = {};
export const tokenState = atom({
  key: 'tokenState',
  default: '',
});

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

export const isLoggedInState = atom({
  key: 'isLoggedInState',
  default: false,
});
export const loadingState = atom({
  key: 'loadingState',
  default: false,
});

// function persistAtom<T>(key: string): AtomEffect<T> {
//   let storageKey = '';
//   if (key === 'userDataState') storageKey = 'user';
//   else storageKey = key;
//   return ({setSelf, onSet}) => {
//     const loadPersisted = async () => {
//       const savedValue = await getStorage(storageKey);
//       if (savedValue) {
//         setSelf(savedValue);
//       }
//     };

//     loadPersisted();
//     onSet(newValue => {
//       setStorage(storageKey, JSON.stringify(newValue));
//     });
//   };
// }
