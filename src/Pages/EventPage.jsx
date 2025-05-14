import eventArray from '../data/eventData.json'
import menuArray from '../data/truckMenu.json'
import applyArray from '../data/truckApply.json'
import truckArray from '../data/truckData.json'
import { useParams } from 'react-router-dom'

import { getVoteResults, voteAsGuest, voteAsMember } from '../api/vote.js'
import { useEffect, useState } from 'react'
import { isLoggedIn } from '../api/auth.js'
import VoteResultChart from '../components/Rechart.jsx'
import voteResult from '../data/voteResult.json'
import VotePyramidVote from '../components/VotePyramidVote.jsx'
import KaKaoMap from '../components/KaKaoMap.jsx'

import '../style/EventPage.css'

export default function EventPage() {
  const { eventId } = useParams()
  console.log("eventId:", eventId);

  const [eventResult, setEventResult] = useState([])

  const eventData = eventArray.find((event) => event.event_id === +eventId)
  const isEnd = eventData.voteEnd < new Date()
  const applyData = applyArray.find((event) => event.event_id === +eventId)

  // 투표가 끝난 경우에만 결과를 가져옴
  useEffect(() => {
    if (isEnd) fetchVoteResult()
  }, [])

  const fetchVoteResult = async () => {
    try {
      const response = await getVoteResults(eventId)
      const data = await response.json()
      setEventResult(data)
    } catch (e) {
      alert('fetch result failed', e)
    }
  }

  const handleVote = async (truck_id) => {
    try {
      console.log("로그인 상태:", isLoggedIn());
      console.log("truck_id:", truck_id );

      if (isLoggedIn()) {
        await voteAsMember({ eventId: eventId, truckId: truck_id });
      } else {
        await voteAsGuest({ eventId: eventId, truckId: truck_id });
      }

      window.location.reload();
    } catch (e) {
      console.log('vote failed', e);
    }
  };

  return (
    <div className="event-page">
      {/* 축제 정보 */}
      <div className="event-info">
        <h1>{eventData.event_name}</h1>
        <div className="event-description">
          <div className="event-image">
            <img
              src={eventData.event_image}
              alt="행사 사진"
              className="event-image-img"
            />
          </div>
          <div className="event-details">
            <p>주최 : {eventData.event_host}</p>
            <p>행사내용 : {eventData.description}</p>
            <p>모집 트럭 수 : {eventData.truck_count}대</p>
            <p>모집 기간 : {eventData.recruit_start} ~ {eventData.recruit_end}</p>
            <p>투표 기간 : {eventData.vote_start} ~ {eventData.vote_end}</p>
            <p>행사 기간 : {eventData.event_start} ~ {eventData.event_end}</p>
          </div>
        </div>

        {/* 지도 */}
        <div className="map-section">
          <h3>행사위치 : {eventData.location}</h3>
          <KaKaoMap
            longitude={eventData.longitude}
            latitude={eventData.latitude}
            style={{  width: '50%', height: '400px', borderRadius: '12px', marginTop: '1rem' }}
            content={eventData.event_name}
            level={3}
          />
        </div>
      </div>

      <hr className="event-divider" />

      {/* 푸드트럭 리스트 */}
      <h3 className="truck-list-title">푸드트럭 리스트</h3>
      <div className="truck-list">
        {applyData?.trucks?.map((truck) => {
          const truckData = truckArray[truck.truck_id]
          const menuData = menuArray[truck.truck_id] ?? []

          return (
            <div key={truck.truck_id} className="truck-card">
              <details className="truck-details">
                <summary className="truck-summary">
                  <span className="truck-title">{truckData.name}</span>
                  <p>{truckData.description}</p>
                  <button onClick={() => handleVote(truck.truck_id)} className="vote-button">
                    투표하기
                  </button>
                  <span className="toggle-icon">▼</span>
                </summary>
                <ol className="menu-list">
                  {menuData.map((menu, index) => (
                    <li key={index} className="menu-item">
                      <p>{menu.menu_name}</p>
                      <p>({menu.menu_price}원)</p>
                      <img src={menu.menu_image} alt="메뉴 사진" className="menu-image" />
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          )
        })}
      </div>

      <hr className="event-divider" />

      <h3 className="vote-title">맛있는 트럭에 투표하세요</h3>

      {/* 리차트 */}
      <div className="vote-chart-container">
        <VoteResultChart data={voteResult} userVotedName={"타코타코"} />
      </div>

      <VotePyramidVote rankedTrucks={voteResult} />

      <div className="vote-results">
        {eventResult.results?.map((truck) => {
          const truckData = truckArray[truck.truck_id]
          const menuData = menuArray[truck.truck_id] ?? []
          return (
            <div key={truck.truck_id} className="truck-card">
              <details className="truck-details">
                <summary className="truck-summary">
                  <span className="truck-title">{truckData.name}</span>
                  <p>투표수: {truck.vote_count}</p>
                  <p>{truckData.description}</p>
                  <span className="toggle-icon">▼</span>
                </summary>
                <ol className="menu-list">
                  {menuData.map((menu, index) => (
                    <li key={index} className="menu-item">
                      <p>{menu.menu_name}</p>
                      <p>{menu.menu_price}원</p>
                      <img src={menu.menu_image} alt="메뉴 사진" className="menu-image" />
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          )
        })}
      </div>
    </div>
  )
}
