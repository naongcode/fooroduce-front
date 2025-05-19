import eventData from '../data/eventData.json'
import { useState, useEffect } from 'react' // 이 줄을 추가해야 함
import { Link } from 'react-router-dom'
import { getAllEvents, getOngoingEvents, getClosedEvents } from '../api/eventArray' // 전체, 진행중 행사, 마감된 행사 
import '../style/HomePage.css'

export default function HomePage() {

  const [events, setEvents] = useState([])  
  const [view, setView] = useState('all') // 'all', 'ongoing', 'closed'
  
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
