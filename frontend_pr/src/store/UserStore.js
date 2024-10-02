import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
// import { disconnectSocket } from "../services/SocketService";
import io from "socket.io-client";
// const socket = io("http://localhost:4000");

export const useUserStore = create(
  persist(
    devtools((set, get) => ({
      user: null,
      authToken: null,
      // socket: null,

      setAuthToken: (authToken) => set({ authToken }),
      setUser: (user) => set({ user }),

      // connectSocket: (token) => {
      //   const socket = io("http://localhost:4000", {
      //     query: { token },
      //   });

      //   socket.on("connect", () => {
      //     console.log("Connected to server via socket:", socket.id);
      //   });

      //   set({ socket }); // Update the socket in the store
      // },

      // disconnectSocket: () => {
      //   const { socket } = get();
      //   if (socket) {
      //     socket.disconnect();
      //     console.log("Socket has been disconnected on logout");
      //   }
      //   set({ socket: null }); // Clear the socket from the store
      // },

      logout: () => {
        // const { disconnectSocket } = get();
        // disconnectSocket();
        set({ user: null, authToken: null});
      },
    })),
    {
      name: "user-store",
      getStorage: () => localStorage,
    }
  )
);
