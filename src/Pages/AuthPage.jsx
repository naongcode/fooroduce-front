import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance.js'
import { kakaoLogin } from '../api/auth.js'

export default function KakaoCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const login = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const authorization_code = urlParams.get('code')

      if (authorization_code) {
        try {
          await kakaoLogin(authorization_code)
          navigate('/')  // 로그인 성공 후 홈으로 이동
        } catch (error) {
          alert('카카오 로그인 실패: ' + error.message)
        }
      } else {
        console.error('인가 코드가 없습니다.')
      }
    }

    login()
  }, [navigate])

  return <div>카카오 로그인 중...</div>
}
