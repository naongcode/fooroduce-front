import axiosInstance from './axiosInstance'
import axios from './axiosInstance'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import useAuthStore from './useAuthStore.js';  // Zustand store 가져오기

export const signup = (data) => axios.post('/users/signup', data)

export const login = async (data) => {
  try {
    const res = await axios.post('/users/login', data);
    
    // JWT 토큰을 localStorage에 저장
    localStorage.setItem('jwt_token', res.data.token);

    // Zustand 상태를 업데이트
    const { login } = useAuthStore.getState();
    login(res.data.user); // 서버에서 받은 유저 정보를 상태에 저장

    return res.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// post에서 get으로 변경, axios에서 axiosInstance로 변경, params로 변경
export const kakaoLogin = async (authorizationCode) => {
  try {
    const res = await axiosInstance.get('/users/kakao/login', {
      params: {
        code: authorizationCode,
      },
    })

    // 토큰이 존재하는지 확인 후 저장
    if (res.data.token) {
      localStorage.setItem('jwt_token', res.data.token)
    } else {
      throw new Error('토큰이 없습니다.')
    }
    return res.data
    
  } catch (error) {
    console.error('카카오 로그인 에러:', error)
    throw error
  }
}

export const Logout = () => {
  localStorage.removeItem('jwt_token')
}

// export const checkUserId = (user_id) =>
//   axios.get('/users/id-check', { params: { user_id } })
export const checkUserId = (user_id) =>
  axios.get(`/users/id-check?user_id=${user_id}`)
    .then((response) => response.data) // 응답 데이터 반환
    .catch((error) => { 
      console.error(error); 
      throw error; 
    });

export const isLoggedIn = () => {
  const token = localStorage.getItem('jwt_token');

  // 예시: 토큰이 유효하지 않거나 만료된 경우 제거 (단순 체크 기준)
  if (!token || token === 'undefined' || token === 'null') {
    localStorage.removeItem('jwt_token');
    return false;
  }

  return true;
};

export const getGuestFingerprint = async () => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}
