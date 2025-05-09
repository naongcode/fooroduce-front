import eventData from '../data/eventData.json'
import { Link } from 'react-router-dom'
export default function HomePage() {
  return eventData.map((event) => (
    <Link to={`/event/${event.event_id}`} key={event.event_id}>
      <div>
        <h1>{event.event_name}</h1>
        <p>{event.event_host}</p>
        <p>
          모집기간 : {event.recruit_start} ~ {event.recruit_end}
        </p>
        <p>
          행사기간 : {event.event_start} ~ {event.event_end}
        </p>
      </div>
    </Link>
  ))
}
