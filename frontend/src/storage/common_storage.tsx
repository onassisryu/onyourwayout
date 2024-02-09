import AsyncStorage from '@react-native-async-storage/async-storage';
import {logoutUser} from '@/utils/common';

export const setStorage = async (key: string, value: string) => {
  try {
    console.log(`setItem... ${key} : ${JSON.stringify(value)}`);
    return await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    throw e;
  }
};

export const getStorage = async (key: string) => {
  try {
    const res = await AsyncStorage.getItem(key);
    if (res) {
      console.log(`getItem... ${key} : ${res}`);
      return res && JSON.parse(res);
    } else {
      return null;
    }
  } catch (e) {
    throw e;
  }
};

export const removeStorage = async (key: string) => {
  return await AsyncStorage.removeItem(key);
};

export const clearStorage = () => {
  console.log('clearStorage...');
  AsyncStorage.clear();
};
