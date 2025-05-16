import eventData from '../data/eventData.json'
import { Link } from 'react-router-dom'
import '../style/HomePage.css'

export default function HomePage() {
  return (
    <div className="homepage-container">
      {eventData.map((event) => (
        <Link to={`/event/${event.event_id}`} key={event.event_id} className="homepage-card-link">
          <div className="homepage-card">
            <h1>{event.event_name}</h1>
            <div className="homepage-image">
              <img
                src={event.event_image}
                alt="행사 사진"
                className="event-image"
              />
              <div className="homepage-text">
                <h2>주최 : {event.event_host}</h2>
                <p>모집기간 :</p><p> {event.recruit_start.slice(0, 10)} ~ {event.recruit_end.slice(0, 10)}</p>
                <p>투표기간 :</p><p> {event.vote_start.slice(0, 10)} ~ {event.vote_end.slice(0, 10)}</p>
                <p>행사기간 :</p><p> {event.event_start.slice(0, 10)} ~ {event.event_end.slice(0, 10)}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
