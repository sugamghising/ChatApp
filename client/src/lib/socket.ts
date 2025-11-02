import { io, Socket } from 'socket.io-client';
import { API_URL } from '../config/api';

let socket: Socket | null = null;

export const initializeSocket = (userId: string) => {
    if (socket) {
        socket.disconnect();
    }

    socket = io(API_URL, {
        query: { userId },
    });

    socket.on('connect', () => {
        console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
