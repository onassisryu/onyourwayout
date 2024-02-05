import {GlobalButton} from '@/GlobalStyles';
import {setItem, getItem} from '@/storage/common_storage';
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import axios from 'axios';

const Test = () => {
  const [storageValue, setStorageValue] = useState('');
  const [user, setUser] = useState('');
  const [username, setusername] = useState('a@gmail');
  const [password, setPassword] = useState('1234');

  const onPressSetAsyncStorage = async () => {
    try {
      await setItem('key', 'fgggsf');
      confirmAsyncValue();
    } catch (e) {
      console.log(e);
    }
  };

  const confirmAsyncValue = async () => {
    const result = await getItem('key');
    setStorageValue(result);
  };
  const confirmAsyncUser = async () => {
    const result = await getItem('user');
    console.log(result);
    const test = result.nickname;
    setUser(test);
  };
  const login = async () => {
    try {
      const response = await axios.post('http://i10a302.p.ssafy.io:8080/members/signin', {username, password});
      if (response.data !== null && response.data !== '') {
        console.log(response.data);
        await setItem('user', response.data.memberInfo);
        confirmAsyncUser();
      } else {
      }
    } catch (error) {
      console.log(`Error Message: ${error}`);
    }
  };

  useEffect(() => {
    confirmAsyncValue();
    confirmAsyncUser();
  }, []);

  return (
    <View>
      <GlobalButton onPress={onPressSetAsyncStorage}>
        <Text>저장</Text>
      </GlobalButton>
      <GlobalButton onPress={login}>
        <Text>로그인</Text>
      </GlobalButton>
      <Text>{storageValue}</Text>
      <Text>{user}</Text>
    </View>
  );
};

export default Test;
