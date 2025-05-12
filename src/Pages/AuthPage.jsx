import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { kakaoLogin } from '../api/auth.js'

export default function KakaoCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const login = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const authorization_code = urlParams.get('code')

      if (authorization_code) {
        try {
          const data = await kakaoLogin(authorization_code)

          // ✅ 토큰 저장
          localStorage.setItem('token', data.token)

          // ✅ 페이지 이동
          navigate('/')
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
