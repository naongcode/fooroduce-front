import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),  // 유저 데이터 상태 업데이트
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 상태 저장
    }
  )
);

export default useAuthStore;