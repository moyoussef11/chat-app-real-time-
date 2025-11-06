import { create } from 'zustand';

export const useTheme = create((set) => ({
  theme: localStorage.getItem('chat-theme') || 'dark',
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('chat-theme', theme);
  },
}));
