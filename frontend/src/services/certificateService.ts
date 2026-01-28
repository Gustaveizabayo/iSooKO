import api from './api';

export const certificateService = {
    getCertificate: async (courseId: string) => {
        // This would typically return a blob or a URL to the PDF
        const response = await api.get(`/certificates/course/${courseId}`, {
            responseType: 'blob'
        });
        return response.data;
    },

    verifyCertificate: async (certificateId: string) => {
        const response = await api.get(`/certificates/verify/${certificateId}`);
        return response.data;
    },

    getMyCertificates: async () => {
        const response = await api.get('/certificates/my-certificates');
        return response.data;
    }
};
