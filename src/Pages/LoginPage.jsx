import React, { useState } from 'react'
import { login } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'

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
    <div>
      <form onSubmit={handleLogin}>
        <label htmlFor="id">ID</label>
        <input
          type="text"
          id="id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input type="submit" value="로그인" />
      </form>

      <hr />

      <button onClick={handleKakaoLogin}>카카오계정으로 로그인</button>
    </div>
  )
}
