import { useParams } from 'react-router-dom'
import { useState } from 'react'
import useVote from '../api/useVote.js'
import '../style/VotePage.css'
import { useEvent } from './EventPage.jsx'

import {
  RankedTruck,
  MenuDetail,
  TruckCard,
  TruckNotFound,
  VoteAfterModal,
} from '../components/index.jsx'

export default function EventVotePage() {
  const { eventId } = useParams()
  const {
    eventData,
    eventResult,
    votedTruckIds,
    setVotedTruckIds,
    fetchVoteResult,
  } = useEvent()
  const { vote } = useVote(eventId)

  const [activeCategory, setActiveCategory] = useState('전체')

  const [selectedTruck, setSelectTruck] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const merged = eventData?.trucks.map((truckA) => {
    const matched = eventResult.find(
      (truckB) => truckA.truckId === truckB.truckId,
    )
    return matched ? { ...truckA, ...matched } : truckA
  })

  console.log(eventData, eventResult)

  const sorted = [...(merged || [])].sort((a, b) => b.voteCount - a.voteCount)
  console.log('sort', sorted)

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
    setSelectTruck(truck)
  }

  console.log(eventResult)

  const allCategories = [
    '전체',
    '한식',
    '양식',
    '일식',
    '멕시칸',
    '분식',
    '디저트',
    '기타',
  ]

  const filteredTrucks =
    activeCategory === '전체'
      ? merged || []
      : merged?.filter((truck) => truck?.category === activeCategory)

  return (
    <div>
      <div className="vote-wrapper">
        {sorted.length > 0 && (
          <RankedTruck
            eventData={eventData}
            selectedTruck={selectedTruck}
            showMenuDetail={showMenuDetail}
            sorted={sorted}
          />
        )}
        <hr className="event-divider" />
      </div>

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
        {filteredTrucks.map((truck) => {
          const isVoted = votedTruckIds.includes(truck.truckId)
          return (
            <TruckCard
              handleVote={handleVote}
              isVoted={isVoted}
              truck={truck}
            />
          )
        })}
      </div>
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
    </div>
  )
}
