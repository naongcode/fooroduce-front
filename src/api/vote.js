import axios from './axiosInstance'
import { getGuestFingerprint } from './auth.js'

export const voteAsMember = (data) => axios.post('/votes', data)

export const voteAsGuest = async (data) => {
  let fingerprint = localStorage.getItem('fingerprint')
  if (!fingerprint) {
    fingerprint = await getGuestFingerprint()
    localStorage.setItem('fingerprint', fingerprint)
  }
  return axios.post('/votes', data, {
    headers: {
      fingerprint,
    },
  })
}

export const getVoteResults = (event_id) =>
  axios.get(`/events/${event_id}/votes`)
