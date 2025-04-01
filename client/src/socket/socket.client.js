import io from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

let socket = null;

export const initializeSocket = (userId) => {
	if (socket) {
		console.log("🔌 Disconnecting existing socket...");
		socket.disconnect();
	}

	console.log("🔌 Connecting to socket server at", SOCKET_URL);
	socket = io(SOCKET_URL, {
		auth: { userId },
		withCredentials: true, // Ensures cookies are sent with requests
		reconnection: true, // Enables automatic reconnection
		reconnectionAttempts: 5, // Maximum attempts before giving up
		reconnectionDelay: 1000, // Delay between reconnections (1s)
	});

	// Event Listeners for Debugging
	socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
	socket.on("disconnect", () => console.warn("⚠️ Socket disconnected"));
	socket.on("connect_error", (err) => console.error("❌ Socket connection error:", err));
};

export const getSocket = () => {
	if (!socket) {
		console.error("⚠️ Attempted to use socket before initialization");
		throw new Error("Socket not initialized. Call initializeSocket(userId) first.");
	}
	return socket;
};

export const disconnectSocket = () => {
	if (socket) {
		console.log("🔌 Disconnecting socket...");
		socket.disconnect();
		socket = null;
	}
};
