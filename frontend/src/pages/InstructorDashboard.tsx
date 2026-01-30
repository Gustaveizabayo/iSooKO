import { } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    BookOpen,
    Users,
    TrendingUp,
    Calendar,
    Pencil,
    Eye,
    Plus,
    BarChart3,
    Download,
    MessageSquare,
    Award,
    Clock,
    CircleCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { dashboardService } from '../services/dashboardService';
import { authService } from '../services/authService';

import { courseService } from '../services/courseService';

const InstructorDashboard = () => {
    const user = authService.getCurrentUser();

    const { data: dashboardData } = useQuery({
        queryKey: ['instructor-dashboard-stats'],
        queryFn: () => dashboardService.getInstructorStats(),
    });

    const { data: courses = [], isLoading: coursesLoading } = useQuery({
        queryKey: ['instructor-courses', user?.id],
        queryFn: () => courseService.getAll({ instructorId: user?.id }),
        enabled: !!user?.id
    });

    const stats = [
        // ... (keep existing stats) (I will include them in my replacement block or use StartLine carefully)
        {
            label: 'Total Courses',
            value: dashboardData?.overview?.totalCourses || 0,
            icon: BookOpen,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            change: '+2 this month'
        },
        {
            label: 'Total Enrollments',
            value: dashboardData?.overview?.totalEnrollments || 0,
            icon: Users,
            color: 'text-green-600',
            bg: 'bg-green-50',
            change: '+15 this week'
        },
        {
            label: 'Avg. Rating',
            value: `${dashboardData?.overview?.averageRating || 0}`,
            icon: TrendingUp,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            change: 'Based on reviews'
        },
        {
            label: 'Revenue',
            value: `$${dashboardData?.overview?.totalRevenue || 0}`,
            icon: Calendar, // Using Calendar as placeholder or swap to DollarSign if imported (keeping Calendar to minimize import changes)
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            change: 'Total earnings'
        },
    ];

    // Mock student attendance data (Keep for now)
    const recentAttendance = [
        { student: 'John Doe', course: 'Advanced JavaScript', status: 'PRESENT', date: 'Today, 10:00 AM' },
        { student: 'Jane Smith', course: 'React Fundamentals', status: 'ABSENT', date: 'Today, 2:00 PM' },
        { student: 'Mike Johnson', course: 'Node.js Backend', status: 'LATE', date: 'Yesterday, 9:00 AM' },
    ];

    // Mock messages (Keep for now)
    const messages = [
        { from: 'Sarah Williams', message: 'Question about Assignment 3', time: '10 min ago', unread: true },
        { from: 'Tom Brown', message: 'Thank you for the feedback!', time: '1 hour ago', unread: true },
        { from: 'Admin', message: 'New course approval pending', time: '2 hours ago', unread: false },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Instructor Dashboard</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage your courses and track student progress</p>
                        </div>
                        <Link
                            to="/instructor/courses/new"
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                        >
                            <Plus className="h-5 w-5" />
                            Create New Course
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</div>
                                <div className="text-xs font-medium text-green-600">{stat.change}</div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                        {/* Left Column: Course Management */}
                        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                            {/* Course Management */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" />
                                        My Courses
                                    </h2>
                                    <Link to="/instructor/courses" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                        View All →
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {courses.length === 0 && !coursesLoading && (
                                        <div className="text-center py-8 text-slate-500 font-medium">No courses found. Create your first course!</div>
                                    )}
                                    {courses.map((course: any, i: number) => (
                                        <motion.div
                                            key={course.id || i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                                        >
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-bold text-slate-900">{course.title}</h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${course.status === 'PUBLISHED'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {course.status || 'DRAFT'}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-4 text-xs">
                                                        <div>
                                                            <span className="text-slate-500 font-medium">Students:</span>
                                                            <span className="ml-1 font-bold text-slate-900">{course._count?.enrollments || 0}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 font-medium">Completion:</span>
                                                            <span className="ml-1 font-bold text-green-600">{course.completion || 0}%</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-500 font-medium">Attendance:</span>
                                                            <span className="ml-1 font-bold text-blue-600">{course.attendance || 0}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/course/${course.id}`}
                                                        className="p-2 bg-white rounded-lg hover:bg-slate-200 transition-colors"
                                                        title="View Course"
                                                    >
                                                        <Eye className="h-4 w-4 text-slate-600" />
                                                    </Link>
                                                    <Link
                                                        to={`/instructor/Pencil/${course.id}`}
                                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        title="Pencil Course"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>


                            {/* Attendance Tracking */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Recent Attendance
                                    </h2>
                                    <Link to="/instructor/attendance" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        View Full Report
                                        <Download className="h-4 w-4" />
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {recentAttendance.map((record, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm">{record.student}</h3>
                                                <p className="text-xs text-slate-500 font-medium">{record.course}</p>
                                                <p className="text-xs text-slate-400 mt-1">{record.date}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                                                record.status === 'ABSENT' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Gradebook Preview */}
                            <div className="bg-gradient-to-br from-[#0f2238] to-[#1a3a5c] rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <BarChart3 className="h-5 w-5" />
                                        Gradebook & Assessments
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black mb-1">156</div>
                                        <div className="text-xs font-bold text-white/80">Assignments Graded</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black mb-1">23</div>
                                        <div className="text-xs font-bold text-white/80">Pending Reviews</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black mb-1">4.6</div>
                                        <div className="text-xs font-bold text-white/80">Avg. Rating</div>
                                    </div>
                                </div>
                                <Link
                                    to="/instructor/gradebook"
                                    className="block text-center py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors"
                                >
                                    Open Gradebook →
                                </Link>
                            </div>
                        </div>

                        {/* Right Column: Profile & Messages */}
                        <div className="space-y-6 lg:space-y-8">
                            {/* Profile Quick Pencil */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-black text-slate-900">Profile</h2>
                                    <Link to="/profile" className="text-blue-600 hover:text-blue-700">
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-3xl mx-auto mb-3">
                                        {user?.name?.charAt(0) || 'I'}
                                    </div>
                                    <h3 className="font-bold text-slate-900">{user?.name}</h3>
                                    <p className="text-xs text-slate-500 font-medium mb-1">{user?.email}</p>
                                    <p className="text-xs text-blue-600 font-bold mb-4">Instructor</p>
                                    <Link
                                        to="/profile"
                                        className="block w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm text-slate-700 transition-colors"
                                    >
                                        Pencil Profile
                                    </Link>
                                </div>
                            </div>

                            {/* Messages & Announcements */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                        <MessageSquare className="h-5 w-5 text-blue-500" />
                                        Messages
                                    </h2>
                                    <span className="h-6 w-6 rounded-full bg-red-500 text-white text-xs font-black flex items-center justify-center">
                                        2
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`p-3 rounded-xl transition-colors ${msg.unread ? 'bg-blue-50 hover:bg-blue-100' : 'bg-slate-50 hover:bg-slate-100'
                                            }`}>
                                            <div className="flex items-start gap-2">
                                                {msg.unread && (
                                                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900">{msg.from}</p>
                                                    <p className="text-xs text-slate-600 font-medium truncate">{msg.message}</p>
                                                    <p className="text-xs text-slate-400 mt-1">{msg.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                                    Send Announcement
                                </button>
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-4">Quick Stats</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                                        <div className="flex items-center gap-2">
                                            <CircleCheck className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-bold text-slate-700">Active Students</span>
                                        </div>
                                        <span className="text-lg font-black text-green-600">105</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5 text-orange-600" />
                                            <span className="text-sm font-bold text-slate-700">Avg. Response Time</span>
                                        </div>
                                        <span className="text-lg font-black text-orange-600">2.5h</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-5 w-5 text-blue-600" />
                                            <span className="text-sm font-bold text-slate-700">Certificates Issued</span>
                                        </div>
                                        <span className="text-lg font-black text-blue-600">42</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;

