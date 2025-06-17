import axiosInstance from './axiosInstance';

export const getNearbyEvents = async (longitude, latitude, excludedEventId, radius = 5000) => {
  return await axiosInstance.get('/events/recommend/nearby', {
    params: { longitude, latitude, excludedEventId, radius}
  });
};