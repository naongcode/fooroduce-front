import { useParams } from 'react-router-dom'
import { getVoteResults, voteAsGuest, voteAsMember } from '../api/vote.js'
import { geocodeAddress } from '../api/map.js'
import { useEffect, useState } from 'react'
import { isLoggedIn } from '../api/auth.js'
import KaKaoMap from '../components/KaKaoMap.jsx'
import '../style/EventPage.css'
import VoteResultChart from '../components/Rechart.jsx'
import PyramidGrid2 from '../components/PyramidGrid2.jsx'
import axiosInstance from '../api/axiosInstance.js'
import { getNearbyEvents } from '../api/eventNearby.js'

export default function EventPage() {

  // 경로에서 eventId 받아오기
  const { eventId } = useParams()
  // console.log("eventId:", eventId);
    
  const [eventData, setEventData] = useState(null);
  const [eventResult, setEventResult] = useState([])
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  const [votedTruckIds, setVotedTruckIds] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);

  // 행사상세 가져오기 
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axiosInstance.get(`/events/${eventId}`);
        setEventData(res.data);
        // console.log('eventData', res.data);
      } catch (err) {
        console.error("이벤트 상세 조회 실패", err);
      }
    };

    fetchEventData();
  }, [eventId]);


  // const eventData = eventArray.find((event) => event.event_id === +eventId)
  // const isEnd = eventData?.voteEnd < new Date(); // Optional chaining

  // const applyData = applyArray.find((event) => event.event_id === +eventId)
  // const applyData = useMemo(() => {
  //   return applyArray.find((event) => event.event_id === +eventId);
  // }, [eventId]);


  // 투표가 끝난 경우에만 결과를 가져옴
  // useEffect(() => {
  //   if (eventData && new Date(eventData.vote_end) < new Date()) {
  //     fetchVoteResult();
  //   }
  // }, [eventData])

  // 투표 결과
  useEffect(() => {
      fetchVoteResult();
  }, [eventId])

  const fetchVoteResult = async () => {
    try {
      const response = await getVoteResults(eventId)
      setEventResult(response.data)
      // console.log('eventResult',response.data)

    } catch (e) {
      console.log('fetch result failed', e)
    }
  } 
  
  // 투표를 이미 했는지 확인
  useEffect(() => {
    const fetchVoteStatus = async () => {
      try {
        // jwt, fingerprint 꺼내서 API 호출
        const token = localStorage.getItem('jwtToken')
        const fingerprint = localStorage.getItem('fingerprint')

        if (!token && !fingerprint) {
          // 투표 상태 알 수 없으면 그냥 return
          return
        }

        // 인증 토큰 넣고, fingerprint는 query param으로 보내는 식으로 가정
        const config = {
          headers: {},
          params: {},
        }
        if (token) config.headers['Authorization'] = `Bearer ${token}`
        if (fingerprint) config.params['fingerprint'] = fingerprint

        const res = await axiosInstance.get(`/votes/status/${eventId}`, config)
        
        const votedIds = res.data
          .filter(item => item.alreadyVoted)
          .map(item => item.truckId);

        // console.log('res.data',res.data)
        // console.log('votedIds',votedIds)
        setVotedTruckIds(votedIds)
      } catch (e) {
        console.error('투표 상태 조회 실패', e)
      }
    }

    fetchVoteStatus()
  }, [eventId])


  {/* 지도 관련 */}
  useEffect(() => {
    const fetchGeocode = async () => {
        try {
          const response = await geocodeAddress(eventData.location);
          // console.log("받은 응답:", response); // 응답 전체 출력
          const { latitude, longitude } = response.data; // 응답에서 위경도 값 추출
          // console.log("응답 받은 위경도:", latitude, longitude)
          setCoords({ lat: latitude, lng: longitude });
        } catch (e) {
          console.error(e);
          alert('주소 변환 실패');
        }
    };

    if (eventData?.location) {
      fetchGeocode();
    }
  }, [eventData]); // eventData가 변경될 때마다 호출


  // 주변행사추천
  useEffect(() => {
    const fetchNearbyEvents = async () => {
      try {
        if (coords.lat === 0 && coords.lng === 0) return;
        const res = await getNearbyEvents(coords.lng, coords.lat );
        setNearbyEvents(res.data);
        console.log('Nearby events:', res.data);
      } catch (err) {
        console.error('주변 행사 추천 실패', err);
      }
    };

    fetchNearbyEvents();
  }, [coords, eventId]);


  // if (loading) return <p>로딩 중...</p>;
  // if (error) return <p>에러 발생: {error.message}</p>;
  // if (!eventId) return null;
  if (!eventData) return <p>데이터 없음</p>;

  // 투표하기
  const handleVote = async (truck_id) => {
    try {
      // console.log("로그인 상태:", isLoggedIn());
      // console.log("truck_id:", truck_id );

      if (isLoggedIn()) {
        await voteAsMember({ eventId: eventId, truckId: truck_id });
      } else {
        await voteAsGuest({ eventId: eventId, truckId: truck_id });
      }

      // window.location.reload();
    } catch (e) {
      console.log('vote failed', e);
    }
  };

   // 컴포넌트에 전달할 이미지 모음
  const imageUrls = eventData.trucks.flatMap(truck =>
    truck.menus.map(menu => menu.menuImage)
  );
  //  console.log('imageUrls',imageUrls)



  return (
    <div className="event-page">
      {/* 축제 정보 */}
      <div className="event-info">
        <h1>{eventData.eventName}</h1>
        <div className="event-description">
          <div className="event-image">
            <img
              src={eventData.eventImage}
              alt="행사 사진"
              className="event-image-img"
            />
          </div>
          <div className="event-details">
            <p>주최 : {eventData.eventHost}</p>
            <p>행사내용 : {eventData.description}</p>
            <p>모집 트럭 수 : {eventData.truckCount}대</p>
            <p>모집 기간 : {eventData.recruitStart.slice(0, 10)} ~ {eventData.recruitEnd.slice(0, 10)}</p>
            <p>투표 기간 : {eventData.voteStart.slice(0, 10)} ~ {eventData.voteEnd.slice(0, 10)}</p>
            <p>행사 기간 : {eventData.eventStart.slice(0, 10)} ~ {eventData.eventEnd.slice(0, 10)}</p>
          </div>
        </div>

        {/* 지도 */}
        <div className="map-section">
          <h3>행사위치 : {eventData.location}</h3>
          <KaKaoMap
            key={`${coords.lat}-${coords.lng}`} // 좌표가 바뀌면 컴포넌트 재마운트
            longitude={coords.lng}
            latitude={coords.lat}
            style={{  width: '50%', height: '400px', borderRadius: '12px', marginTop: '1rem' }}
            content={eventData.eventName}
            level={3}
          />

          {nearbyEvents.length > 0 && (
            <div className="nearby-events-section">
              <h3>📍 주변 추천 행사</h3>
              <div className="nearby-event-cards">
                {nearbyEvents.map((event) => (
                  <div key={event.eventId} className="nearby-event-card">
                    <img src={event.eventImage} alt="행사 이미지" className="nearby-event-image" />
                    <div className="nearby-event-info">
                      <h4>{event.eventName}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <hr className="event-divider" />

      {/* 푸드트럭 리스트 */}
      <h3 className="truck-list-title">맛있는(?) 트럭에 "투표" 하세요</h3>
      <div className="truck-list">
        {eventData?.trucks?.map((truck) => {
            const isVoted = votedTruckIds.includes(truck.truckId);
            const truckData = truck;
            const menuData = truck.menus ?? [];

          return (
            <div key={truck.truckId} className="truck-card">
              <details className="truck-details">
                <summary className="truck-summary">
                  <span className="truck-title">{truckData.truckName}</span>
                  <p>{truckData.description}</p>
                  <button
                    onClick={() => handleVote(truck.truckId)} 
                    className={`vote-button ${isVoted ? 'voted' : ''}`}
                    disabled={isVoted}> {isVoted ? '투표 완료' : '투표하기'}
                  </button>
                  {/* <span className="toggle-icon">▼</span> */}
                </summary>
                <ol className="menu-list">
                  {menuData.map((menu, index) => (
                    <li key={index} className="menu-item">
                      <p>{menu.menuName}</p>
                      <p>({menu.menuPrice}원)</p>
                      <img src={menu.menuImage} alt="메뉴 사진" className="menu-image" />
                    </li>
                  ))}
                </ol>
              </details>
            </div>
          )
        })}
      </div>

      <hr className="event-divider"/>

      {/* 더미데이터임 */}
      <h3 className="vote-title">🔥 투표 진행중 !!! 🔥</h3>

      <div className="vote-wrapper">
        {/* 리차트 */}
        <div className="vote-chart-container">
          <VoteResultChart data={eventResult} userVotedName={"타코타코코"} />
        </div>

        {/* 피라미드 */}
        <div>
          <PyramidGrid2 images={imageUrls} />
        </div>
      </div>

    </div> 
  )
}
