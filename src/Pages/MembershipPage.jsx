import React, { useState } from 'react'
import { checkUserId, signup } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'
import '../style/MembershipPage.css'

export default function MembershipPage() {
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('GENERAL')
  const [valid, setValid] = useState(false)
  const [idCheckMessage, setIdCheckMessage] = useState('')
  const navigate = useNavigate()

  const handleMembership = async (e) => {
    e.preventDefault()
    try {
      const data = await signup({ user_id: id, email, password, role })
      navigate('/login')
    } catch (err) {
      alert('membership:failed', err)
    }
  }

  const handleCheckId = async (e) => {
    e.preventDefault()
    try {
      const data = await checkUserId(id)
      if (data.usableId) {
        setValid(true)
        setIdCheckMessage('아이디 사용 가능')
        console.log('아이디 사용여부 : 가능')
      } else {
        setValid(false)
        setIdCheckMessage('이미 사용 중인 아이디입니다')
      }
    } catch (err) {
      console.error('중복확인:', err.response || err.message || err)
      setValid(false)
      setIdCheckMessage('중복 확인 중 오류가 발생했습니다')
    }
  }

  return (
    <div className="membership-container">
      <form onSubmit={handleMembership} className="membership-form">
        <h2>회원가입</h2>

        <div className="form-group">
          <label htmlFor="id">아이디</label>
          <div className="id-check">
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => {
                setId(e.target.value)
                setValid(false) // 아이디 변경 시 유효성 초기화
                setIdCheckMessage('') // 메시지도 초기화
              }}
              required
            />
            <button type="button" onClick={handleCheckId} className="check-btn">
              중복확인
            </button>
          </div>
          {idCheckMessage && (
            <div className={`id-check-message ${valid ? 'valid' : 'invalid'}`}>
              {idCheckMessage}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">사용자 유형</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="GENERAL">일반 사용자</option>
            <option value="TRUCK_OWNER">푸드트럭 이용자</option>
            <option value="EVENT_MANAGER">기업 사용자</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">회원가입</button>
      </form>
    </div>
  )
}
