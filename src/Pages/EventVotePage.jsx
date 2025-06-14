import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useRef, useState } from 'react'
import useVote from '../api/useVote.js'
import PodiumModal from '../components/PodiumModal.jsx'
import '../style/VotePage.css'
import truckImg from '../data/icon/truck.png'
import useOnClickOutside from '../hooks/useOnClickOutside.js'
import { useEvent } from './EventPage.jsx'
import Pagination from '../components/Pagination'
import axiosInstance from '../api/axiosInstance.js'
import { getTop3Trucks } from '../api/getTop3Trucks.js'

export default function EventVotePage() {
  const { eventId } = useParams()
  const {
    eventResult, votedTruckIds, setVotedTruckIds, fetchVoteResult,
  } = useEvent()

  const [showPodium, setShowPodium] = useState(false)
  const { vote } = useVote(eventId)

  const [activeCategory, setActiveCategory] = useState('전체')
  const [selectedTruck, setSelectTruck] = useState(null)
  const [showModal, setShowModal] = useState(false)

    const [eventData, setEventData] = useState(null);

  // --- 페이지네이션 관련 상태 추가 ---
  const [currentPage, setCurrentPage] = useState(1) // 현재 페이지
  const itemsPerPage = 3 // 한 페이지에 보여줄 트럭 수 (예시: 6개)

  const merged = eventData?.trucks.map(truckA => {
    const matched = eventResult.find(truckB => truckA.truckId === truckB.truckId);
    return matched ? { ...truckA, ...matched } : truckA;
  });

  // console.log(eventData, eventResult)

  const [topTrucks, setTopTrucks] = useState([])
  useEffect(() => {
    const fetchTopTrucks = async () => {
      try {
        const data = await getTop3Trucks(eventId)
        setTopTrucks(data)
      } catch (err) {
        console.error('Top 3 트럭 정보를 불러오는 중 오류 발생:', err)
      }
    }
    console.log('topTrucks',topTrucks)
    fetchTopTrucks()
  }, [eventId])

  const sorted = [...(merged || [])].sort((a, b) => b.voteCount - a.voteCount)
  // console.log('sort', sorted)

  // 카테고리 변경 시 현재 페이지를 1로 초기화 (선택 사항)
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // 행사정보 가져오기
  useEffect(() => {
    const fetchEventData = async () => {
      try {
      // const encodedCategory = encodeURIComponent(activeCategory);
      const res = await axiosInstance.get(`/events/${eventId}?page=${currentPage-1}&size=3&menuType=${activeCategory}`);
        setEventData(res.data);
        console.log('eventData',res.data)
      } catch (err) {
        console.error("이벤트 상세 조회 실패", err);
      }
    };
    fetchEventData();
  }, [eventId, currentPage, activeCategory]);

  
  const handleVote = async (truckId) => {
    await vote(truckId)
    setVotedTruckIds((prev) => [...prev, truckId])
    setShowModal(true)
    setTimeout(() => {
      setShowModal(false)
    }, [2000])
    await fetchVoteResult()
  }

  const showMenuDetail = (truck) => {
    console.log('selected truck:', truck)
    setSelectTruck(truck)
  }

  // console.log(eventResult)

  const allCategories = [
    '전체','한식','양식','일식','멕시칸','분식','디저트','기타',
  ]

  // 투표결과 합치기 
  const filteredTrucks = (eventData?.trucks || []).map(truck => {
    const match = eventResult.find(result => result.truckId === truck.truckId);
    return {
      ...truck,
      voteCount: match?.voteCount || 0,
    };
  });

  // --- 페이지네이션 로직 추가 ---
  const totalPages = eventData?.totalPages || 0

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // 페이지 변경 시 스크롤을 맨 위로 올리는 것이 일반적입니다.
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // console.log('filteredTrucks',filteredTrucks)

  return (
    <div>
      <div className="vote-wrapper">
        {sorted.length > 0 && (
          <RankedTruck
            eventData={eventData}
            selectedTruck={selectedTruck}
            showMenuDetail={showMenuDetail}
            sorted={topTrucks}
          />
        )}
        <hr className="event-divider" />
      </div>
      {/* vote animation */}



      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold mb-4 text-indigo-800 tracking-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          푸드트럭
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          페스티벌에서 만나고 싶은 푸드트럭에 투표해 주세요!
        </p>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-8 py-3 rounded-full text-base font-medium transition-all duration-300 shadow-sm whitespace-nowrap cursor-pointer ${
              activeCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white transform scale-105'
                : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {filteredTrucks.length == 0 && <TruckNotFound />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTrucks.map((truck) => { // 수정된 부분
          const isVoted = votedTruckIds.includes(truck.truckId)
          return (
            <TruckCard
              handleVote={handleVote}
              isVoted={isVoted}
              truck={truck}
              key={truck.truckId} // key prop 추가 (React 리스트 렌더링에 필요)
            />
          )
        })}
      </div>

      {/* --- Pagination 컴포넌트 추가 --- */}
      {filteredTrucks.length > 0 && ( // 트럭이 있을 때만 페이지네이션 표시
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      {/* --- Pagination 컴포넌트 추가 끝 --- */}

      {/* 메뉴 상세 모달 */}
      {selectedTruck && (
        <MenuDetail
          handleVote={handleVote}
          selectedTruck={selectedTruck}
          votedTruckIds={votedTruckIds}
          setSelectTruck={setSelectTruck}
        />
      )}
      {/* 투표 성공 모달 */}
      {showModal && <VoteAfterModal />}

      <VoteRanking
      setShowPodium={setShowPodium}
      showPodium={showPodium}
      sorted={topTrucks}
      />
    </div>
  )
}

const TruckNotFound = () => {
  return (
    <div className="h-[400px] flex justify-center items-center">
      <div className="relative w-[300px] h-24 flex flex-col gap-3">
        <img
          src={truckImg}
          className="animate-[truckMove_2s_linear_forwards] w-[100px]"
        />
        <h2 className="text-2xl">트럭을 찾을 수 없습니다</h2>
      </div>
    </div>
  )
}
const TruckCard = ({ truck, handleVote, isVoted }) => {
  const [expandedMenus, setExpandedMenus] = useState([])
  const toggleMenu = (truckId) => {
    if (expandedMenus.includes(truckId)) {
      setExpandedMenus(expandedMenus.filter((id) => id !== truckId))
    } else {
      setExpandedMenus([...expandedMenus, truckId])
    }
  }
  
  return (
    <div
      key={truck.truckId}
      className="bg-white rounded-2xl overflow-hidden 
  shadow-lg hover:shadow-xl transition-all duration-300 
  transform hover:-translate-y-2 border border-indigo-50 flex flex-col"
    >
      <div className="h-56 overflow-hidden relative group">
        <img
          src={truck?.menus[1]?.menuImage}
          alt={truck?.truckName + ' 이미지'}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white">
            <p className="font-medium">{truck?.description}</p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-indigo-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {truck?.menus[1]?.menuType ?? '기타'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          {truck.truckName}
        </h3>

        <div className="mb-6">
          <button
            onClick={() => toggleMenu(truck.truckId)}
            className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 px-4 py-3 rounded-xl text-left transition-all duration-300 flex justify-between items-center"
          >
            <span className="font-semibold text-gray-700 flex items-center">
              <i className="fas fa-utensils text-indigo-500 mr-2"></i>
              메뉴 보기
            </span>
            <i
              className={`fas fa-chevron-down text-indigo-500 transition-transform duration-300 ${
                expandedMenus.includes(truck.truckId) ? 'rotate-180' : ''
              }`}
            ></i>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              expandedMenus.includes(truck.truckId)
                ? 'max-h-[500px] mt-4'
                : 'max-h-0'
            }`}
          >
            <div className="grid grid-cols-1 gap-4">
              {truck.menus?.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-lg shadow-sm border border-indigo-50 
              hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-lg overflow-hidden mr-4">
                      <img
                        src={item.menuImage}
                        alt={'메뉴 이미지'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">
                        {item.menuName}
                      </h4>
                      <p className="text-indigo-600 font-medium">
                        {item.menuPrice}
                      </p>
                      <p className="text-gray-500 text-sm line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full">
            <span className="font-bold text-lg">{truck.voteCount}</span>
            <span className="text-sm ml-1">투표</span>
          </div>
          <button
            onClick={() => handleVote(truck.truckId)}
            className={`px-5 py-2.5 rounded-lg transition-all duration-300 font-medium whitespace-nowrap cursor-pointer ${
              isVoted
                ? 'bg-gray-200 text-gray-600'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
            }`}
            disabled={isVoted}
          >
            {isVoted ? (
              <>
                <i className="fas fa-check-circle mr-2"></i>투표 완료
              </>
            ) : (
              <>
                <i className="fas fa-vote-yea mr-2"></i>투표하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

const RankedTruck = ({ showMenuDetail, sorted, selectedTruck }) => {
  // console.log('ranked', sorted)
  return (
    <div>
      <div className="text-center mb-16">
        <h2 className="text-4xl font-extrabold mb-4 text-indigo-800 tracking-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          인기
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sorted.slice(0, 3).map((truck, index) => (
          <RankedTruckCard
            truck={truck}
            index={index}
            key={index}
            selectedTruck={selectedTruck}
            showMenuDetail={showMenuDetail}
          />
        ))}
      </div>
    </div>
  )
}

const RankedTruckCard = ({ truck, index, selectedTruck, showMenuDetail }) => {
  // console.log('card', truck)
  return (
    <div
      key={truck?.truckId}
      className={`bg-white rounded-2xl overflow-hidden shadow-xl border-2 ${
        index === 0
          ? 'border-yellow-400  z-10'
          : index === 1
            ? 'border-gray-300'
            : index === 2
              ? 'border-amber-600'
              : 'border-blue-700'
      }`}
    >
      <div className="relative">
        <img
          src={truck?.menuImage ?? truck?.menus[1]?.menuImage}
          alt={'트럭 이미지'}
          className="w-full h-56 object-cover object-top"
        />
        <div
          className={`absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
            index === 0
              ? 'bg-yellow-500'
              : index === 1
                ? 'bg-gray-400'
                : index === 2
                  ? 'bg-amber-700'
                  : 'bg-blue-700'
          }`}
        >
          {index + 1}
        </div>

        {index <= 2 && (
          <div>
            <div
              className={`absolute top-0 right-0 w-0 h-0 border-t-[80px] ${
                index === 0
                  ? 'border-t-yellow-500'
                  : index === 1
                    ? 'border-t-gray-400'
                    : 'border-t-amber-700'
              } border-l-[80px] border-l-transparent`}
            ></div>
            <div className="absolute top-3 right-3 text-white font-bold transform rotate-45">
              TOP
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-3">
          {truck?.truckName}
        </h4>
        <div className="flex justify-between items-center">
          <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
            {truck?.menus[1].menuType ?? '한식'}
          </span>
          <span
            className={`font-bold text-lg ${
              index === 0
                ? 'text-yellow-500'
                : index === 1
                  ? 'text-gray-400'
                  : index === 2
                    ? 'text-amber-700'
                    : 'text-blue-700'
            }`}
          >
            {truck?.voteCount} 투표
          </span>
        </div>

        {/* 메뉴 미리보기 추가 */}
        <div className="mt-4 pt-4 border-t border-indigo-50">
          <div className="flex overflow-x-auto pb-2 space-x-3">
            {selectedTruck?.menus?.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-20">
                <div className="w-20 h-20 rounded-lg overflow-hidden mb-1">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-center font-medium text-gray-700 truncate">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            showMenuDetail(truck)
          }}
          className="w-full mt-4 py-2 bg-gradient-to-r from-indigo-50
       to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-lg text-indigo-700 font-medium flex items-center justify-center cursor-pointer"
        >
          <i className="fas fa-utensils mr-2"></i>
          메뉴 자세히 보기
        </button>
      </div>
    </div>
  )
}

const VoteRanking = ({ showPodium, setShowPodium, sorted }) => {
  return (
    <div className="text-center mb-16 mt-16 ">
        <h2 className="text-4xl font-extrabold mb-4 text-indigo-800 tracking-tight inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">  
      이벤트 투표 결과</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6 rounded-full"></div>

      <div className="arrow-group">
        <div className="arrow">↘ </div>
        <div className="arrow">↓ </div>
        <div className="arrow"> ↙</div>
      </div>
      <div className="result-btn-container">
        <button onClick={() => setShowPodium(true)} className="result-btn">
          현재 1위는 <span className="question-mark">?</span>
        </button>
      </div>
      {showPodium && (
        <PodiumModal results={sorted} onClose={() => setShowPodium(false)} />
      )}
    </div>
  )
}

const VoteAfterModal = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-sm px-8 py-6 rounded-xl shadow-lg border-2 border-indigo-500 transform transition-all duration-300 animate-bounce">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-check-circle text-indigo-600 text-3xl"></i>
          </div>
          <h3 className="text-xl font-bold text-indigo-800 mb-2">투표 완료!</h3>
          <p className="text-gray-600">소중한 의견 감사합니다.</p>
        </div>
      </div>
    </div>
  )
}

const MenuDetail = ({
  selectedTruck,
  setSelectTruck,
  votedTruckIds,
  handleVote,
}) => {
  const ref = useRef()
  useOnClickOutside(ref, () => {
    setSelectTruck(null)
  })
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        ref={ref}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-indigo-800">
              {selectedTruck.truckName}
            </h3>
            <button
              onClick={() => setSelectTruck(null)}
              className="text-gray-500 hover:text-gray-700 text-2xl 
              cursor-pointer"
            >
              <i className="fas fa-times">X</i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={selectedTruck.menus[0].menuImage}
                alt={selectedTruck.name}
                className="w-full h-64 object-cover object-top rounded-xl"
              />
              <div className="mt-4">
                <p className="text-gray-600 mb-4">
                  {selectedTruck.description}
                </p>
                <div className="flex items-center">
                  <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedTruck.category ?? '한식'}
                  </span>
                  <span className="ml-4 text-indigo-600 font-medium">
                    <i className="fas fa-thumbs-up mr-1"></i>{' '}
                    {selectedTruck.voteCount} 투표
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-utensils text-indigo-600 mr-2"></i>
                대표 메뉴
              </h4>
              <div className="space-y-6">
                {selectedTruck.menus.map((menu, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl shadow-md border border-indigo-100"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 mb-4 md:mb-0">
                        <img
                          src={menu.menuImage}
                          alt={'이미지'}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                      <div className="md:w-2/3 md:pl-6">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-xl font-bold text-gray-800">
                            {menu.menuName}
                          </h5>
                          <span className="text-indigo-700 font-bold">
                            {menu.menuPrice}원
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4">{menu.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <i className="fas fa-fire text-red-500 mr-1"></i>
                          <span>인기 메뉴</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    setSelectTruck(null)
                    if (!votedTruckIds.includes(selectedTruck.truckId)) {
                      handleVote(selectedTruck.truckId)
                    }
                  }}
                  className={`px-6 py-3 rounded-lg transition-all duration-300 font-medium whitespace-nowrap !rounded-button cursor-pointer ${
                    votedTruckIds.includes(selectedTruck.truckId)
                      ? 'bg-gray-200 text-gray-600'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                  }`}
                  disabled={votedTruckIds.includes(selectedTruck.truckId)}
                >
                  {votedTruckIds.includes(selectedTruck.truckId) ? (
                    <>
                      <i className="fas fa-check-circle mr-2"></i>투표 완료
                    </>
                  ) : (
                    <>
                      <i className="fas fa-vote-yea mr-2"></i>투표하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
