import { create } from 'zustand';
import { User, Message, UsersResponse, MessagesResponse } from '../types';
import api from '../config/api';
import toast from 'react-hot-toast';

interface ChatState {
    users: User[];
    selectedUser: User | null;
    messages: Message[];
    unseenCounts: { [userId: string]: number };
    onlineUsers: string[];
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    typingUsers: Set<string>;

    getUsers: () => Promise<void>;
    setSelectedUser: (user: User | null) => void;
    getMessages: (userId: string) => Promise<void>;
    sendMessage: (receiverId: string, text?: string, image?: string) => Promise<void>;
    addMessage: (message: Message) => void;
    markMessageAsSeen: (messageId: string) => Promise<void>;
    setOnlineUsers: (users: string[]) => void;
    updateUnseenCount: (userId: string, count: number) => void;
    setTyping: (userId: string, isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    users: [],
    selectedUser: null,
    messages: [],
    unseenCounts: {},
    onlineUsers: [],
    isUsersLoading: false,
    isMessagesLoading: false,
    typingUsers: new Set(),

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await api.get<UsersResponse>('/api/messages/users');
            if (response.data.success) {
                set({
                    users: response.data.user,
                    unseenCounts: response.data.unseenMessage || {},
                    isUsersLoading: false
                });
            }
        } catch (error: any) {
            console.error('Get users error:', error);
            toast.error('Failed to load users');
            set({ isUsersLoading: false });
        }
    },

    setSelectedUser: (user) => {
        set({ selectedUser: user, messages: [] });
        if (user) {
            get().getMessages(user._id);
            // Reset unseen count for this user
            set((state) => ({
                unseenCounts: { ...state.unseenCounts, [user._id]: 0 }
            }));
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const response = await api.get<MessagesResponse>(`/api/messages/${userId}`);
            if (response.data.success) {
                set({ messages: response.data.messages, isMessagesLoading: false });
            }
        } catch (error: any) {
            console.error('Get messages error:', error);
            toast.error('Failed to load messages');
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (receiverId, text, image) => {
        try {
            const response = await api.post<{ success: boolean; newMessage: Message }>(
                `/api/messages/send/${receiverId}`,
                { text, image }
            );
            if (response.data.success) {
                set((state) => ({ messages: [...state.messages, response.data.newMessage] }));
            }
        } catch (error: any) {
            console.error('Send message error:', error);
            toast.error('Failed to send message');
        }
    },

    addMessage: (message) => {
        const { selectedUser, messages } = get();

        // Only add message if it's for the currently selected chat
        if (selectedUser && (
            (message.senderId === selectedUser._id) ||
            (message.receiverId === selectedUser._id)
        )) {
            set({ messages: [...messages, message] });
        }

        // Update unseen count if message is from another user
        if (message.senderId !== selectedUser?._id) {
            set((state) => ({
                unseenCounts: {
                    ...state.unseenCounts,
                    [message.senderId]: (state.unseenCounts[message.senderId] || 0) + 1
                }
            }));
        }
    },

    markMessageAsSeen: async (messageId) => {
        try {
            await api.put(`/api/messages/mark/${messageId}`);
        } catch (error) {
            console.error('Mark message as seen error:', error);
        }
    },

    setOnlineUsers: (users) => {
        set({ onlineUsers: users });
    },

    updateUnseenCount: (userId, count) => {
        set((state) => ({
            unseenCounts: { ...state.unseenCounts, [userId]: count }
        }));
    },

    setTyping: (userId, isTyping) => {
        set((state) => {
            const newTypingUsers = new Set(state.typingUsers);
            if (isTyping) {
                newTypingUsers.add(userId);
            } else {
                newTypingUsers.delete(userId);
            }
            return { typingUsers: newTypingUsers };
        });
    },
}));
