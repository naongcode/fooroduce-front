import { useState, useEffect } from 'react'
import { CustomOverlayMap, Map, MapMarker } from 'react-kakao-maps-sdk'
import '../style/KakaoMap3.css'
import { GiPositionMarker } from 'react-icons/gi'

const KakaoMapLoader = ({
  latitude,
  longitude,
  level,
  style,
  content,
  nearbyEvents = [],
}) => {
  const [kakaoMapLoaded, setKakaoMapLoaded] = useState(false)

  useEffect(() => {
    const loadKakaoMapScript = () => {
      const script = document.createElement('script')
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`
      script.async = true
      document.head.appendChild(script)

      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (window.kakao && window.kakao.maps) {
            window.kakao.maps.load(() => {
              console.log('Kakao Map API Loaded')
              setKakaoMapLoaded(true)
              resolve()
            })
          } else {
            reject(new Error('Kakao Maps API 로드 실패'))
          }
        }

        script.onerror = () =>
          reject(new Error('Kakao Maps API 스크립트 로드 오류'))
      })
    }

    loadKakaoMapScript().catch((error) => console.error(error))
  }, [])

  if (!kakaoMapLoaded) return <div>로딩중</div>

  return (
    <Map center={{ lat: latitude, lng: longitude }} style={style} level={level}>
      {/* 중심 마커 */}

      <CustomOverlayMap
        position={{ lat: latitude, lng: longitude }}
        yAnchor={1}
        zIndex={80}
      >
        <GiPositionMarker
          size={50}
          style={{
            fill: 'url(#grad1)',
            stroke: 'none',
          }}
        />

        <svg width="0" height="0" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" /> {/* Indigo-600 */}
              <stop offset="100%" stopColor="#a78bfa" /> {/* Purple-300 */}
            </linearGradient>
          </defs>
        </svg>
      </CustomOverlayMap>
      {/* 정보 카드 역할 */}
      <CustomOverlayMap
        position={{ lat: latitude - 0.002, lng: longitude }}
        yAnchor={2.1}
        zIndex={90}
      >
        <a
          href={`https://map.kakao.com/link/map/${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl shadow-sm flex-1 border border-indigo-100">
            <h4 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center">
              <i className="fas fa-map-marker-alt text-indigo-600 mr-2"></i>
              {content}
            </h4>
          </div>
        </a>
      </CustomOverlayMap>

      {/* 주변 행사 마커들 */}
      {nearbyEvents.map((event) => (
        <CustomOverlayMap
          key={event.eventId}
          position={{ lat: event.latitude, lng: event.longitude }}
          onClick={() => (window.location.href = `/votes/${event.eventId}`)}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 p-[5px] shadow-lg">
            <div className="w-full h-full rounded-full bg-white overflow-hidden">
              <img
                src={event.eventImage}
                alt="Event"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </CustomOverlayMap>
      ))}
    </Map>
  )
}

export default KakaoMapLoader
