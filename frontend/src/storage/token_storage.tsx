import {AsyncStorage} from 'react-native';

export const getStorage = async (key: string) => {
  const result = await AsyncStorage.getItem(key);
  console.log('result', result);
  return result && JSON.parse(result);
};

export const setStorage = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
  const result = await AsyncStorage.getItem(key);
  console.log('저장완료', result);
  return await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeStorage = async (key: string) => {
  return await AsyncStorage.removeItem(key);
};

export const clearStorage = AsyncStorage.clear();
