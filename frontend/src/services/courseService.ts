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
    attachments?: { id: string; name: string; url: string; }[];
    modules?: any[];
    level?: string;
    status?: string;
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
    },

    create: async (data: any) => {
        const response = await api.post<Course>('/courses', data);
        return response.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.patch<Course>(`/courses/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },

    addModule: async (courseId: string, data: { title: string, order: number }) => {
        const response = await api.post(`/courses/${courseId}/modules`, data);
        return response.data;
    },

    addLesson: async (courseId: string, moduleId: string, data: { title: string, content: string, type: string, order: number, duration?: string }) => {
        const response = await api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data);
        return response.data;
    },

    uploadFile: async (file: File, courseId?: string, lessonId?: string) => {
        const formData = new FormData();
        formData.append('file', file);
        
        const params: any = {};
        if (courseId) params.courseId = courseId;
        if (lessonId) params.lessonId = lessonId;

        const response = await api.post('/uploads', formData, {
            params,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
