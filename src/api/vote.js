import { getGuestFingerprint } from './auth.js'
import axiosInstance from './axiosInstance'

export const voteAsMember = (data) => axiosInstance.post('/votes', data)

export const voteAsGuest = async (data) => {
  let fingerprint = localStorage.getItem('fingerprint')
  if (!fingerprint) {
    fingerprint = await getGuestFingerprint()
    localStorage.setItem('fingerprint', fingerprint)
  }
  return axiosInstance.post('/votes', data, {
    headers: {
      fingerprint,
    },
  })
}

export const getVoteResults = (event_id) =>
  axiosInstance.get(`/events/${event_id}/votes`)
