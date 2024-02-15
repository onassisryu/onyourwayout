import {getStorage, removeStorage, clearStorage} from '@/storage/common_storage';
import {useSetRecoilState, useRecoilState} from 'recoil';
import {isLoggedInState, userDataState} from '@/recoil/atoms';

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
  try {
    const token = await getStorage('token');
    console.log(token);
    if (token !== null) {
      return 'Bearer ' + token;
    }
    return null;
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
};
export const logoutUser = async () => {
  // 인증 정보 삭제
  await clearStorage();
  await removeStorage('token');
  await removeStorage('refreshToken');
  await removeStorage('user');
  console.log('로그아웃 완료');
};
