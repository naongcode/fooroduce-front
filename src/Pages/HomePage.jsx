import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllEvents, getOngoingEvents, getClosedEvents } from '../api/eventArray'
import '../style/HomePage.css'

export default function HomePage() {
  const [events, setEvents] = useState([])  
  const [view, setView] = useState('all')
  const [role, setRole] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const loaderRef = useRef(null)

  // 페이지가 로드될 때 로컬스토리지에서 역할(role) 가져오기
  useEffect(() => {
    const storedRole = localStorage.getItem('role')
    setRole(storedRole)
  }, [])

  const fetchEvents = async (currentPage = 0) => {
    if (loading || !hasMore) return
    setLoading(true)

    try {
      let data
      if (view === 'ongoing') {
        data = await getOngoingEvents(currentPage, 6)
      } else if (view === 'closed') {
        data = await getClosedEvents(currentPage, 6)
      } else {
        data = await getAllEvents(currentPage, 6)
      }

      // data는 배열임
      const newEvents = Array.isArray(data) ? data : []
      setEvents((prev) => {
        const existingIds = new Set(prev.map((e) => e.eventId))
        const filteredNewEvents = newEvents.filter((e) => !existingIds.has(e.eventId))
        return [...prev, ...filteredNewEvents]
      })

      // 리스트만 응답되므로 더 이상 데이터가 없다 판단 (혹은 따로 처리 필요)
      if (newEvents.length < 6) setHasMore(false)
      setPage((prev) => prev + 1)

    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  // 뷰 바뀔 때 초기화
  useEffect(() => {
    setEvents([])
    setPage(0)
    setHasMore(true)
    fetchEvents(0)
  }, [view])

  // 옵저버로 감시
  useEffect(() => {
    if (loading) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchEvents(page)
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) observer.observe(loaderRef.current)

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [page, hasMore, loading, view])

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
                  <h2>{event.eventHost}</h2><br></br>
                 {/*추가 */}
                  <div className="event-periods">
                    <p>모집기간 :</p><p>{event.recruitStart?.slice(0, 10)} ~ {event.recruitEnd?.slice(0, 10)}</p>
                    <p>투표기간 :</p><p>{event.voteStart?.slice(0, 10)} ~ {event.voteEnd?.slice(0, 10)}</p>
                    <p>행사기간 :</p><p>{event.eventStart?.slice(0, 10)} ~ {event.eventEnd?.slice(0, 10)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 옵저버 타겟 */}
      <div ref={loaderRef} className="loader" style={{ height: '10px' }}/>

    </div>
  )
}
