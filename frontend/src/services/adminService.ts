import api from './api';

export interface InstructorApplication {
    id: string;
    userId: string;
    bio: string;
    qualifications: string;
    experience: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

export const adminService = {
    getPendingApplications: async () => {
        const response = await api.get<InstructorApplication[]>('/admin/instructor-applications/pending');
        return response.data;
    },

    approveApplication: async (id: string) => {
        const response = await api.post(`/admin/instructor-applications/${id}/approve`);
        return response.data;
    },

    rejectApplication: async (id: string, reason: string) => {
        const response = await api.post(`/admin/instructor-applications/${id}/reject`, { reason });
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    }
};
