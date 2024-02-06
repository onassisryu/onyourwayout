import axios, {get} from 'axios';
import {getAccessToken} from '@/utils/common';
import {useSetRecoilState} from 'recoil';
import {loadingState} from '@/recoil/atoms';

const axiosAuth = axios.create({
  baseURL: 'http://i10a302.p.ssafy.io:8080',
});

axiosAuth.interceptors.request.use(
  async (config: any) => {
    const token = await getAccessToken();
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axiosAuth.interceptors.response.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default axiosAuth;
