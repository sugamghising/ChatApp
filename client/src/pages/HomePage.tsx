import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { initializeSocket, disconnectSocket } from "../lib/socket";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { Message } from "../types";

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { addMessage, setOnlineUsers, selectedUser } = useChatStore();

  useEffect(() => {
    if (user) {
      const socket = initializeSocket(user._id);

      // Listen for online users
      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      // Listen for new messages
      socket.on("newMessage", (message: Message) => {
        addMessage(message);
      });

      return () => {
        disconnectSocket();
      };
    }
  }, [user, addMessage, setOnlineUsers]);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Mobile: Show sidebar or chat based on selection */}
      <div
        className={`${
          selectedUser ? "hidden md:block" : "block"
        } w-full md:w-auto`}
      >
        <Sidebar />
      </div>

      {/* Desktop: Always show, Mobile: Show when user selected */}
      <div className={`${selectedUser ? "block" : "hidden md:block"} flex-1`}>
        <ChatWindow />
      </div>
    </div>
  );
};

export default HomePage;
