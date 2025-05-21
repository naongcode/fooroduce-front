import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import LoginPage from './Pages/LoginPage.jsx'
import MembershipPage from './Pages/MembershipPage.jsx'
import HomePage from './Pages/HomePage.jsx'
import EventPage from './Pages/EventPage.jsx'
import KakaoCallbackPage from './Pages/AuthPage.jsx'
import LandingPage from './Pages/LangdingPage.jsx'
import EventManagerPage from './Pages/EventManagerPage.jsx'
import TruckOwnerPage from './Pages/TruckOwnerPage.jsx'
import VotePage from './Pages/VotePage.jsx'

import { useRef, useState, useEffect } from 'react'
import useAuthStore from './api/useAuthStore';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/api/users/kakao/login" element={<KakaoCallbackPage />} />
          <Route index element={<HomePage />} />
          <Route path="landing" element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="event/:eventId" element={<EventPage />} />
          <Route path="votes/:eventId" element={<VotePage />} />
          <Route path="manager" element={<EventManagerPage />} />
          <Route path="owner" element={<TruckOwnerPage />} />
        </Route>
      </Routes>
    </div>
  )
}

function AppLayout() {
  const navigate = useNavigate();
  const { isLoggedIn, resetAuthStore, userId} = useAuthStore(); // Zustand 상태 감지
  const handleNavigation = (path) => {
    navigate(path);  // 지정된 path로 네비게이션
  };

  const handleLogout = () => {
    resetAuthStore(); // Zustand 상태 초기화
    navigate('/');    // 홈으로 이동
    window.location.reload()
  };

  // 음악관련
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('재생 실패:', err);
      });
    }
  };
  // 음악 끝

  return (
    <div>
      <nav className="navbar">
        <div className="nav-left">
          <button className="nav-button" onClick={() => handleNavigation('/')}>Fooroduce</button>
          <button className="nav-button" onClick={toggleAudio}>
            {isPlaying ? '⏸️ 정지' : '▶️ 재생'}
          </button>
        </div>

        <div className="nav-right">
          {isLoggedIn ? (
            <>
              <span className="nav-user">안녕하세요 {userId}</span>
              <button className="nav-button" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="nav-button" onClick={() => handleNavigation('/login')}>로그인</button>
              <button className="nav-button" onClick={() => handleNavigation('/membership')}>회원가입</button>
            </>
          )}
        </div>
      </nav>

      <audio ref={audioRef} loop>
        <source src="/pickme.mp3" type="audio/mp3" />
      </audio>

      <Outlet />
    </div>
  );
}

export default App
