import { useEffect, useState } from 'react'
import { geocodeAddress } from '../api/map'
import { getNearbyEvents } from '../api/eventNearby'
import KakaoMapLoader from './KaKaoMap'
import RecommendationList from './PostCard'

const EventDetailCard = ({ eventData }) => {
  const [coords, setCoords] = useState({ lat: 0, lng: 0 })
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

  return (
    <section className="mx-auto bg-white rounded-xl text-xl shadow-md p-6 space-y-6 m-5">
      {/* 제목 */}
      <header>
        <h3 className="text-xl text-gray-700">{eventData.eventHost}</h3>
        <h2 className="text-3xl font-bold mt-1 text-gray-900">
          [푸드트럭 모집] {eventData?.eventName}푸드트럭 참여 안내
        </h2>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-pink-100 text-pink-700 text-base font-medium px-3 py-1 rounded-full">
            "태그1"
          </span>
          <span className="bg-green-100 text-green-700 text-base font-medium px-3 py-1 rounded-full">
            "태그2"
          </span>
          <span className="bg-blue-100 text-blue-700 text-base font-meduim px-3 py-1 rounded-full">
            "태그3"
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">{eventData.description}</p>
      </header>

      {/* 요약 박스 */}
      <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <SummaryCard label="모집 트럭 수" value={eventData.truckCount} />
        <SummaryCard
          label="모집 기간"
          value={`${eventData.recruitStart.slice(0, 10)} ~ ${eventData.recruitEnd.slice(0, 10)}`}
        />
        <SummaryCard
          label="투표 기간"
          value={`${eventData.voteStart.slice(0, 10)} ~ ${eventData.voteEnd.slice(0, 10)}`}
        />
      </div>

      {/* 추가 일정 */}
      <div className="border-t pt-4 space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span className="font-semibold">행사 기간</span>
          <span>
            {eventData.eventStart.slice(0, 10)} ~
            {eventData.eventEnd.slice(0, 10)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">주최</span>
          <span>{eventData.eventHost}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">문의</span>
          <span>전화번호</span>
        </div>
      </div>
    </section>
  )
}

const SummaryCard = ({ label, value }) => (
  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl shadow-sm flex-1 border border-indigo-100">
    <h4 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center">
      <i className="fas fa-map-marker-alt text-indigo-600 mr-2"></i>
      {label}
    </h4>
    <p className="text-base text-gray-700">{value}</p>
  </div>
)

export default EventDetailCard
