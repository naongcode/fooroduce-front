import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export function useS3Upload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadToS3 = async (file) => {
    setUploading(true);
    setError(null);

    try {
      // 고유 이름 생성 (UUID 사용)
      const uuid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
      const uniqueName = `${uuid}-${file.name}`;

      // presigned url 요청
      const { data } = await axiosInstance.post("/events/presigned-url", {
        filename: uniqueName,
      });

      // presigned url로 PUT
      await fetch(data.uploadURL, {
        method: "PUT",
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Type": file.type,
        },
        body: file,
      });

      const bucket = "naong2-s3";
      const region = "ap-northeast-2";

      const imageUrl = `https://${bucket}.s3.${region}.amazonaws.com/image/${data.filePath}`;
      setUploading(false);
      return imageUrl;
    } catch (err) {
      setError(err);
      setUploading(false);
      throw err;
    }
  };

  return { uploadToS3, uploading, error };
}
