import axios from 'axios';
import {getAccessToken} from '@/utils/common';

const axiosAuth = axios.create({
  baseURL: 'http://i10a302.p.ssafy.io:8080',
});

axiosAuth.interceptors.request.use(
  async (config: any) => {
    config.headers['Content-Type'] = 'application/json; charset=utf-8';
    config.headers['Authorization'] = await getAccessToken();
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
    const statusCode = err.response?.status;
    if (statusCode === 402) {
      console.log('토큰 만료');
    }
    return Promise.reject(err);
  }
);

export default axiosAuth;
