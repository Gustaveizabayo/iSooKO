import api from './api';

export interface AuthResponse {
    accessToken: string;
    refreshToken?: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export const authService = {
    login: async (credentials: any) => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }
        return response.data;
    },

    register: async (userData: any) => {
        const response = await api.post<AuthResponse>('/auth/register', userData);
        if (response.data.accessToken) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            if (response.data.refreshToken) {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (e) {
            console.error('Failed to parse user from localStorage', e);
            return null;
        }
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    getRefreshToken: () => {
        return localStorage.getItem('refreshToken');
    },

    setToken: (token: string) => {
        localStorage.setItem('token', token);
    },

    setRefreshToken: (refreshToken: string) => {
        localStorage.setItem('refreshToken', refreshToken);
    },

    setUser: (user: any) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    refreshAccessToken: async () => {
        const refreshToken = authService.getRefreshToken();
        const user = authService.getCurrentUser();

        if (!refreshToken || !user) {
            throw new Error('No refresh token available');
        }

        const response = await api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
            userId: user.id,
            refreshToken,
        });

        if (response.data.accessToken) {
            authService.setToken(response.data.accessToken);
            if (response.data.refreshToken) {
                authService.setRefreshToken(response.data.refreshToken);
            }
        }

        return response.data;
    },
};
