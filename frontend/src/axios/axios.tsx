import axios from 'axios';
import {useSetRecoilState} from 'recoil';
import {loadingState} from '@/recoil/atoms';

// const loadingStatus = useSetRecoilState(loadingState);
// const setLoading = (status: boolean) => {
//   if (status) console.log('loading start');
//   else console.log('loading end');
//   loadingStatus(status);
// };
const axiosBasic = axios.create({
  baseURL: 'http://i10a302.p.ssafy.io:8080',
});
axiosBasic.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

axiosBasic.interceptors.response.use(
  response => {
    return response;
  },
  err => {
    return Promise.reject(err);
  }
);

export default axiosBasic;
