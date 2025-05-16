import React, { useState } from 'react'
import { login as apiLogin } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'
import '../style/LoginPage.css'
import useAuthStore from '../api/useAuthStore.js'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { setAuthStoreLogin  } = useAuthStore(); // Zustand store에서 login 가져오기


  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY
  const REDIRECT_URI = import.meta.env.VITE_LOGIN_REDIRECT_URI

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    window.location.href = kakaoAuthUrl
  }
  
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      // 로그인 API 호출
      const data = await apiLogin({ user_id: id, password })
      
      // 로그인 성공 후 상태 업데이트
      console.log("로그인 성공, user 데이터:", data.user);
      console.log("로그인 성공, token 데이터:", data.token);

      // Zustand 상태에 유저 정보 저장
      setAuthStoreLogin(data.token, data.user);
      
      // login(data.user); // Zustand 상태에 유저 정보 저장
      // console.log("Zustand 상태 저장 후:", useAuthStore.getState().user); 

      // 홈으로 네비게이션
      console.log('Logged in:', data)
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <label htmlFor="id" className="login-label">ID</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="login-input"
        />

        <label htmlFor="password" className="login-label">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <input type="submit" value="로그인" className="login-button" />
      </form>

      <hr className="login-divider" />

      <div className='kakao-login-ctn'>
        <button onClick={handleKakaoLogin} className="kakao-login-button">
          <img
            src="https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_medium_narrow.png"
            alt="카카오 로그인"
            />
        </button>
      </div>
    </div>
  )

}
