import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getVoteResults } from '../api/vote';

export default function useVotePageData(eventId) {
  const [eventData, setEventData] = useState(null);
  const [eventResult, setEventResult] = useState([]);
  const [votedTruckIds, setVotedTruckIds] = useState([]);

  // 행사정보 가져오기
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await axiosInstance.get(`/events/${eventId}`);
        setEventData(res.data);
      } catch (err) {
        console.error("이벤트 상세 조회 실패", err);
      }
    };
    fetchEventData();
  }, [eventId]);

  // 투표결과 가져오기
  const fetchVoteResult = async () => {
    try {
      const response = await getVoteResults(eventId);
      setEventResult(response.data);
    } catch (e) {
      console.log('fetch result failed', e);
    }
  };

  useEffect(() => {
    fetchVoteResult();
  }, [eventId]);

  // 투표 이미 했는지 확인
  const fetchVoteStatus = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const fingerprint = localStorage.getItem('fingerprint');
      if (!token && !fingerprint) return;

      const config = {
        headers: {},
        params: {},
      };
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      if (fingerprint) config.params['fingerprint'] = fingerprint;

      const res = await axiosInstance.get(`/votes/status/${eventId}`, config);
      const votedIds = res.data
        .filter(item => item.alreadyVoted)
        .map(item => item.truckId);
      setVotedTruckIds(votedIds);
    } catch (e) {
      console.error('투표 상태 조회 실패', e);
    }
  };

  useEffect(() => {
    fetchVoteStatus();
  }, [eventId]);

  return { eventData, eventResult, votedTruckIds, setVotedTruckIds, fetchVoteResult};
}