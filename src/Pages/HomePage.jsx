import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllEvents, getOngoingEvents, getClosedEvents } from '../api/eventArray'
import '../style/HomePage.css'

export default function HomePage() {
  const [events, setEvents] = useState([])  
  const [view, setView] = useState('all')
  const [role, setRole] = useState(null)
  const navigate = useNavigate()

  // 페이지가 로드될 때 로컬스토리지에서 역할(role) 가져오기
  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let data = []
        if (view === 'ongoing') {
          data = await getOngoingEvents()
        } else if (view === 'closed') {
          data = await getClosedEvents()
        } else {
          data = await getAllEvents()
        }
        setEvents(data)
      } catch (error) {
        console.error('Error loading events:', error)
      }
    }

    fetchEvents()
  }, [view])

  return (
    <div>
      <div className="homepage-buttons">
        <button onClick={() => setView('all')} className={`nav-button ${view === 'all' ? 'active' : ''}`}>전체</button>
        <button onClick={() => setView('ongoing')} className={`nav-button ${view === 'ongoing' ? 'active' : ''}`}>현재 투표 중</button>
        <button onClick={() => setView('closed')} className={`nav-button ${view === 'closed' ? 'active' : ''}`}>종료된 행사</button>

        {/* 권한에 따라 조건부 버튼 표시 */}
        {role === 'EVENT_MANAGER' && (
          <button onClick={() => navigate('/manager')}>행사관리</button>
        )}
        {role === 'TRUCK_OWNER' && (
          <button onClick={() => navigate('/owner')}>트럭관리</button>
        )}
      </div>

      <div className="homepage-container">
        {events.map((event) => (
          <Link to={`/event/${event.eventId}`} key={event.eventId} className="homepage-card-link">
            <div className="homepage-card">
              <h1>{event.eventName}</h1>
              <div className="homepage-image">
                <img src={event.eventImage} alt="행사 사진" className="event-image" />
                <div className="homepage-text">
                  <h2>주최 : {event.eventHost}</h2>
                  <p>모집기간 :</p><p>{event.recruitStart?.slice(0, 10)} ~ {event.recruitEnd?.slice(0, 10)}</p>
                  <p>투표기간 :</p><p>{event.voteStart?.slice(0, 10)} ~ {event.voteEnd?.slice(0, 10)}</p>
                  <p>행사기간 :</p><p>{event.eventStart?.slice(0, 10)} ~ {event.eventEnd?.slice(0, 10)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
