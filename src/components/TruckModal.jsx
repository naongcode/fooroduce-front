import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

const TruckModal = ({ initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let res;
    if (form.truckId) {
      // truckId가 있으면 수정
      res = await axiosInstance.put(`/truck/${form.truckId}`, form);
    } else {
      // truckId가 없으면 새로 등록
      res = await axiosInstance.post("/truck", form);
    }
    onSubmit(res.data);
  } catch (error) {
    console.error("트럭 저장 실패", error);
    alert("트럭 정보를 저장하는 데 실패했습니다.");
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>트럭 정보 입력</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="트럭명" value={form.name} onChange={handleChange} />
          <input name="phoneNumber" placeholder="연락처" value={form.phoneNumber} onChange={handleChange} />
          <textarea name="description" placeholder="설명" value={form.description} onChange={handleChange} />
          <button type="submit" className="truck-btn">저장</button>
          <button type="button" className="truck-btn" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
};

export default TruckModal;
