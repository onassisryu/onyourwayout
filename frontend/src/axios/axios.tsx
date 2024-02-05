import axios from 'axios';
const axiosAuth = axios.create({
  baseURL: 'http://i10a302.p.ssafy.io:8080',
});
axiosAuth.interceptors.request.use(
  config => {
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
