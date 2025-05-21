import { useParams } from "react-router-dom"
import useVote from "../api/useVote.js"
import useVotePageData from "../api/useVotePageData.js"
import VoteResultChart from '../components/Rechart.jsx'
import PyramidGrid2 from '../components/PyramidGrid2.jsx'
import '../style/VotePage.css'

export default function VotePage() {
  const { eventId } = useParams()

  // useVotePageData API 가져오기
  const { eventData, eventResult, votedTruckIds, setVotedTruckIds, fetchVoteResult } = useVotePageData(eventId);

  // useVote API 가져오기
  const { vote } = useVote(eventId);

  // 투표 후 새로고침
  const handleVote = async (truckId) => {
    await vote(truckId);
    setVotedTruckIds(prev => [...prev, truckId]);
    await fetchVoteResult();
  };

  // 컴포넌트에 전달할 이미지 모음
  const imageUrls = eventData?.trucks?.flatMap(truck =>
  truck.menus.map(menu => menu.menuImage)) || [];
  //  console.log('imageUrls',imageUrls)

  return (
    <div>
      <h3 className="vote-title">🔥 투표 진행중 !!! 🔥</h3>

      <div className="vote-wrapper">
        {/* 리차트 */}
        <div className="vote-chart-container">
          <VoteResultChart data={(eventResult || []).slice(0, 6)} userVotedName={"타코타코코"} />
        </div>

        {/* 피라미드 */}
        {/* <div><PyramidGrid2 images={imageUrls} /></div> */}
      </div>

      <hr className="event-divider"/>
      {/* 푸드트럭 리스트 */}
      <h3 className="truck-list-title">맛있는(?) 트럭에 "투표" 하세요</h3>
      <div className="truck-list">
        {eventData?.trucks?.map((truck) => {
            const isVoted = votedTruckIds.includes(truck.truckId);
            const truckData = truck;
            const menuData = truck.menus ?? [];
      
          return (
            <div key={truck.truckId} className="truck-card">
              <div className="truck-details">
                <div className="truck-summary">
                  <div className="truck-info">
                    <span className="truck-title">{truckData.truckName}</span>
                    <p className="truck-description">{truckData.description}</p>
                  </div>
                  <button
                    onClick={() => handleVote(truck.truckId)} 
                    className={`vote-button ${isVoted ? 'voted' : ''}`}
                    disabled={isVoted}> {isVoted ? '투표 완료' : '투표하기'}
                  </button>
                </div>
                <ol className="menu-list">
                  {menuData.map((menu, index) => (
                    <li key={index} className="menu-item">
                      <p>{menu.menuName}</p>
                      <p>({menu.menuPrice}원)</p>
                      <img src={menu.menuImage} alt="메뉴 사진" className="menu-image" />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )
        })}
      </div>



    </div>

  )
}
