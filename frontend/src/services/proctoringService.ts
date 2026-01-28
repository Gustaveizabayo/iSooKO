import api from './api';

export const proctoringService = {
    logViolation: async (attemptId: string, data: { type: string, severity: string, snapshotUrl?: string }) => {
        const response = await api.post(`/proctoring/log`, {
            attemptId,
            ...data,
            timestamp: new Date().toISOString()
        });
        return response.data;
    },

    startAttempt: async (lessonId: string) => {
        const response = await api.post(`/proctoring/session/start`, { lessonId });
        return response.data;
    }
};
