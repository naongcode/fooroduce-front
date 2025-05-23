import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import eventData from "../data/eventData.json";
import '../style/EventManagerPage.css'

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

console.log('eventData',eventData)

export default function EventManagerPage() {
  const [allEvents, setAllEvents] = useState(eventData);
  const [selectedTab, setSelectedTab] = useState("전체");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();

  const getTodayMidnight = () => {
    const today = new Date();
    return today.toISOString().split("T")[0] + "T00:00";
  };

  const initialFormData = {
    event_name: "",
    recruit_start: getTodayMidnight(),
    recruit_end: getTodayMidnight(),
    vote_start: getTodayMidnight(),
    vote_end: getTodayMidnight(),
    event_start: getTodayMidnight(),
    event_end: getTodayMidnight(),
    event_location: "",
    preferred_menu: "",
    truck_count: "",
    event_description: "",
    event_image: null,
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

  // useEffect(() => {
  //   const token = localStorage.getItem("jwt_token");
  //   axios
  //     .get("/events/list", {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => setAllEvents(res.data));
  // }, []);

  // 카멜로 바꿔야됨
  useEffect(() => {
    const now = new Date();
    const filtered = allEvents.filter((event) => {
      const status = getEventStatus(
        now,
        event.recruit_start,
        event.recruit_end,
        event.vote_start,
        event.vote_end
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
            key={event.event_id}
            className="event-card"
            onClick={() => navigate(`/events/${event.event_id}`)}
          >
            <h2 className="event-title">{event.event_name}</h2>
            <div className="event-period">
              <p>모집: {event.recruit_start} ~ {event.recruit_end}</p>
              <p>투표: {event.vote_start} ~ {event.vote_end}</p>
              <p>행사: {event.event_start} ~ {event.event_end}</p>
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
              <input type="text" name="event_name" onChange={handleChange} value={formData.event_name} />
            </div>

            <div className="periods-container">
              <div className="period-item">
                <label>모집기간:</label>
                <div className="period-inputs">
                  <input type="datetime-local" name="recruit_start" onChange={handleChange} value={formData.recruit_start} />
                  <span>~</span>
                  <input type="datetime-local" name="recruit_end" onChange={handleChange} value={formData.recruit_end} />
                </div>
              </div>
              <div className="period-item">
                <label>투표기간:</label>
                <div className="period-inputs">
                  <input type="datetime-local" name="vote_start" onChange={handleChange} value={formData.vote_start} />
                  <span>~</span>
                  <input type="datetime-local" name="vote_end" onChange={handleChange} value={formData.vote_end} />
                </div>
              </div>
              <div className="period-item">
                <label>행사기간:</label>
                <div className="period-inputs">
                  <input type="datetime-local" name="event_start" onChange={handleChange} value={formData.event_start} />
                  <span>~</span>
                  <input type="datetime-local" name="event_end" onChange={handleChange} value={formData.event_end} />
                </div>
              </div>
            </div>

            <div className="form-row">
              <label>행사위치:</label>
              <input type="text" name="location" onChange={handleChange} value={formData.location} />
            </div>

            <div className="form-row">
              <label>선호메뉴:</label>
              <input type="text" name="preferred_menu" onChange={handleChange} value={formData.preferred_menu} />
            </div>

            <div className="form-row">
              <label>모집트럭수:</label>
              <input type="number" name="truck_count" onChange={handleChange} value={formData.truck_count} />
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