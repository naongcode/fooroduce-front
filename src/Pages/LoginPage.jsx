import React, { useState } from 'react'
import { login } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'
import '../style/LoginPage.css'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY
  const REDIRECT_URI = import.meta.env.VITE_LOGIN_REDIRECT_URI

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`
    window.location.href = kakaoAuthUrl
  }
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await login({ user_id: id, password })
      navigate('/')
      console.log('Logged in:', data)
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
