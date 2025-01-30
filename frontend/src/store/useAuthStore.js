import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isDeleting: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  onlineUsers: [],
  socket: null,

  setError: (data)=>{
    set({error: data})
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user, isAuthenticated: true });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true, isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      toast.error(error.response?.data?.message);
      set({
				isLoading: false,
				error: error.response.data.message || "Error in signup",
			});
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post(`/auth/verify-email`, { verificationToken: code });
			set({ authUser: response.data.user, isLoading: false });
      get().connectSocket();
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},

  forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post(`/auth/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password, confirmPassword) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password, confirmPassword });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user, isAuthenticated: true });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, isAuthenticated: false });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  updateProfilePic: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profilepic", data);
      set({ authUser: res.data.user });
      toast.success("Profile Picture updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateUserName: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-username", {newUserName: data});
      set({ authUser: res.data.user });
      toast.success("Name updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  deleteUser: async()=>{
    set({ isDeleting: true });
    try {
      await axiosInstance.delete("/auth/delete-user");
      set({ authUser: null, isAuthenticated: false, isDeleting: false });
      toast.success("User deleted Successfully!");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
