import axios from './axiosInstance'

export const geocodeAddress = (address) =>
  axios.post('/map/geocode', { address })

export const getEventMarkers = (region) =>
  axios.get('/map/events', {
    params: region ? { region } : {},
  })

export const getDefaultMap = () => axios.get('/map')
