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
        await kakaoLogin(authorization_code) // 구조도 수정됨
        navigate('/')
      } catch (error) {
        alert('카카오 로그인 실패: ' + error)
      }
    } else {
      console.error('인가 코드가 없습니다.')
    }
  }

  login()
}, [])

  return <div>카카오 로그인 중...</div>
}
