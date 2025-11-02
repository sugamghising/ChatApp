import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from "./MessageInput";
import { User as UserIcon, ArrowLeft } from "lucide-react";
import { formatMessageTime } from "../utils/dateUtils";

const ChatWindow: React.FC = () => {
  const {
    selectedUser,
    messages,
    isMessagesLoading,
    setSelectedUser,
    typingUsers,
    onlineUsers,
  } = useChatStore();
  const { user: currentUser } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isOnline = selectedUser
    ? onlineUsers.includes(selectedUser._id)
    : false;
  const isTyping = selectedUser ? typingUsers.has(selectedUser._id) : false;

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-dark-bg to-sidebar-bg">
        <div className="text-center text-white/70 px-4">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-12 h-12" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Welcome to ChatApp</h2>
          <p className="text-sm">
            Select a user from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-bg">
      {/* Chat Header */}
      <div className="bg-sidebar-bg p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedUser(null)}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-dark-bg flex items-center justify-center overflow-hidden">
              {selectedUser.profilePic ? (
                <img
                  src={selectedUser.profilePic}
                  alt={selectedUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-6 h-6 text-white" />
              )}
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-sidebar-bg"></div>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-white font-semibold">
              {selectedUser.fullName}
            </h3>
            <p className="text-white/70 text-xs">
              {isTyping ? "typing..." : isOnline ? "online" : "offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isMessagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-white/50 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isSent = message.senderId === currentUser?._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isSent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isSent
                        ? "bg-message-sent text-dark-bg rounded-br-sm"
                        : "bg-message-received text-dark-bg rounded-bl-sm"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="attachment"
                        className="rounded-lg mb-2 max-w-full h-auto"
                      />
                    )}
                    {message.text && (
                      <p className="text-sm break-words">{message.text}</p>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">
                        {formatMessageTime(message.createdAt)}
                      </span>
                      {isSent && (
                        <span className="text-xs">
                          {message.seen ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-message-received rounded-2xl rounded-bl-sm px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-dark-bg rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-dark-bg rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-dark-bg rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput />
    </div>
  );
};

export default ChatWindow;
