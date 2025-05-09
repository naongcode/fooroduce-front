import { Link, Outlet, Route, Routes } from 'react-router-dom'
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
          <Route path="auth" element={<KakaoCallbackPage />} />
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
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="login">로그인</Link>
        <Link to="membership">회원가입</Link>
      </nav>
      <Outlet />
    </div>
  )
}

export default App
