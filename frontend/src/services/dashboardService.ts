import api from './api';

export interface AdminDashboardData {
    overview: {
        totalUsers: number;
        activeUsers: number;
        totalCourses: number;
        publishedCourses: number;
        totalEnrollments: number;
        activeEnrollments: number;
        totalRevenue: number;
        totalTransactions: number;
    };
    userStats: any[];
    courseStats: any[];
    enrollmentStats: any[];
    recentActivities: any[];
    topCourses: any[];
}

export interface StudentDashboardData {
    student: {
        id: string;
        name: string;
        email: string;
    };
    overview: {
        totalEnrollments: number;
        activeEnrollments: number;
        completedEnrollments: number;
        totalLessons: number;
        completedLessons: number;
        overallProgress: number;
    };
    enrollments: any[];
    recentActivity: any[];
    upcomingLessons: any[];
    recommendedCourses: any[];
}

export interface InstructorDashboardData {
    overview: {
        totalCourses: number;
        publishedCourses: number;
        totalEnrollments: number;
        totalRevenue: number;
        averageRating: number;
    };
    courses: any[];
    recentEnrollments: any[];
    recentReviews: any[];
    payments: any[];
}

export const dashboardService = {
    getAdminStats: async () => {
        const response = await api.get<AdminDashboardData>('/dashboard/admin');
        return response.data;
    },

    getStudentStats: async () => {
        const response = await api.get<StudentDashboardData>('/dashboard/me/student');
        return response.data;
    },

    getInstructorStats: async () => {
        const response = await api.get<InstructorDashboardData>('/dashboard/me/instructor');
        return response.data;
    },

    getRecentActivity: async () => {
        const response = await api.get('/dashboard/recent-activity');
        return response.data;
    },

    getInstructorAnalytics: async (startDate?: string, endDate?: string) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const response = await api.get(`/dashboard/me/instructor/analytics?${params.toString()}`);
        return response.data;
    }
};
