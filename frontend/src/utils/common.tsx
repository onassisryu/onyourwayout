import {getStorage, removeStorage} from '@/storage/common_storage';

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
