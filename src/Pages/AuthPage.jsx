import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { kakaoLogin } from '../api/auth.js'
import useAuthStore from '../api/useAuthStore.js' // Zustand 스토어 import

export default function KakaoCallbackPage() {
  const navigate = useNavigate()
  
  const { setAuthStoreLogin } = useAuthStore(); // Zustand 메서드 꺼냄

  useEffect(() => {
    const login = async () => {
      const urlParams = new URLSearchParams(window.location.search)
      const authorization_code = urlParams.get('code')

      if (authorization_code) {
        try {
          const data = await kakaoLogin(authorization_code)

          // 콘솔 확인
          console.log('카카오 로그인 응답:', data); // 전체 응답
          console.log('userId 확인:', data.userId); // userId 확인    

          setAuthStoreLogin(data.token, { userId: data.userId });

          // ✅ 토큰 저장
          localStorage.setItem('kakao_token', data.token)
          localStorage.setItem('userId', data.userId)

          // ✅ 페이지 이동
          navigate('/');
          //window.location.reload();    
          
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
