import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { disconnectSocket, initializeSocket } from "../socket/socket.client";

export const useAuthStore = create((set) => ({
	authUser: null,
	checkingAuth: true,
	loading: false,

	// ✅ Signup Function
	signup: async (signupData) => {
		try {
			set({ loading: true });
			const res = await axiosInstance.post("/auth/signup", signupData, {
				withCredentials: true, // Ensures cookies are sent
			});
			set({ authUser: res.data.user });

			// ✅ Ensure user ID exists before initializing socket
			if (res.data.user && res.data.user._id) {
				initializeSocket(res.data.user._id);
			}

			toast.success("Account created successfully");
		} catch (error) {
			console.error("Signup Error:", error.response?.data?.message);
			toast.error(error.response?.data?.message || "Something went wrong");
		} finally {
			set({ loading: false });
		}
	},

	// ✅ Login Function
	login: async (loginData) => {
		try {
			set({ loading: true });
			const res = await axiosInstance.post("/auth/login", loginData, {
				withCredentials: true,
			});
			set({ authUser: res.data.user });

			// ✅ Ensure user ID exists before initializing socket
			if (res.data.user && res.data.user._id) {
				initializeSocket(res.data.user._id);
			}

			toast.success("Logged in successfully");
		} catch (error) {
			console.error("Login Error:", error.response?.data?.message);
			toast.error(error.response?.data?.message || "Something went wrong");
		} finally {
			set({ loading: false });
		}
	},

	// ✅ Logout Function
	logout: async () => {
		try {
			const res = await axiosInstance.post("/auth/logout", {}, { withCredentials: true });

			// ✅ Disconnect socket on logout
			disconnectSocket();

			if (res.status === 200) {
				set({ authUser: null });
				toast.success("Logged out successfully");
			}
		} catch (error) {
			console.error("Logout Error:", error.response?.data?.message);
			toast.error(error.response?.data?.message || "Something went wrong");
		}
	},

	// ✅ Check if User is Authenticated
	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/me", { withCredentials: true });

			if (res.data.user && res.data.user._id) {
				initializeSocket(res.data.user._id);
			}

			set({ authUser: res.data.user });
		} catch (error) {
			console.error("Auth Check Error:", error.response?.data?.message);
			set({ authUser: null });
		} finally {
			set({ checkingAuth: false });
		}
	},

	// ✅ Update Authenticated User
	setAuthUser: (user) => set({ authUser: user }),
}));
