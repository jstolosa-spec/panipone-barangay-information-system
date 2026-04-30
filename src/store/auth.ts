import { create } from 'zustand';
import type { User, UserRole } from '@shared/types';
import { MOCK_USERS } from '@shared/mock-data';
interface AuthState {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;
}
export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  setRole: (role) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, role } : null
  })),
}));
// Selectors
export const useCurrentUser = () => useAuthStore((s) => s.currentUser);
export const useLogin = () => useAuthStore((s) => s.login);
export const useLogout = () => useAuthStore((s) => s.logout);
export const useSetRole = () => useAuthStore((s) => s.setRole);