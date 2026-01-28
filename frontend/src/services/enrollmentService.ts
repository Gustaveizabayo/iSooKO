import api from './api';

export const enrollmentService = {
    getMyEnrollments: async () => {
        const response = await api.get('/enrollments/my-enrollments');
        return response.data;
    },

    enrollInCourse: async (courseId: string) => {
        const response = await api.post('/enrollments', { courseId });
        return response.data;
    }
};
