import { create } from 'zustand';

// create 함수로 zustand 상태 저장소 생성
const useAuthStore = create((set) => ({
  // 초기 상태: 로컬스토리지에 jwt_token이 있다면 로그인된 상태로 간주
  user: null,
  userId: localStorage.getItem('user_id') || null,
  isLoggedIn: !!localStorage.getItem('jwt_token'),
  token: localStorage.getItem('jwt_token') || null,

  // Zustand 전용 로그인 상태 설정
  setAuthStoreLogin: (token, user) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_id', user.userId);
    set({ isLoggedIn: true, token, user, userId: user.userId });
  },

  // Zustand 전용 로그아웃 처리
  resetAuthStore: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    set({ isLoggedIn: false, token: null, user: null, userId: null });
  },
}));

export default useAuthStore;