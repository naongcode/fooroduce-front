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
                <p>주최 : {event.event_host}</p>
                <p>모집기간 : {event.recruit_start} ~ {event.recruit_end}</p>
                <p>투표기간 : {event.vote_start} ~ {event.vote_end}</p>
                <p>행사기간 : {event.event_start} ~ {event.event_end}</p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
