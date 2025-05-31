import React, { useState, useEffect } from "react";
import "../style/TruckProfilePage.css";
import TruckModal from "../components/TruckModal";
import TruckMenuModal from "../components/TruckMenuModal";
import axiosInstance from "../api/axiosInstance";

const TruckProfilePage = () => {
  const [showTruckModal, setShowTruckModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [editMenuIndex, setEditMenuIndex] = useState(null);

  const [truckInfo, setTruckInfo] = useState(null);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const fetchTruckWithMenus = async () => {
      try {
        const response = await axiosInstance.get("/truck/my");
        if (response.data && response.data.length > 0) {
          // 여러 트럭을 받을 경우 첫번째만 세팅 (필요시 변경)
          const truck = response.data[0];
          setTruckInfo({
            truckId: truck.truckId,
            name: truck.name,
            phoneNumber: truck.phoneNumber,
            description: truck.description,
          });
          setMenus(truck.menus.map(menu => ({
            menuId: menu.menuId,
            menuName: menu.menuName,
            menuPrice: menu.menuPrice,
            menuImage: menu.menuImage
          })));
        }
      } catch (error) {
        console.error("트럭 정보 불러오기 실패:", error);
      }
    };

    fetchTruckWithMenus();
  }, []);


const handleEditMenu = (index) => {
  setSelectedMenu(menus[index]);
  setEditMenuIndex(index);
  setShowMenuModal(true);
};

// truckmodal에 전달
const handleSubmitTruckInfo = (savedTruck) => {
  setTruckInfo(savedTruck); // 저장된 정보로 상태 갱신
  setShowTruckModal(false);
};

// menumodal에 전달
const handleSubmitMenu = (menuData) => {
    console.log("handleSubmitMenu 호출됨!", menuData);

  if (editMenuIndex !== null) {
    // 수정
    const updatedMenus = [...menus];
    updatedMenus[editMenuIndex] = menuData;
    setMenus(updatedMenus);
    console.log("수정된 menus:", updatedMenus);

  } else {
    // 새로 추가
    setMenus([...menus, menuData]);
  }
  setSelectedMenu(null);
  setEditMenuIndex(null); 
  setShowMenuModal(false);
};

  return (
    <div className="truck-profile-page">

        {/* 트럭 기본 정보 표시 */}
        <div className="truck-info-view">
            <h2>트럭 기본 정보</h2>
            {truckInfo ? (
            <div>
                <p><strong>트럭명:</strong> {truckInfo.name}</p>
                <p><strong>연락처:</strong> {truckInfo.phoneNumber}</p>
                <p><strong>설명:</strong> {truckInfo.description}</p>
            </div>
            ) : (
            <p>등록된 정보가 없습니다.</p>
            )}
            <button onClick={() => setShowTruckModal(true)} className="truck-btn">
            {truckInfo ? "수정하기" : "등록하기"}
            </button>
        </div>
<hr/>
        {/* 메뉴 목록 표시 */}
        <div className="truck-menu-view">
            <h2>메뉴 정보</h2>
            {menus.length > 0 ? (
            <ul>
                {menus.map((menu, idx) => (
                <li key={idx}>
                    <p><strong>이름:</strong> {menu.menuName}</p>
                    <p><strong>가격:</strong> {menu.menuPrice}원</p>
                    <img src={menu.menuImage} alt="메뉴 이미지" width="100" />
                    <button onClick={() => handleEditMenu(idx)}
                        className="truck-btn">수정</button>
                </li>
                ))}
            </ul>
            ) : (
            <p>등록된 메뉴가 없습니다.</p>
            )}
            <button onClick={() => setShowMenuModal(true)} className="truck-btn">
                메뉴 추가</button>
        </div>

        {/* 트럭 정보 등록/수정 모달 */}
        {showTruckModal && (
            <TruckModal
            initialData={truckInfo}
            onClose={() => setShowTruckModal(false)}
            onSubmit={handleSubmitTruckInfo}
            />
        )}

        {/* 메뉴 등록/수정 모달 */}
        {showMenuModal && (
            <TruckMenuModal
            truckId={truckInfo?.truckId}
            initialData={selectedMenu}
            onClose={() => setShowMenuModal(false)}
            onSubmit={handleSubmitMenu}
            />
        )}

    </div>
  );
};

export default TruckProfilePage;
