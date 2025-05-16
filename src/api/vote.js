import { getGuestFingerprint } from './auth.js'
import axiosInstance from './axiosInstance'

export const voteAsMember = (data) => axiosInstance.post('/votes', data)

export const voteAsGuest = async (data) => {
  try {
    let fingerprint = localStorage.getItem('fingerprint')
    console.log('보내는 fingerprint:', fingerprint);

    if (!fingerprint) {
      fingerprint = await getGuestFingerprint()
      console.log('새로 생성된 fingerprint:', fingerprint);
      localStorage.setItem('fingerprint', fingerprint)
    }

    return axiosInstance.post('/votes', data, {
      headers: {
        fingerprint: localStorage.getItem('fingerprint')
      },
    }) 
  } catch (err) {
    console.error('voteAsGuest 에러:', err)
    throw err
  }
}

export const getVoteResults = (eventId) =>
  axiosInstance.get(`/votes/results/${eventId}`)
