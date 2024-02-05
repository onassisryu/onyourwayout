import {getStorage, removeStorage} from '@/storage/common_storage';
import axiosAuth from '@/axios/axiosAuth';

export const refreshToken = async () => {
  // AsyncStorage에서 refreshToken 가져오기
  const getRefreshToken = await getStorage('refreshToken');

  if (!getRefreshToken) {
    console.log('Refresh token이 없습니다.');
  }
  console.log('Refresh token으로 발급받는 중..', getRefreshToken);

  // 서버에 요청 보내서 새 AccessToken 받아옴
};

// 현재 저장된 AccessToken 가져오기
export const getAccessToken = async (): Promise<string | null> => {
  const token = await getStorage('token');
  return token;
};

export const logoutUser = async () => {
  try {
    // 인증 정보 삭제
    await removeStorage('token');
    await removeStorage('refreshToken');
    await removeStorage('autoLogin');
    await removeStorage('user');
  } catch (error) {
    console.log!(error);
  }
};
