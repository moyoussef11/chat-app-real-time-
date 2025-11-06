import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { APT_PATHS } from '../utils/apiPaths';
import { useAuth } from './useAuth';

export const useGroup = create((set, get) => ({
  groups: [],
  groupMessages: [],
  selectedGroup: null,
  createdGroup: false,
  getGroupsSideBar: async () => {
    try {
      const res = await axiosInstance.get(APT_PATHS.GROUPS.GROUPS);
      set({ groups: res.data.groups });
    } catch (error) {
      console.log(error);
    }
  },
  setSelectedGroup: async (groupData) => {
    set({ selectedGroup: groupData });
  },
  getGroupMessages: async () => {
    try {
      const id = get().selectedGroup._id;
      const res = await axiosInstance.get(APT_PATHS.GROUPS.GET_MESSAGES(id));
      set({ groupMessages: res.data.messages });
    } catch (error) {
      console.log(error);
    }
  },
  sendMessage: async (data) => {
    try {
      const { selectedGroup, getGroupMessages } = get();
      const res = await axiosInstance.post(
        APT_PATHS.GROUPS.SEND_MESSAGES(selectedGroup._id),
        { text: data }
      );

      set((state) => ({
        groupMessages: [...state.groupMessages, res.data.message],
      }));
      await getGroupMessages();
    } catch (error) {
      console.log(error);
    }
  },
  createGroup: async (data) => {
    set({ createdGroup: false });
    try {
      const { getGroupsSideBar } = get();
      const res = await axiosInstance.post(APT_PATHS.GROUPS.GROUPS, data);
      if (res.data.status === 'success') {
        set({ createdGroup: true });
      }

      await getGroupsSideBar();
    } catch (error) {
      console.log(error);
    }
  },
  sendMessageBySocketIo: async () => {
    const { selectedGroup, getGroupMessages } = get();
    if (!selectedGroup) return;
    const socket = useAuth.getState().socket;
    if (!socket || !socket.connected) {
      console.warn('⚠️ Socket not connected, skipping listener.');
      return;
    }
    socket.emit('joinGroup', selectedGroup._id);
    socket.off('newMessageToGroup');
    socket.on('newMessageToGroup', async (newMessage) => {
      console.log(newMessage);

      set((state) => ({ groupMessages: [...state.groupMessages, newMessage] }));
      await getGroupMessages();
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuth.getState().socket;
    if (!socket || !socket.connected) return;
    socket.off('newMessageToGroup');
  },
}));
