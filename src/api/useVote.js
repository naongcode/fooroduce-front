import { voteAsGuest, voteAsMember } from '../api/vote';

export default function useVote(eventId) {
  // 투표하기(회원/비회원)
  const vote = async (truckId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        await voteAsMember({ eventId, truckId });
      } else {
        await voteAsGuest({ eventId, truckId });
      }
    } catch (e) {
      console.error('투표 실패', e);
    }
  };

  return { vote };
}
