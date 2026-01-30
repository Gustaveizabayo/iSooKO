import api from './api';


export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    avatarUrl?: string;
}

export interface ProfileData {
    id?: string;
    userId?: string;
    bio?: string;
    profileImageUrl?: string;
    timezone?: string;
    language?: string;
    experience?: string;
    qualifications?: string;
    isPublic?: boolean;
    status?: string;
    user?: User;
}

export interface UpdateProfilePayload {
    bio?: string;
    profileImageUrl?: string; // This updates the Profile model's image
    timezone?: string;
    language?: string;
    experience?: string;
    qualifications?: string;
    isPublic?: boolean;
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    avatarUrl?: string; // This updates the User model's avatar (preferred)
}

export const profileService = {
    // Get full profile (including embedded user data)
    getMyProfile: async () => {
        // This returns the Profile object derived from profiles table, which INCLUDES user object
        const response = await api.get<ProfileData | null>('/profiles/me');
        return response.data;
    },

    // Update the Extended Profile (Bio, Experience, etc.)
    updateProfileDetails: async (data: UpdateProfilePayload) => {
        const response = await api.put<ProfileData>('/profiles/me', data);
        return response.data;
    },

    // Update the User Core Info (Name, Avatar, Email)
    updateUserInfo: async (userId: string, data: UpdateUserPayload) => {
        const response = await api.patch<User>(`/users/${userId}`, data);
        return response.data;
    },

    // Upload any file (Avatar, etc.)
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        // Using postForm to automatically handle Content-Type and boundaries
        const response = await api.postForm<{ url: string; key: string }>('/uploads', formData);
        return response.data;
    }
};
