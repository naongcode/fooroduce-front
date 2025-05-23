import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/ManageDetailPage.css";
import axiosInstance from '../api/axiosInstance.js'
import useVotePageData from "../api/useVotePageData.js"

export default function ManageDetailPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [eventData, setEventData] = useState(null);
    const { eventResult, fetchVoteResult } = useVotePageData(eventId);

  // console.log('eventId',eventId)
  

  // 행사 정보
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

  // 투표 결과
  useEffect(() => {
      fetchVoteResult();
  }, [eventId])

  // console.log('eventData',eventData)
  // console.log('eventResult',eventResult)


//   const handleDecision = (id, decision) => {
//     setTrucks(prev =>
//       prev.map(truck =>
//         truck.id === id ? { ...truck, status: decision } : truck
//       )
//     );
//   };

//   console.log('eventData',eventData)

  if (!eventData) return <div>로딩중...</div>;

  // 카멜로 변경필요
  return (
    <div className="event-detail-container">
      <div className="event-detail-inner">
        <div className="event-image-wrapper">
          <img src={eventData?.eventImage} alt="행사 이미지" className="event-image" />
        </div>
        <div className="manage-event-info">
          <h1>{eventData.eventName}</h1>
          <p><strong>주최:</strong> {eventData.eventHost}</p>
          <p><strong>설명:</strong> {eventData.description}</p>
          <p><strong>위치:</strong> {eventData.location}</p>
          <p><strong>모집:</strong> {eventData.recruitStart} ~ {eventData.recruitEnd}</p>
          <p><strong>투표:</strong> {eventData.voteStart} ~ {eventData.voteEnd}</p>
          <p><strong>행사:</strong> {eventData.eventStart} ~ {eventData.eventEnd}</p>
          <p><strong>트럭 수:</strong> {eventData.truckCount}대</p>
        </div>
      </div>

    {/* 참여업체 */}
    <hr/>

    <div>
      <h2>참여 신청 푸드트럭</h2>
      <table>
        <thead>
          <tr>
            <th>참여업체</th>
            <th>메뉴</th>
            <th>연락처</th>
            <th>설명</th>
            <th>득표수</th>
            <th>최종확정</th>
          </tr>
        </thead>
        <tbody>
          {eventData.trucks.map(truck => {
            const matchingResult = eventResult.find(result => result.truckId === truck.truckId);
            const voteCount = matchingResult ? matchingResult.voteCount : 0;

            return (
            <tr key={truck.truckId}>
              <td>{truck.truckName}</td>
              <td style={{ minWidth: '150px'}}>
                <div className="manage-menu-list">
                  {truck.menus?.map((menu, idx) => (
                    <div key={idx} className="manage-menu-item">
                        <div>{menu.menuName}</div>
                        <img src={menu.menuImage} alt={menu.menuName} 
                        className="manage-menu-image"/>
                        <div>{menu.menuPrice}원</div>
                    </div>
                  ))}
                </div>
              </td>
              <td style={{ minWidth: '150px'}}>{truck.phoneNumber}</td>
              <td style={{ maxWidth: '150px'}}>{truck.description}</td>
              <td>{voteCount}표</td>
              <td>
                {truck.status === "pending" ? (
                  <>
                    <button
                      onClick={() => handleDecision(truck.id, "approved")}
                      className="accept-btn"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => handleDecision(truck.id, "rejected")}
                      className="reject-btn"
                    >
                      거절
                    </button>
                  </>
                ) : (
                  <span className={truck.status === "approved" ? "status-approved" : "status-rejected"}>
                    {truck.status === "approved" ? "✅ 수락됨" : "❌ 거절됨"}
                  </span>
                )}
              </td>
            </tr>
            )
          })}
        </tbody>
      </table>
    </div>

    
    </div>
  );
}