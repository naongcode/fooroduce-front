import eventArray from '../data/eventData.json'
import menuArray from '../data/truckMenu.json'
import applyArray from '../data/truckApply.json'
import truckArray from '../data/truckData.json'
import { useParams } from 'react-router-dom'

import '../style/EventPage.css'
import KaKaoMap from '../components/KaKaoMap.jsx'
import { getVoteResults, voteAsGuest, voteAsMember } from '../api/vote.js'
import { useEffect, useState } from 'react'
import { isLoggedIn } from '../api/auth.js'
import VoteResultChart from '../components/Rechart.jsx'
import voteResult from '../data/voteResult.json'

export default function EventPage() {
  const { eventId } = useParams()

  const [eventResult, setEventResult] = useState([])

  const eventData = eventArray.find((event) => event.event_id === +eventId)
  const isEnd = eventData.voteEnd < new Date()
  const applyData = applyArray.find((event) => event.event_id === +eventId)

  //   투표가 끝난 경우에만 결과를 가져옴
  useEffect(() => {
    if (isEnd) fetchVoteResult()
  }, [])

  const fetchVoteResult = async () => {
    try {
      const response = await getVoteResults(eventId)
      const data = response.json()
      setEventResult(data)
    } catch (e) {
      alert('fetch result failed', e)
    }
  }

  const handleVote = async (truck_id) => {
    try {
      if (isLoggedIn()) await voteAsMember({ event_id: eventId, truck_id })
      else await voteAsGuest({ event_id: eventId, truck_id })
      window.location.reload()
    } catch (e) {
      alert('vote failed', e)
    }
  }

  return (
    <div>
      {/* 축제 정보 */}
      <header>
        <div>
          <h1>{eventData.event_name}</h1>
          <p>{eventData.event_host}</p>
          <p>{eventData.description}</p>
          <p>모집 트럭 수: {eventData.truck_count}대</p>
          <p>
            모집기간 : {eventData.recruit_start} ~ {eventData.recruit_end}
          </p>
          <p>
            행사기간 : {eventData.event_start} ~ {eventData.event_end}
          </p>
          <img src={eventData.event_image} alt="행사 사진" />
          {/*  지도 */}
          <div>
            <h2>{eventData.location}</h2>
            <KaKaoMap
              longitude={eventData.longitude}
              latitude={eventData.latitude}
              style={{ width: '500px', height: '500px' }}
              content={eventData.event_name}
              level={3}
            />
          </div>
        </div>
      </header>

      <hr />
      <h3>푸드트럭 리스트</h3>
      <section>
        {applyData?.trucks?.map((truck) => {
          const truckData = truckArray[truck.truck_id]
          const menuData = menuArray[truck.truck_id] ?? []
          return (
            <div key={truck.truck_id}>
              <details className="truck-details">
                <summary className="truck-summary">
                  <span className="truck-title">{truckData.name}</span>
                  <p>{truckData.description}</p>
                  <button onClick={() => handleVote(truck.truck_id)}>
                    투표하기
                  </button>
                  <span style={{ marginLeft: 'auto' }}>
                    <span className="toggle-icon">▼</span>
                  </span>
                </summary>
                <ol>
                  {menuData.map((menu, index) => (
                    <li key={index}>
                      <p>{menu.menu_name}</p>
                      <p>{menu.menu_price}원</p>
                      <img src={menu.menu_image} alt="메뉴 사진" />
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          )
        })}
      </section>
      <hr />
      <h3>투표 결과</h3>

      {/* 차트 */}
      <div>
        <VoteResultChart data = {voteResult} userVotedName={"김밥천국"}/>
      </div>
      
      <footer>
        {eventResult.results?.map((truck) => {
          const truckData = truckArray[truck.truck_id]
          const menuData = menuArray[truck.truck_id] ?? []
          return (
            <div key={truck.truck_id}>
              <details className="truck-details">
                <summary className="truck-summary">
                  <span className="truck-title">{truckData.name}</span>
                  <p>투표수:{truck.vote_count}</p>
                  <p>{truckData.description}</p>
                  <span style={{ marginLeft: 'auto' }}>
                    <span className="toggle-icon">▼</span>
                  </span>
                </summary>
                <ol>
                  {menuData.map((menu, index) => (
                    <li key={index}>
                      <p>{menu.menu_name}</p>
                      <p>{menu.menu_price}원</p>
                      <img src={menu.menu_image} alt="메뉴 사진" />
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          )
        })}
      </footer>
    </div>
  )
}
