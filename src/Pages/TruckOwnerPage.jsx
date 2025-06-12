import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import "../style/TruckOwnerPage.css";

const TruckOwnerPage = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/applications/truck")
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        console.error("참가신청 내역 불러오기 실패", err);
      });
  }, []);

  // const handleGoToDetail = (applicationId) => {
  //   navigate(`/owner/${applicationId}`);
  // };

  const handleGoToProfile = () => {
    navigate("/owner/profile");
  };

  return (
    <div className="app-truck-container">
      <div className="app-truck-header">
        <h1 className="app-page-title">트럭 사장님 페이지</h1>
        <button className="app-profile-btn" onClick={handleGoToProfile}>
          트럭 정보 등록/수정
        </button>
      </div>

      <h2 className="app-section-title">참가 신청 내역</h2>

      {applications.length === 0 ? (
        <p className="app-empty-text">참가 신청 내역이 없습니다.</p>
      ) : (
        <table className="app-table">
          <thead>
            <tr>
              <th>행사명</th>
              <th>모집 시작</th>
              <th>모집 종료</th>
              <th>행사 시작</th>
              <th>행사 종료</th>
              <th>장소</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.applicationId} onClick={() => handleGoToDetail(app.applicationId)} className="app-table-row">
                <td>{app.eventName}</td>
                <td>{app.recruitStart.replace('T', '\n')}</td>
                <td>{app.recruitEnd.replace('T', '\n')}</td>
                <td>{app.eventStart.replace('T', '\n')}</td>
                <td>{app.eventEnd.replace('T', '\n')}</td>
                <td>{app.location}</td>
                <td>{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TruckOwnerPage;