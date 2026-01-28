import api from './api';

export interface Review {
    id?: string;
    courseId: string;
    rating: number; // 1-5
    comment: string;
    userId?: string;
    user?: {
        name: string;
    };
    createdAt?: string;
}

export const reviewService = {
    create: async (data: Review) => {
        const response = await api.post(`/reviews`, data);
        return response.data;
    },

    getByCourse: async (courseId: string) => {
        const response = await api.get<Review[]>(`/reviews/course/${courseId}`);
        return response.data;
    }
};
