import React, { useState, useEffect } from "react";
import { useS3Upload } from "../api/useS3Upload";
import axiosInstance from "../api/axiosInstance";

const TruckMenuModal = ({ truckId, initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    menuName: "",
    menuPrice: "",
    menuImage: null,
  });
  const [menuId, setMenuId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const { uploadToS3, uploading, error } = useS3Upload();

  useEffect(() => {
    if (initialData) {
      setMenuId(initialData.menuId || null);
      setForm({
        menuId: initialData.menuId || null,
        menuName: initialData.menuName || "",
        menuPrice: initialData.menuPrice || "",
        menuImage: initialData.menuImage || null,
      });
      if (initialData.menuImage && typeof initialData.menuImage === "string") {
        setPreviewImage(initialData.menuImage);
      } else {
        setPreviewImage(null);
      }
    } else {
      setMenuId(null);
      setForm({ menuId: null, menuName: "", menuPrice: "", menuImage: null });
      setPreviewImage(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = form.menuImage;

      if (form.menuImage instanceof File) {
        imageUrl = await uploadToS3(form.menuImage);
      }

      const payload = {
        truckId,
        menuName: form.menuName,
        menuPrice: form.menuPrice,
        menuImage: imageUrl,
      };

      if (menuId) {
        // 수정
        const res = await axiosInstance.put(`/truck/menus/${menuId}`, payload);
        onSubmit({ menuId, ...payload });
      } else {
        // 신규 등록
        const res = await axiosInstance.post("/truck/menus", payload);
        onSubmit({ menuId, ...payload });
      }
    } catch (err) {
      console.error("메뉴 저장 실패", err);
      alert("메뉴 저장에 실패했습니다.");
    }
  };

  return (
    // 모달 오버레이는 전체 화면을 덮고 모달을 중앙에 배치하는 역할을 합니다.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* 이 부분이 실제 모달 내용이며, 여기에 카드 스타일 클래스를 적용합니다. */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl z-10 p-6 relative">
        <h2 className="text-2xl font-bold mb-4">
          {menuId ? "메뉴 수정" : "메뉴 입력"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            name="menuName"
            placeholder="메뉴 이름"
            value={form.menuName}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            name="menuPrice"
            placeholder="가격"
            value={form.menuPrice}
            onChange={handleChange}
            type="number" // 가격은 숫자로 입력하도록 타입 변경
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div>
            <label htmlFor="menuImage" className="block text-gray-700 text-sm font-bold mb-2">메뉴 이미지</label>
            <input
              id="menuImage"
              type="file"
              name="menuImage"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" // 파일 입력 필드 스타일
            />
          </div>
          {previewImage && (
            <div className="mt-2 flex justify-center"> {/* 미리보기 이미지 중앙 정렬 */}
              <img
                src={previewImage}
                alt="메뉴 이미지 미리보기"
                className="w-40 h-40 object-cover rounded-md border border-gray-200" // 이미지 크기 및 스타일
              />
            </div>
          )}
          {error && <p className="text-red-500 text-sm mt-2">이미지 업로드 실패: {error.message}</p>}

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              style={{ backgroundColor: '#4f46e5' }} // 인라인 스타일로 직접 색상 적용
              className="text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition duration-200"
              disabled={uploading}
            >
              {uploading ? "업로드 중..." : "저장"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
              disabled={uploading}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TruckMenuModal;