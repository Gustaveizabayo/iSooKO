import api from './api';

export interface Course {
    id: string;
    title: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    instructorId: string;
    thumbnailUrl?: string;
    instructor?: {
        name: string;
    };
    _count?: {
        reviews: number;
        enrollments: number;
    };
}

export const courseService = {
    getAll: async (params?: any) => {
        const response = await api.get<Course[]>('/courses', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Course>(`/courses/${id}`);
        return response.data;
    },

    getFeatured: async () => {
        const response = await api.get<Course[]>('/courses', {
            params: { limit: 4, sort: 'popular' }
        });
        return response.data;
    }
};
