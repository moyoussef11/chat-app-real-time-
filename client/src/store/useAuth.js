import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { APT_PATHS } from '../utils/apiPaths';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';

const userFromCookie = Cookies.get('user');
const tokenFromCookie = Cookies.get('token');

export const useAuth = create((set, get) => ({
  user: userFromCookie ? JSON.parse(userFromCookie) : null,
  createdUser: false,
  isLogin: false,
  isLogout: false,
  isUpdatedUser: false,
  token: tokenFromCookie || null,
  socket: null,
  onlineUsers: null,

  register: async (data) => {
    try {
      const res = await axiosInstance.post(APT_PATHS.AUTH.REGISTER, data);
      set({ user: res.data, createdUser: true });
      get().connectWithSocketIo();
      toast.success('Account created successfully');
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.message);
    }
  },
  login: async (data) => {
    try {
      const res = await axiosInstance.post(APT_PATHS.AUTH.LOGIN, data);
      set({ user: res.data.user, token: res.data.token, isLogin: true });
      get().connectWithSocketIo();
      Cookies.set('user', JSON.stringify(res.data.user));
      toast.success('Account Login successfully');
    } catch (error) {
      toast.error(error.message);
    }
  },
  updateUser: async (id, pic) => {
    try {
      const formData = new FormData();
      formData.append('profilePic', pic);
      const res = await axiosInstance.put(
        APT_PATHS.AUTH.UPDATEPROFILE(id),
        formData
      );
      set({ user: res.data.user, isUpdatedUser: true });
      Cookies.set('user', JSON.stringify(res.data.user));
      toast.success('Profile picture updated successfully');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  },
  logout: () => {
    try {
      axiosInstance.post(APT_PATHS.AUTH.LOGOUT);
      set({ isLogout: true, token: null, user: null });
      Cookies.remove('user');
      get().disconnectWithSocketIo();
      // console.log(get().socket);
    } catch (error) {
      console.log(error);
    }
  },
  connectWithSocketIo: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const socket = io('http://localhost:1111/', {
      query: { userId: user._id },
    });
    socket.connect();
    set({ socket: socket });
    socket.on('getOnlineUsers', (onlineUsers) => {
      set({ onlineUsers: onlineUsers });
    });
    console.log('Connecting socket...');
  },
  disconnectWithSocketIo: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
