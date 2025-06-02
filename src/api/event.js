import axiosInstance from './axiosInstance'

//행사 생성하기
export const CreateEvent = async () => {
  const response = await axiosInstance.get('/events/create')
  return response.data
}
