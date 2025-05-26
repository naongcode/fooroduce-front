import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import '../style/ManageListPage.css'

const tabs = ["전체", "모집예정", "모집중", "모집마감", "투표중", "투표마감"];

function getEventStatus(today, rStart, rEnd, vStart, vEnd) {
  const t = new Date(today);
  const rs = new Date(rStart);
  const re = new Date(rEnd);
  const vs = new Date(vStart);
  const ve = new Date(vEnd);

  if (t < rs) return "모집예정";
  if (t >= rs && t <= re) return "모집중";
  if (t > re && t < vs) return "모집마감";
  if (t >= vs && t <= ve) return "투표중";
  if (t > ve) return "투표마감";
}

// console.log('allEvents',allEvents)

export default function ManageListPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedTab, setSelectedTab] = useState("전체");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const getTodayMidnight = () => {
    const today = new Date();
    return today.toISOString().split("T")[0] + "T00:00";
  };

  const initialFormData = {
    eventName: "",
    recruitStart: getTodayMidnight(),
    recruitEnd: getTodayMidnight(),
    voteStart: getTodayMidnight(),
    voteEnd: getTodayMidnight(),
    eventStart: getTodayMidnight(),
    eventEnd: getTodayMidnight(),
    location: "",
    eventHost: "",
    truckCount: "",
    description: "",
    eventImage: null,
  };

  //입력모달 
  const [formData, setFormData] = useState(initialFormData);
  
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "event_image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

function handleSubmit() {
  console.log("등록할 행사 데이터:", formData);
  setShowRegisterModal(false);
  setFormData(initialFormData); // 초기화
}

const handleCloseModal = () => {
  setShowRegisterModal(false);
  setFormData(initialFormData);
};

  // 행사정보 받아오기
  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const res = await axiosInstance.get("/events/list");
        setAllEvents(res.data);
        // console.log("✅ 받은 이벤트 목록", res.data);
      } catch (err) {
        console.error("❌ 이벤트 목록 조회 실패", err);
      }
    };

    fetchAllEvents();
  }, []);


  // 행사 상태 탭
  useEffect(() => {
    const now = new Date();

    if (!Array.isArray(allEvents)) {
     console.warn("🚨 allEvents는 배열이 아닙니다:", allEvents);
    return;
  }

    const filtered = allEvents.filter((event) => {
      const status = getEventStatus(
        now,
        event.recruitStart,
        event.recruitEnd,
        event.voteStart,
        event.voteEnd
      );
      return selectedTab === "전체" || status === selectedTab;
    });
    setFilteredEvents(filtered);
  }, [allEvents, selectedTab]);


  return (
    <div className="event-manager-container">
      <div className="event-manager-header">
        <div className="event-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${selectedTab === tab ? "active" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          className="register-button"
          onClick={() => setShowRegisterModal(true)}
        >
          + 행사 등록
        </button>
      </div>

      <div className="event-list">
        {filteredEvents.map((event) => (
          <div
            key={event.eventId}
            className="event-card"
            onClick={() => navigate(`/manager/${event.eventId}`)}
          >
            <h2 className="event-title">{event.eventName}</h2>
            <div className="event-period">
              <p>모집: {event.recruitStart} ~ {event.recruitEnd}</p>
              <p>투표: {event.voteStart} ~ {event.voteEnd}</p>
              <p>행사: {event.eventStart} ~ {event.eventEnd}</p>
            </div>
          </div>
        ))}
      </div>

      {showRegisterModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains("modal-backdrop")) {
              setShowRegisterModal(false);
            }}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close-button" onClick={handleCloseModal}>
                ×
              </button>
              <h2 className="modal-title">행사 등록</h2>

            <div className="form-row">
              <label>행사명:</label>
              <input type="text" name="event_name" onChange={handleChange} value={formData.eventName} />
            </div>

            <div className="form-row">
              <label>주최기관:</label>
              <input type="text" name="preferred_menu" onChange={handleChange} value={formData.eventHost} />
            </div>
            
            <div className="periods-container">
              <div className="period-item">
                <label>모집기간:</label>
                <div className="period-inputs">
                  <input type="datetime-local" name="recruit_start" onChange={handleChange} value={formData.recruitStart} />
                  <span>~</span>
                  <input type="datetime-local" name="recruit_end" onChange={handleChange} value={formData.recruitEnd} />
                </div>
              </div>
              <div className="period-item">
                <label>투표기간:</label>
                <div className="period-inputs">
                  <input type="datetime-local" name="vote_start" onChange={handleChange} value={formData.voteStart} />
                  <span>~</span>
                  <input type="datetime-local" name="vote_end" onChange={handleChange} value={formData.voteEnd} />
                </div>
              </div>
              <div className="period-item">
                <label>행사기간:</label>
                <div className="period-inputs">
                  <input type="datetime-local" name="event_start" onChange={handleChange} value={formData.eventStart} />
                  <span>~</span>
                  <input type="datetime-local" name="event_end" onChange={handleChange} value={formData.eventEnd} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>행사위치:</label>
              <input type="text" name="location" onChange={handleChange} value={formData.location} />
            </div>

            <div className="form-row">
              <label>모집트럭수:</label>
              <input type="number" name="truck_count" onChange={handleChange} value={formData.truckCount} />
            </div>

            <div className="form-row">
              <label>행사설명:</label>
              <textarea name="description" onChange={handleChange} value={formData.description} />
            </div>

            <div className="form-row">
              <label>사진업로드:</label>
              <input
                type="file" name="event_image"
                accept="image/*" onChange={handleChange}
              />
            </div>

            <div className="register-button-container">
              <button className="register-button">등록</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}