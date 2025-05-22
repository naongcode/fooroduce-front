import { useParams, useNavigate } from 'react-router-dom'
import { getVoteResults, voteAsGuest, voteAsMember } from '../api/vote.js'
import { geocodeAddress } from '../api/map.js'
import { useEffect, useState, useRef } from 'react'
import { isLoggedIn } from '../api/auth.js'
import KaKaoMap from '../components/KaKaoMap.jsx'
import '../style/EventPage.css'
import axiosInstance from '../api/axiosInstance.js'
import { getNearbyEvents } from '../api/eventNearby.js'

export default function EventPage() {

  // 경로에서 eventId 받아오기
  const { eventId } = useParams()
  // console.log("eventId:", eventId);
  const navigate = useNavigate();
    
  const [eventData, setEventData] = useState(null);
  const [eventResult, setEventResult] = useState([])
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  const [votedTruckIds, setVotedTruckIds] = useState([]);
  const [nearbyEvents, setNearbyEvents] = useState([]);

  const truckListRef = useRef(null); //이 트럭 투표하러 가기 버튼을 누르면 해당란으로 이동
  const [isPopularVisible, setIsPopularVisible] = useState(true); // 광고 트럭 섹션을 보여줄지 여부

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

  // eventData.trucks 와 eventResult (투표 결과)를 활용해서 인기 트럭 3개 추출
  const popularTrucks = eventData.trucks
  .map(truck => {
    const voteInfo = eventResult.find(v => v.truckId === truck.truckId);
    return {
      ...truck,
      voteCount: voteInfo ? voteInfo.voteCount : 0
    };
  })
  .sort((a, b) => {
    if (b.voteCount !== a.voteCount) {
      return b.voteCount - a.voteCount; // 투표 수 내림차순
    } 
    return a.truckName.localeCompare(b.truckName); // 투표 수 같으면 이름 오름차순
  })
  .slice(0, 3);

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
            style={{ width: '50%', height: '400px', borderRadius: '12px', marginTop: '1rem' }}
            content={eventData.eventName}
            level={3}
            nearbyEvents={nearbyEvents} // 주변 행사 데이터
            
          />

          {nearbyEvents.length > 0 && (
            <div className="nearby-events-section">
              <h3>📍 주변 추천 행사</h3>
              <div className="nearby-event-cards">
                {nearbyEvents.map((event) => (
                  <div key={event.eventId} className="nearby-event-card" onClick={() => navigate(`/event/${event.eventId}`)} style ={{ cursor: 'pointer' }}>
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

      {/* 광고 트럭 섹션 추가 (최소화 기능 포함) */}
      <div className="sticky-ads">
        <div className="ads-header">
          <h3 className="ads-title">✨ 주목! 인기 푸드트럭 ✨</h3>
          <button
            className="ads-toggle-button"
            onClick={() => setIsPopularVisible((prev) => !prev)}
          >
            {isPopularVisible ? '최소화' : '펼치기'}
          </button>
        </div>

        {isPopularVisible && (
          <div className="ads-truck-list">
            {popularTrucks.map((truck) => (
              <div key={truck.truckId} className="ads-truck-card">
                <img src={truck.menus[0]?.menuImage} alt="대표 메뉴" className="ads-truck-image" />
                <div className="ads-truck-info">
                  <p className="ads-truck-name">{truck.truckName}</p>
                 <button
                    onClick={() => navigate(`/votes/${eventId}`)}
                    className="goto-vote-button">
                    이 트럭 투표하러 가기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div> 
  )
}
