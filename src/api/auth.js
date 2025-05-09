import axios from './axiosInstance'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const signup = (data) => axios.post('/users/signup', data)

export const login = async (data) => {
  const res = await axios.post('/users/login', data)
  localStorage.setItem('jwt_token', res.data.token)
  return res.data
}

export const kakaoLogin = async (authorizationCode) => {
  const res = await axios.post('/users/kakao/login', {
    authorization_code: authorizationCode,
  })
  localStorage.setItem('jwt_token', res.data.token)
  return res.data
}
export const Logout = () => {
  localStorage.removeItem('jwt_token')
}

export const checkUserId = (user_id) =>
  axios.get('/users/id-check', { params: { user_id } })

export const isLoggedIn = () => {
  return localStorage.getItem('jwt_token') != null
}

export const getGuestFingerprint = async () => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}
