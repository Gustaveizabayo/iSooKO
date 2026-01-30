import api from './api';

export const attendanceService = {
    logPresence: async (lessonId: string) => {
        const response = await api.post('/attendance/log', {
            lessonId,
            status: 'PRESENT',
            timestamp: new Date().toISOString()
        });
        return response.data;
    },

    getCourseAttendance: async (courseId: string) => {
        const response = await api.get(`/attendance/course/${courseId}`);
        return response.data;
    },

    getMyAttendance: async () => {
        const response = await api.get('/attendance/me');
        return response.data;
    }
};
