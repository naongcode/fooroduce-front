import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import LoginPage from './Pages/LoginPage.jsx'
import MembershipPage from './Pages/MembershipPage.jsx'
import HomePage from './Pages/HomePage.jsx'
import EventPage from './Pages/EventPage.jsx'
import KakaoCallbackPage from './Pages/AuthPage.jsx'
import useAuthStore from './api/useAuthStore.js'
import LandingPage from './Pages/LangdingPage.jsx'
import { useRef, useState } from 'react'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/api/users/kakao/login" element={<KakaoCallbackPage />} />
          <Route index element={<HomePage />} />
          <Route path="landingtest" element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="membership" element={<MembershipPage />} />
          <Route path="event/:eventId" element={<EventPage />} />
        </Route>
      </Routes>
    </div>
  )
}

function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore(); // Zustand store에서 user와 logout 가져오기

  const handleNavigation = (path) => {
    navigate(path);  // 지정된 path로 네비게이션
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
          {user ? (
            <>
              <span className="nav-user">안녕하세요, {user.user_id}님</span>
              <button className="nav-button" onClick={logout}>로그아웃</button>
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
