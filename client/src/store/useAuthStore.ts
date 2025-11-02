import { create } from 'zustand';
import { User, AuthResponse } from '../types';
import api from '../config/api';
import toast from 'react-hot-toast';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isCheckingAuth: boolean;
    signup: (data: { fullName: string; email: string; password: string; bio: string }) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    updateProfile: (data: { fullName?: string; bio?: string; profilePic?: string }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                set({ isCheckingAuth: false, user: null });
                return;
            }

            const response = await api.get<{ success: boolean; user: User }>('/api/auth/check');
            set({ user: response.data.user, isCheckingAuth: false });
        } catch (error: any) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
            set({ user: null, isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isLoading: true });
        try {
            const response = await api.post<AuthResponse>('/api/auth/signup', data);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                set({ user: response.data.userData, isLoading: false });
                toast.success(response.data.message || 'Signup successful!');
            } else {
                toast.error(response.data.message || 'Signup failed');
                set({ isLoading: false });
            }
        } catch (error: any) {
            console.error('Signup error:', error);
            toast.error(error.response?.data?.message || 'Signup failed');
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await api.post<AuthResponse>('/api/auth/login', { email, password });
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                set({ user: response.data.userData, isLoading: false });
                toast.success(response.data.message || 'Login successful!');
            } else {
                toast.error(response.data.message || 'Login failed');
                set({ isLoading: false });
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed');
            set({ isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
        toast.success('Logged out successfully');
    },

    updateProfile: async (data) => {
        set({ isLoading: true });
        try {
            const response = await api.put<{ success: boolean; user: User }>('/api/auth/update-profile', data);
            if (response.data.success) {
                set({ user: response.data.user, isLoading: false });
                toast.success('Profile updated successfully!');
            } else {
                toast.error('Profile update failed');
                set({ isLoading: false });
            }
        } catch (error: any) {
            console.error('Profile update error:', error);
            toast.error(error.response?.data?.message || 'Profile update failed');
            set({ isLoading: false });
        }
    },
}));
