import axiosInstance from "./axiosInstance";

export const getTop3Trucks = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/events/${eventId}/ranked-trucks`)
    return response.data
  } catch (error) {
    console.error('상위 트럭 목록 불러오기 실패:', error)
    throw error
  }
}