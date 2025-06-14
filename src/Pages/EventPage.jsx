import React, { createContext, useContext, useState } from 'react'
import axiosInstance from '../api/axiosInstance'; 
import {
  Link,
  Outlet,
  Route,
  Routes,
  useMatch,
  useNavigate,
  useParams,
} from 'react-router-dom'
import useVotePageData from '../api/useVotePageData'
import EventIntroPage from './EventInTroPage'
import EventVotePage from './EventVotePage'
import ConfirmModal from '../components/ConfirmModal'

const EventContext = createContext(null)
export const useEvent = () => useContext(EventContext)

export default function EventPage() {
  return (
    <Routes>
      <Route path="/" element={<EventLayout />}>
        <Route index element={<EventIntroPage />} />
        <Route path="votes" element={<EventVotePage />} />
      </Route>
    </Routes>
  )
}

const EventLayout = () => {
  const { eventId } = useParams()

  const {
    eventData,
    eventResult,
    votedTruckIds,
    setVotedTruckIds,
    fetchVoteResult,
  } = useVotePageData(eventId)

  return (
    <EventContext.Provider
      value={{
        eventData,
        eventResult,
        votedTruckIds,
        setVotedTruckIds,
        fetchVoteResult,
      }}
    >
      <EventHeader />
      <section className="py-20 bg-gradient-to-b from-white to-indigo-50 z-100">
        <div className="container mx-auto px-6">
          <Outlet />
        </div>
      </section>
      <EventFooter />
      {/* <RecommendationTruck /> */}
    </EventContext.Provider>
  )
}

const EventHeader = () => {
  const { eventData } = useEvent()
  // console.log(eventData)

  return (
    <div className="relative w-full h-[300px]">
      {/* 배경 이미지 */}
      <img
        src={eventData?.eventImage}
        alt={eventData?.eventName}
        className="w-full h-full object-cover"
      />

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* 텍스트 & 탭 영역 */}
      <div className="absolute inset-0 flex flex-col justify-center items-center px-4 text-center">
        <h1
          className="text-4xl font-extrabold tracking-tight
          bg-gradient-to-r from-purple-200 via-orange-200 to-yellow-300
          bg-clip-text text-transparent"
        >
          {eventData?.eventName}
        </h1>

        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-inner sm:max-w-lg">
          <EventTabs />
        </div>
      </div>
    </div>
  )
}

const EventTabs = () => {
  const { eventId } = useParams()
  const matchVote = useMatch(`/event/${eventId}/votes/*`)
  const matchIntro = useMatch(`/event/${eventId}`)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("트럭 등록하시겠습니까?")
  const [modalType, setModalType] = useState("confirm") 

  const applyTruck = async (eventId) => {
  try {
    await axiosInstance.post('/applications', { eventId });
    setModalMessage("행사 참가 신청이 완료되었습니다.");
    setModalType("info"); 
  } catch (error) {
    console.error('참가 신청 실패:', error);
    setModalMessage("참가 신청에 실패했습니다.");
    setModalType("info"); 
  }
};

  const baseClasses =
    'px-8 py-3 rounded-lg font-medium transition-all duration-300 whitespace-nowrap cursor-pointer'
  const activeClasses = 'bg-white text-indigo-700 shadow-md'
  const inactiveClasses = 'text-white hover:bg-white/10'

  return (
    <>
      <div className="flex gap-2 ">
        <Link
          to={`/event/${eventId}`}
          className={`${baseClasses} ${matchIntro && !matchVote ? activeClasses : inactiveClasses}`}
        >
          <i className="fas fa-info-circle mr-1"></i>
          축제 소개
        </Link>

        <Link
          to={`/event/${eventId}/votes`}
          className={`${baseClasses} ${matchVote ? activeClasses : inactiveClasses}`}
        >
          <i className="fas fa-vote-yea mr-1 text-sm"></i>
          행사 투표
        </Link>

        <button
          onClick={() => setModalOpen(true)}
          className={`${baseClasses} ${inactiveClasses}`}
        >
          <i className="fas fa-truck mr-1"></i>
          트럭 등록
        </button>
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        message={modalMessage}
        onConfirm={() => {
          if (modalType === "confirm") {
            applyTruck(eventId)
          } else {
            setModalOpen(false)
            setModalMessage("트럭 등록하시겠습니까?") 
            setModalType("confirm")
          }
        }}
        onCancel={() => setModalOpen(false)}
        showCancel={modalType === "confirm"}
      />
    </>
  )
}

const EventFooter = () => {
  const { eventData } = useEvent()
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <h3 className="text-2xl font-bold">{eventData?.eventName}</h3>
            </div>
            <div className="flex space-x-5">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600"
              >
                <i className="fab fa-facebook-f text-xl">페이스북</i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600"
              >
                <i className="fab fa-twitter text-xl">인스타</i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors cursor-pointer w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600"
              >
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-3">
              주최/주관
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <i className="fas fa-building text-indigo-400 mr-3 w-6"></i>
                <span>{eventData?.eventHost}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6 border-b border-gray-700 pb-3">
              빠른 링크
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="."
                  className="text-gray-300 hover:text-white transition-colors flex items-center cursor-pointer"
                >
                  <i className="fas fa-chevron-right text-indigo-400 mr-3 text-sm"></i>
                  축제 소개
                </Link>
              </li>
              <li>
                <Link
                  to="votes"
                  className="text-gray-300 hover:text-white transition-colors flex items-center cursor-pointer"
                >
                  <i className="fas fa-chevron-right text-indigo-400 mr-3 text-sm"></i>
                  푸드트럭 투표
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors flex items-center cursor-pointer"
                >
                  <i className="fas fa-chevron-right text-indigo-400 mr-3 text-sm"></i>
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 7팀's 푸드트럭 플랫폼. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}

// const RecommendationTruck = () => {
//   const [isPopularVisible, setIsPopularVisible] = useState(true)
//   const { eventData, eventResult } = useEvent()
//   const navigate = useNavigate()

//   // eventData.trucks 와 eventResult (투표 결과)를 활용해서 인기 트럭 3개 추출
//   const popularTrucks = () => {
//     if (eventData?.trucks)
//       return eventData.trucks
//         .map((truck) => {
//           const voteInfo = eventResult?.find((v) => v.truckId === truck.truckId)
//           return {
//             ...truck,
//             voteCount: voteInfo ? voteInfo.voteCount : 0,
//           }
//         })
//         .sort((a, b) => {
//           if (b.voteCount !== a.voteCount) {
//             return b.voteCount - a.voteCount // 투표 수 내림차순
//           }
//           return a.truckName.localeCompare(b.truckName) // 투표 수 같으면 이름 오름차순
//         })
//         .slice(0, 3)
//   }

  // return (
  //   <div className="sticky-ads">
  //     <div className="ads-header">
  //       <h3 className="ads-title">✨ AD 맛난트럭 ✨</h3>
  //       <button
  //         className="ads-toggle-button"
  //         onClick={() => setIsPopularVisible((prev) => !prev)}
  //       >
  //         {isPopularVisible ? '최소화' : '펼치기'}
  //       </button>
  //     </div>

  //     {isPopularVisible && eventData?.trucks && (
  //       <div className="ads-truck-list">
  //         {popularTrucks().map((truck) => (
  //           <div key={truck.truckId} className="ads-truck-card">
  //             <img
  //               src={truck.menus[0]?.menuImage}
  //               alt="대표 메뉴"
  //               className="ads-truck-image"
  //             />
  //             <div className="ads-truck-info">
  //               <p className="ads-truck-name">{truck.truckName}</p>
  //               <button
  //                 onClick={() => navigate(`votes`)}
  //                 className="goto-vote-button"
  //               >
  //                 이 트럭 투표하러 가기
  //               </button>
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     )}
  //   </div>
  // )
// }
