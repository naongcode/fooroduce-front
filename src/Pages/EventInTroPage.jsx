import { geocodeAddress } from '../api/map.js'
import { useEffect, useState } from 'react'
import '../style/EventPage.css'
import { getNearbyEvents } from '../api/eventNearby.js'
import EventDetailCard from '../components/EventCard.jsx'
import RecommendationList from '../components/PostCard.jsx'
import KakaoMapLoader from '../components/KaKaoMap.jsx'
import { useEvent } from './EventPage.jsx'

export default function EventIntroPage() {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  const [nearbyEvents, setNearbyEvents] = useState([])

  const { eventData } = useEvent()
  // 행사상세 가져오기

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

  {
    /* 지도 관련 */
  }
  useEffect(() => {
    const fetchGeocode = async () => {
      try {
        const response = await geocodeAddress(eventData.location)
        // console.log("받은 응답:", response); // 응답 전체 출력
        const { latitude, longitude } = response.data // 응답에서 위경도 값 추출
        // console.log("응답 받은 위경도:", latitude, longitude)
        setCoords({ lat: latitude, lng: longitude })
      } catch (e) {
        console.error(e)
        alert('주소 변환 실패')
      }
    }

    if (eventData?.location) {
      fetchGeocode()
    }
  }, [eventData]) // eventData가 변경될 때마다 호출

  // 주변행사추천
  useEffect(() => {
    const fetchNearbyEvents = async () => {
      try {
        if (coords.lat === 0 && coords.lng === 0) return
        const res = await getNearbyEvents(coords.lng, coords.lat)
        setNearbyEvents(res.data)
        console.log('Nearby events:', res.data)
      } catch (err) {
        console.error('주변 행사 추천 실패', err)
      }
    }

    fetchNearbyEvents()
  }, [coords])

  // if (loading) return <p>로딩 중...</p>;
  // if (error) return <p>에러 발생: {error.message}</p>;
  // if (!eventId) return null;
  if (!eventData) return <p>데이터 없음</p>

  return (
    <>
      <EventDetailCard eventData={eventData} />
      <div className="border-t pt-4 space-y-2 text-gray-700">
        <div className="flex flex-col justify-between">
          <span className="font-semibold text-2xl">행사 위치</span>
          <KakaoMapLoader
            key={`${coords.lat}-${coords.lng}`} // 좌표가 바뀌면 컴포넌트 재마운트
            longitude={coords.lng}
            latitude={coords.lat}
            style={{
              width: '100%',
              height: '400px',
              borderRadius: '12px',
              marginTop: '1rem',
            }}
            content={eventData.eventName}
            level={6}
            nearbyEvents={nearbyEvents} // 주변 행사 데이터
          />
        </div>
      </div>
      {nearbyEvents.length > 0 && <RecommendationList posts={nearbyEvents} />}
    </>
  )
}