export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed' | 'missed';
export type Category = 'General' | 'Work' | 'Study' | 'Personal';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt?: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    deadline: string; // ISO string
    priority: Priority;
    status: Status;
    category: Category;
    createdAt: string;
    order: number;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
