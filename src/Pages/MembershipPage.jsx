import React, { useState } from 'react'
import { checkUserId, signup } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'

export default function MembershipPage() {
  const [id, setId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('GENERAL')
  const [valid, setValid] = useState(false)
  const navigate = useNavigate()

  const handleMembership = async (e) => {
    e.preventDefault()
    try {
      const data = await signup({ user_id: id, email, password, role })
      navigate('/')
    } catch (err) {
      alert('membership:failed', err)
    }
  }
  const handleCheckId = async (e) => {
    e.preventDefault()
    try {
      const data = await checkUserId(id)
      if (data.ok) setValid(true)
      else throw new Error("아이디 중복확인실패")
    } catch (err) {
        console.error('중복확인:', err.response || err.message || err);
         console.error('아이디 중복 확인 중 오류 발생');
    }
  }
  return (
    <div>
      <form onSubmit={handleMembership}>
        <label name="id">
          <h3 id="id">ID</h3>
          <input
            type="text"
            id="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <button type="button" onClick={handleCheckId}>
            중복확인
          </button>
        </label>
        <label name="password">
          <h3 id="password">비밀번호</h3>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label name="email">
          <h3 id="email">Email</h3>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label name="role">
          <h3 id="role">role</h3>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="GENERAL">일반 사용자</option>
            <option value="TRUCK_OWNER">푸드트럭 이용자</option>
            <option value="EVENT_MANAGER">기업 사용자</option>
          </select>
        </label>
      </form>
    </div>
  )
}
