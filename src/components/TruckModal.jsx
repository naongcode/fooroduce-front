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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl z-10 p-6 relative">
        <h2 className="text-2xl font-bold mb-4">트럭 정보 입력</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            name="name"
            placeholder="트럭명"
            value={form.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            name="phoneNumber"
            placeholder="연락처"
            value={form.phoneNumber}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            name="description"
            placeholder="설명"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-y"
          />
          <div className="flex justify-end space-x-2 mt-4">
            
            <button
              type="submit"
              style={{ backgroundColor: '#4f46e5' }} 
              className="text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-200" 
            >
              저장
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TruckModal;