import api from './api';

export interface VideoAnalytics {
    courseId: string;
    lessonId: string;
    watchedDuration: number; // in seconds
    totalDuration: number;
    lastPosition: number; // last timestamp in seconds
    isCompleted: boolean;
}

export const analyticsService = {
    trackProgress: async (data: Omit<VideoAnalytics, 'isCompleted'>) => {
        const response = await api.post('/attendance/track-video', data);
        return response.data;
    },

    getCourseAnalytics: async (courseId: string) => {
        const response = await api.get(`/attendance/course/${courseId}/analytics`);
        return response.data;
    }
};
