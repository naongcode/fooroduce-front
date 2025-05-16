import axiosInstance from './axiosInstance'


//전체 행사 목록
export const getAllEvents = async () => {
  const response = await axiosInstance.get('/events')
  return response.data
}

//현재 투표가능한 행사목록
export const getOngoingEvents = async () => {
  try {
    const response = await axiosInstance.get('/events/ongoing')
    return response.data
  } catch (error) {
    console.error('Error fetching ongoing events:', error)
    throw error
  }
}

//종료된 행사목록
export const getClosedEvents = async () => {
  try {
    const response = await axiosInstance.get('/events/closed')
    return response.data
  } catch (error) {
    console.error('Error fetching closed events:', error)
    throw error
  }
}
