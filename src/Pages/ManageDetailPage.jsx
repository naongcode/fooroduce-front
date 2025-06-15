import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../style/ManageDetailPage.css";
import axiosInstance from '../api/axiosInstance.js';
import useVotePageData from "../api/useVotePageData.js";
import MessageModal from "../components/MessageModal"; 

export default function ManageDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const { eventResult, fetchVoteResult } = useVotePageData(eventId);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showEmailSentModal, setShowEmailSentModal] = useState(false);

  const handleCancelEvent = async () => {
    try {
      await axiosInstance.patch(`/events/${eventId}/cancel`);
      setIsCancelled(true);
    } catch (error) {
      console.error("행사 취소 실패", error);
      alert("행사 취소에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axiosInstance.get(`/events/${eventId}`);
        setEventData(res.data);
        setIsCancelled(res.data.isCancelled);
      } catch (err) {
        console.error("이벤트 상세 조회 실패", err);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    fetchVoteResult();
  }, [eventId]);

  const handleDecision = async (applicationId, decision) => {
    try {
      await axiosInstance.patch(`/applications/${eventId}`, [{
        applicationId,
        status: decision === "approved" ? "ACCEPTED" : "REJECTED",
      }]);

      setEventData((prevData) => ({
        ...prevData,
        trucks: prevData.trucks.map(truck =>
          truck.applicationId === applicationId
            ? { ...truck, status: decision === "approved" ? "ACCEPTED" : "REJECTED" }
            : truck
        )
      }));

      setShowEmailSentModal(true);
    } catch (error) {
      console.error("결정 처리 실패:", error);
      alert("푸드트럭 상태 변경에 실패했습니다.");
    }
  };

  if (!eventData) return <div>로딩중...</div>;

  return (
    <div className="event-detail-container">
      {isCancelled && (
        <div className="cancel-overlay">
          <div className="cancel-message">이 행사는 취소 되었습니다.</div>
        </div>
      )}
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
          {!isCancelled && (
            <button className="cancel-event-btn" onClick={handleCancelEvent}>
              행사 취소
            </button>
          )}
        </div>
      </div>

      <hr />

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
                  <td style={{ minWidth: '150px' }}>
                    <div className="manage-menu-list">
                      {truck.menus?.map((menu, idx) => (
                        <div key={idx} className="manage-menu-item w-[32%]">
                          <div>{menu.menuName}</div>
                          <img src={menu.menuImage} alt={menu.menuName} className="manage-menu-image" />
                          <div>{menu.menuPrice}원</div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td style={{ minWidth: '150px' }}>{truck.phoneNumber}</td>
                  <td style={{ maxWidth: '150px' }}>{truck.description}</td>
                  <td>{voteCount}표</td>
                  <td>
                    {truck.status?.toLowerCase() === "pending" ? (
                      <>
                        <button onClick={() => handleDecision(truck.applicationId, "approved")} className="accept-btn">수락</button>
                        <button onClick={() => handleDecision(truck.applicationId, "rejected")} className="reject-btn">거절</button>
                      </>
                    ) : (
                      <span className={truck.status === "ACCEPTED" ? "status-approved" : "status-rejected"}>
                        {truck.status === "ACCEPTED" ? "✅ 수락됨" : "❌ 거절됨"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      
      <MessageModal
        isOpen={showEmailSentModal}
        message="이메일을 발송했습니다."
        onClose={() => setShowEmailSentModal(false)}
      />
    </div>
  );
}
