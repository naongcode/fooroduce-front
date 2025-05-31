import React, { useState, useEffect } from "react";
import { useS3Upload } from "../api/useS3Upload";
import axiosInstance from "../api/axiosInstance";

const TruckMenuModal = ({ truckId, initialData, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    menuName: "", menuPrice: "", menuImage: null,
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{menuId ? "메뉴 수정" : "메뉴 입력"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="menuName"
            placeholder="메뉴 이름"
            value={form.menuName}
            onChange={handleChange}
          />
          <input
            name="menuPrice"
            placeholder="가격"
            value={form.menuPrice}
            onChange={handleChange}
          />
          <input type="file" name="menuImage" accept="image/*" onChange={handleChange} />
          {previewImage && (
            <div style={{ marginTop: 10 }}>
              <img src={previewImage} alt="메뉴 이미지 미리보기" width="150" />
            </div>
          )}
          <button type="submit" className="truck-btn" disabled={uploading}>
            {uploading ? "업로드 중..." : "저장"}
          </button>
          <button type="button" className="truck-btn" onClick={onClose} disabled={uploading}>
            취소
          </button>
        </form>
        {error && <p style={{ color: "red" }}>이미지 업로드 실패: {error.message}</p>}
      </div>
    </div>
  );
};

export default TruckMenuModal;
