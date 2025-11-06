import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { APT_PATHS } from '../utils/apiPaths';
import { useAuth } from './useAuth';

export const useMessage = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  getUsersSideBar: async () => {
    try {
      const res = await axiosInstance.get(APT_PATHS.MESSAGES.GET_USERS);
      set({ users: res.data.users });
    } catch (error) {
      console.log(error);
    }
  },
  setSelectedUser: async (userData) => {
    set({ selectedUser: userData });
  },
  getMessages: async () => {
    try {
      const id = get().selectedUser._id;
      const res = await axiosInstance.get(APT_PATHS.MESSAGES.GET_MESSAGES(id));
      set({ messages: res.data.messages });
    } catch (error) {
      console.log(error);
    }
  },
  sendMessage: async (data) => {
    try {
      const { selectedUser, getMessages } = get();
      const res = await axiosInstance.post(
        APT_PATHS.MESSAGES.SEND_MESSAGE(selectedUser._id),
        data
      );
      set((state) => ({
        messages: [...state.messages, res.data.message],
      }));
      await getMessages();
    } catch (error) {
      console.log(error);
    }
  },
  sendMessageBySocketIo: async () => {
    const { selectedUser, getMessages } = get();
    if (!selectedUser) return;
    const socket = useAuth.getState().socket;
    if (!socket || !socket.connected) {
      console.warn('⚠️ Socket not connected, skipping listener.');
      return;
    }

    socket.off('newMessage');
    socket.on('newMessage', async (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set((state) => ({ messages: [...state.messages, newMessage] }));
      await getMessages();
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuth.getState().socket;
    if (!socket || !socket.connected) return; 

    socket.off('newMessage');
  },
}));
