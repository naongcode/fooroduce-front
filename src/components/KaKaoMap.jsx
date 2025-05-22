import { useState, useEffect } from 'react'
import { Map, MapMarker } from 'react-kakao-maps-sdk'
import '../style/KakaoMap.css'

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
    <Map
      center={{ lat: latitude, lng: longitude }}
      style={style}
      level={level}
    >
      {/* 중심 마커 */}
      <MapMarker position={{ lat: latitude, lng: longitude }}>
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
          {content}
        </div>
      </MapMarker>

      {/* 주변 행사 마커들 */}
      {nearbyEvents.map((event) => (
        <MapMarker
          key={event.eventId}
          position={{ lat: event.latitude, lng: event.longitude }}
          onClick={() => window.location.href = `/votes/${event.eventId}`}
        >
          <div className="nearby-marker-text">
            {event.eventName}
          </div>
        </MapMarker>
      ))}
    </Map>
  )}

export default KakaoMapLoader
