import api from './api';

export interface PaymentSession {
    id: string;
    url: string;
}

export const paymentService = {
    createCheckoutSession: async (courseId: string) => {
        const response = await api.post<PaymentSession>(`/payments/create-checkout-session`, { courseId });
        return response.data;
    },

    verifyPayment: async (sessionId: string) => {
        const response = await api.get(`/payments/verify/${sessionId}`);
        return response.data;
    },

    getPaymentHistory: async () => {
        const response = await api.get('/payments/my-payments');
        return response.data;
    }
};
