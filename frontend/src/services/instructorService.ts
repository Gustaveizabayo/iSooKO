import api from './api';
import type { Course } from './courseService';

export const instructorService = {
    getMyCourses: async () => {
        const response = await api.get<Course[]>('/courses/instructor/my-courses');
        return response.data;
    },

    createCourse: async (courseData: any) => {
        const response = await api.post<Course>('/courses', courseData);
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/dashboard/instructor/stats');
        return response.data;
    }
};
