import { create } from 'zustand';

// create 함수로 zustand 상태 저장소 생성
const useAuthStore = create((set) => ({
  // 초기 상태: 로컬스토리지에 jwt_token이 있다면 로그인된 상태로 간주
  user: null,
  isLoggedIn: !!localStorage.getItem('jwt_token'),
  token: localStorage.getItem('jwt_token') || null,

  // Zustand 전용 로그인 상태 설정
  setAuthStoreLogin: (token, user) => {
    localStorage.setItem('jwt_token', token);
    set({ isLoggedIn: true, token, user });
  },

  // Zustand 전용 로그아웃 처리
  resetAuthStore: () => {
    localStorage.removeItem('jwt_token');
    set({ isLoggedIn: false, token: null, user: null });
  },
}));

export default useAuthStore;