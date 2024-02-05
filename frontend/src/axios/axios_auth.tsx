import axios from 'axios';
import {userDataState} from '@/recoil/atoms';
import {useRecoilValue} from 'recoil';
import {getStorage} from '@/storage/token_storage';
const axiosAuth = axios.create({
  baseURL: 'http://i10a302.p.ssafy.io:8080',
});
axiosAuth.interceptors.request.use(
  async (config: any) => {
    const token = await getStorage('token');
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
