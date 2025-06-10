import { useNavigate } from 'react-router-dom'
import { kakaoLogin } from '../api/auth.js'
import useAuthStore from '../api/useAuthStore.js' // Zustand 스토어 import
import React, { useEffect, useRef } from 'react'

export default function KakaoCallbackPage() {
  const navigate = useNavigate()
  const { setAuthStoreLogin } = useAuthStore()
  const hasRun = useRef(false) // 카카오 로그인시 500 에러 -> authorization_code를 이용한 로그인 API 요청이 중복 실행 그래서 요청 중복 방지 플래그를 넣음

  useEffect(() => {
    if (hasRun.current) return; // KakaoCallbackPage가 두 번 렌더링 되기에 한번만하게 바꿈
    hasRun.current = true;

    const login = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const authorization_code = urlParams.get('code')

      if (authorization_code) {
        try {
          const data = await kakaoLogin(authorization_code)
          console.log('카카오 로그인 응답:', data)
          setAuthStoreLogin(data.token, { userId: data.userId, email: data.email,})
          localStorage.setItem('kakao_token', data.token)
          localStorage.setItem('userId', data.userId)
          localStorage.setItem('email', data.email)
          navigate('/')
        } catch (error) {
          alert('카카오 로그인 실패: ' + error.message)
        }
      } else {
        console.error('인가 코드가 없습니다.')
      }
    }

    login()
  }, [navigate, setAuthStoreLogin])

  return <div>카카오 로그인 중...</div>
}
//   