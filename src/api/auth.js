import axiosInstance from './axiosInstance'
import axios from './axiosInstance'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const signup = (data) => axios.post('/users/signup', data)

export const login = async (data) => {
  const res = await axios.post('/users/login', data)
  localStorage.setItem('jwt_token', res.data.token)
  return res.data
}

// post에서 get으로 변경, axios에서 axiosInstance로 변경, params로 변경
export const kakaoLogin = async (authorizationCode) => {
  const res = await axiosInstance.get('/users/kakao/login', {
    params: {
      code: authorizationCode,
    },
  })
  console.log('authorization_code', authorizationCode)
  localStorage.setItem('jwt_token', res.data.token)
  return res.data
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
  return localStorage.getItem('jwt_token') != null
}

export const getGuestFingerprint = async () => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}
