import axiosInstance from './axiosInstance';

export const getNearbyEvents = async (longitude, latitude) => {
  return await axiosInstance.get('/events/recommend/nearby', {
    params: { longitude, latitude }
  });
};