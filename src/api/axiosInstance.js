import axios from 'axios'

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://api.fooroduce.7team.xyz/api', // API 서버의 기본 URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// 요청을 보내기 전에 토큰을 헤더에 추가하는 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

export default axiosInstance
