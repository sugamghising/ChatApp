export interface User {
    _id: string;
    email: string;
    fullName: string;
    profilePic?: string;
    bio?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    text?: string;
    image?: string;
    seen: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    success: boolean;
    userData: User;
    token: string;
    message: string;
}

export interface UsersResponse {
    success: boolean;
    user: User[];
    unseenMessage: { [userId: string]: number };
}

export interface MessagesResponse {
    success: boolean;
    messages: Message[];
}
