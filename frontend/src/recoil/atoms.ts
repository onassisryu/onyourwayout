import {atom, AtomEffect} from 'recoil';
import {getStorage, setStorage} from '@/storage/token_storage';

export const tokenState = atom({
  key: 'tokenState',
  default: '',
});

export const isLoggedInState = atom({
  key: 'isLoggedInState',
  default: false,
});

export const userDataState = atom({
  key: 'userDataState',
  default: null,
});

export const userSignUpDataState = atom({
  key: 'userSignUpDataState',
  default: null,
});

function persistAtom<T>(key: string): AtomEffect<T> {
  return ({setSelf, onSet}) => {
    const loadPersisted = async () => {
      const savedValue = await getStorage('user');
      if (savedValue !== null) {
        setSelf(JSON.parse(savedValue));
      }
    };

    loadPersisted();
    onSet(newValue => {
      setStorage('user', newValue);
    });
  };
}
