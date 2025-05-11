import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import LoginPage from './Pages/LoginPage.jsx'
import MembershipPage from './Pages/MembershipPage.jsx'
import HomePage from './Pages/HomePage.jsx'
import EventPage from './Pages/EventPage.jsx'
import KakaoCallbackPage from './Pages/AuthPage.jsx'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/oauth/callback/kakao" element={<KakaoCallbackPage />} />
          <Route index element={<HomePage />} />
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

  const handleNavigation = (path) => {
    navigate(path);  // 지정된 path로 네비게이션
  };

  return (
    <div>
      <nav className="navbar">
        <div>
          <button className="nav-button" onClick={() => handleNavigation('/')}>Fooroduce</button>
        </div>
        <div className="nav-right">
          <button className="nav-button" onClick={() => handleNavigation('/login')}>로그인</button>
          <button className="nav-button" onClick={() => handleNavigation('/membership')}>회원가입</button>
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default App
