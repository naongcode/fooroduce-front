import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import useAuthStore from "../api/useAuthStore";
import '../style/ManageListPage.css';

const tabs = ["전체", "모집예정", "모집중", "모집마감", "투표중", "투표마감"];

function generateUUID() {
  return crypto.randomUUID();
}

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

export default function ManageListPage() {
  const [allEvents, setAllEvents] = useState([]);
  const [selectedTab, setSelectedTab] = useState("전체");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [editTargetEvent, setEditTargetEvent] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuthStore();

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

  const [formData, setFormData] = useState(initialFormData);

  // 입력값 받기
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "eventImage") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 행사등록
  const handleSubmit = async () => {
    try {
      if (!token) throw new Error("토큰이 없습니다. 로그인이 필요합니다.");

      let imageUrl = null;

      if (formData.eventImage instanceof File) {
        const uuid = generateUUID();
        const uniqueName = `${uuid}-${formData.eventImage.name}`;
        const { data } = await axiosInstance.post("/events/presigned-url", {
          filename: uniqueName,
        });

        await fetch(data.uploadURL, {
          method: "PUT",
          headers: {"Cache-Control": "public, max-age=31536000, immutable",
          },
          body: formData.eventImage,
        });

        const bucket = "naong2-s3";
        const region = "ap-northeast-2";
        imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/image/${data.filePath}`;
      }

      const payload = {
        ...formData,
        truckCount: Number(formData.truckCount),
        eventImage: imageUrl || (editTargetEvent?.eventImage ?? null),
      };

      if (editTargetEvent) {
        // 수정
        await axiosInstance.patch(`/events/${editTargetEvent.eventId}/update`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // 신규 등록
        await axiosInstance.post("/events/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowRegisterModal(false);
      setFormData(initialFormData);
      setEditTargetEvent(null);
      fetchAllEvents(); // 등록/수정 후 목록 갱신
    } catch (err) {
      console.error("행사 등록/수정 실패:", err);
    }
  };

  // 행사 수정
  const handleEdit = (event) => {
    setEditTargetEvent(event);
    setFormData({
      ...event,
      truckCount: event.truckCount.toString(),
      eventImage: null,
    });
    setShowRegisterModal(true);
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    setFormData(initialFormData);
    setEditTargetEvent(null);
  };

  // 이벤트 목록 가져오기
  const fetchAllEvents = async () => {
    try {
      const res = await axiosInstance.get("/events/list");
      setAllEvents(res.data);
    } catch (err) {
      console.error("❌ 이벤트 목록 조회 실패", err);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // 날짜로 필터하기
  useEffect(() => {
    const now = new Date();
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
          onClick={() => {
            setShowRegisterModal(true);
            setEditTargetEvent(null);
            setFormData(initialFormData);
          }}
        >
          + 행사 등록
        </button>
      </div>

      <div className="event-list">
        {filteredEvents.map((event) => (
          <div key={event.eventId} className="event-card">
            <div onClick={() => navigate(`/manager/${event.eventId}`)}>
              <h2 className="event-title">{event.eventName}</h2>
              <div className="event-period">
                <p>모집: {event.recruitStart} ~ {event.recruitEnd}</p>
                <p>투표: {event.voteStart} ~ {event.voteEnd}</p>
                <p>행사: {event.eventStart} ~ {event.eventEnd}</p>
              </div>
            </div>
            <button className="edit-button" onClick={() => handleEdit(event)}>수정</button>
          </div>
        ))}
      </div>

      {showRegisterModal && (
        <div className="modal-backdrop" onClick={(e) => {
          if (e.target.classList.contains("modal-backdrop")) handleCloseModal();
        }}>
          <div className="modal-content-manage" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-button" onClick={handleCloseModal}>×</button>
            <h2 className="modal-title">{editTargetEvent ? "행사 수정" : "행사 등록"}</h2>

            <div className="form-row">
              <label>행사명:</label>
              <input type="text" name="eventName" onChange={handleChange} value={formData.eventName} />
            </div>

            <div className="form-row">
              <label>주최기관:</label>
              <input type="text" name="eventHost" onChange={handleChange} value={formData.eventHost} />
            </div>

            <div className="periods-container">
              {["recruit", "vote", "event"].map((period) => (
                <div key={period} className="period-item">
                  <label>{period === "recruit" ? "모집" : period === "vote" ? "투표" : "행사"}기간:</label>
                  <div className="period-inputs">
                    <input type="datetime-local" name={`${period}Start`} onChange={handleChange} value={formData[`${period}Start`]} />
                    <span>~</span>
                    <input type="datetime-local" name={`${period}End`} onChange={handleChange} value={formData[`${period}End`]} />
                  </div>
                </div>
              ))}
            </div>

            <div className="form-row">
              <label>행사위치:</label>
              <input type="text" name="location" onChange={handleChange} value={formData.location} />
            </div>

            <div className="form-row">
              <label>모집트럭수:</label>
              <input type="number" name="truckCount" onChange={handleChange} value={formData.truckCount} />
            </div>

            <div className="form-row">
              <label>행사설명:</label>
              <textarea name="description" onChange={handleChange} value={formData.description} />
            </div>

            <div className="form-row">
              <label>사진업로드:</label>
              <input type="file" name="eventImage" accept="image/*" onChange={handleChange} />
            </div>

            <div className="register-button-container">
              <button className="register-button" onClick={handleSubmit}>
                {editTargetEvent ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
