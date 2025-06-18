import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import useAuthStore from "../api/useAuthStore";
import '../style/ManageListPage.css';

const tabs = ["전체", "투표중", "투표마감"];

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
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}T00:00`;
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
  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "eventImage") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      if (files && files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      } else {
        setPreviewImage(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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
          headers: {
            "Content-Type": formData.eventImage.type,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
          body: formData.eventImage,
        });

        const bucket = "naong2-s3";
        const region = "ap-northeast-2";
        imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/image/${data.filePath}`;
      } else if (editTargetEvent && typeof editTargetEvent.eventImage === 'string') {
        imageUrl = editTargetEvent.eventImage;
      }

      const payload = {
        ...formData,
        truckCount: Number(formData.truckCount),
        eventImage: imageUrl,
      };

      if (editTargetEvent) {
        await axiosInstance.patch(`/events/${editTargetEvent.eventId}/update`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axiosInstance.post("/events/create", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setShowRegisterModal(false);
      setFormData(initialFormData);
      setEditTargetEvent(null);
      setPreviewImage(null);
      fetchAllEvents();
    } catch (err) {
      console.error("행사 등록/수정 실패:", err);
      alert("행사 정보를 저장하는 데 실패했습니다.");
    }
  };

  const handleEdit = (event) => {
    setEditTargetEvent(event);
    setFormData({
      ...event,
      recruitStart: event.recruitStart ? new Date(event.recruitStart).toISOString().slice(0, 16) : getTodayMidnight(),
      recruitEnd: event.recruitEnd ? new Date(event.recruitEnd).toISOString().slice(0, 16) : getTodayMidnight(),
      voteStart: event.voteStart ? new Date(event.voteStart).toISOString().slice(0, 16) : getTodayMidnight(),
      voteEnd: event.voteEnd ? new Date(event.voteEnd).toISOString().slice(0, 16) : getTodayMidnight(),
      eventStart: event.eventStart ? new Date(event.eventStart).toISOString().slice(0, 16) : getTodayMidnight(),
      eventEnd: event.eventEnd ? new Date(event.eventEnd).toISOString().slice(0, 16) : getTodayMidnight(),
      truckCount: event.truckCount.toString(),
      eventImage: null,
    });
    if (event.eventImage && typeof event.eventImage === 'string') {
      setPreviewImage(event.eventImage);
    } else {
      setPreviewImage(null);
    }
    setShowRegisterModal(true);
  };

  const handleCloseModal = () => {
    setShowRegisterModal(false);
    setFormData(initialFormData);
    setEditTargetEvent(null);
    setPreviewImage(null);
  };

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
            setPreviewImage(null);
          }}
        >
          + 행사 등록
        </button>
      </div>

      <div className="event-list">
        {filteredEvents.map((event) => (
          <div key={event.eventId} className="event-card">
            <div onClick={() => navigate(`/manager/${event.eventId}`)} className="event-card-content">
              <h2 className="event-title">{event.eventName}</h2>
              <div className="event-period">
                <p>모집: {event.recruitStart} ~ {event.recruitEnd}</p>
                <p>투표: {event.voteStart} ~ {event.voteEnd}</p>
                <p>행사: {event.eventStart} ~ {event.eventEnd}</p>
              </div>
            </div>
            <div className="edit-button-container">
                <button className="edit-button" onClick={() => handleEdit(event)}>수정</button>
            </div>
          </div>
        ))}
      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl overflow-hidden shadow-xl z-10 p-6 relative w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl font-bold"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{editTargetEvent ? "행사 수정" : "행사 등록"}</h2>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col space-y-4">

              <div className="form-row flex flex-col">
                <label className="text-gray-700 text-sm font-bold mb-1">행사명:</label>
                <input
                  type="text"
                  name="eventName"
                  onChange={handleChange}
                  value={formData.eventName}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="form-row flex flex-col">
                <label className="text-gray-700 text-sm font-bold mb-1">주최기관:</label>
                <input
                  type="text"
                  name="eventHost"
                  onChange={handleChange}
                  value={formData.eventHost}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="periods-container flex flex-col space-y-4">
                {["recruit", "vote", "event"].map((period) => (
                  <div key={period} className="period-item flex flex-col">
                    <label className="text-gray-700 text-sm font-bold mb-1">
                      {period === "recruit" ? "모집" : period === "vote" ? "투표" : "행사"}기간:
                    </label>
                    <div className="period-inputs flex space-x-2">
                      <input
                        type="datetime-local"
                        name={`${period}Start`}
                        onChange={handleChange}
                        value={formData[`${period}Start`]}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 flex-1"
                      />
                      <span className="flex items-center text-gray-500">~</span>
                      <input
                        type="datetime-local"
                        name={`${period}End`}
                        onChange={handleChange}
                        value={formData[`${period}End`]}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-row flex flex-col">
                <label className="text-gray-700 text-sm font-bold mb-1">행사위치:</label>
                <input
                  type="text"
                  name="location"
                  onChange={handleChange}
                  value={formData.location}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="form-row flex flex-col">
                <label className="text-gray-700 text-sm font-bold mb-1">모집트럭수:</label>
                <input
                  type="number"
                  name="truckCount"
                  onChange={handleChange}
                  value={formData.truckCount}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="form-row flex flex-col">
                <label className="text-gray-700 text-sm font-bold mb-1">행사설명:</label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  value={formData.description}
                  rows="4"
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-y"
                />
              </div>

              <div className="form-row flex flex-col">
                <label htmlFor="eventImage" className="block text-gray-700 text-sm font-bold mb-1">사진업로드:</label>
                <input
                  id="eventImage"
                  type="file"
                  name="eventImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </div>

              {previewImage && (
                <div className="mt-2 flex justify-center">
                  <img
                    src={previewImage}
                    alt="행사 이미지 미리보기"
                    className="w-40 h-40 object-cover rounded-md border border-gray-200"
                  />
                </div>
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="submit"
                  style={{ backgroundColor: '#4f46e5' }}
                  className="text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-200"
                >
                  {editTargetEvent ? "수정" : "등록"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}