import api from './api';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
    bio?: string;
    headline?: string;
    location?: string;
    website?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
}

export const userService = {
    getProfile: async () => {
        const response = await api.get<UserProfile>('/users/profile');
        return response.data;
    },

    updateProfile: async (data: Partial<UserProfile>) => {
        const response = await api.patch<UserProfile>('/users/profile', data);
        return response.data;
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<{ url: string }>('/users/upload-avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
