import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance.js'
import { kakaoLogin } from '../api/auth.js'

export default function KakaoCallbackPage() {
  const navigate = useNavigate()

  useEffect(async () => {
    // URL에서 'code' 파라미터 추출
    const urlParams = new URLSearchParams(window.location.search)
    const authorization_code = urlParams.get('code')

    if (authorization_code) {
      // 인가 코드가 있으면 백엔드로 전달
      try {
        await kakaoLogin({ authorization_code })
        navigate('/')
      } catch (error) {
        alert(error)
      }
    } else {
      console.error('인가 코드가 없습니다.')
    }
  }, [])

  return <div>카카오 로그인 중...</div>
}
