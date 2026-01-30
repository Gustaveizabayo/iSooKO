import { } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    TrendingUp,
    Clock,
    CircleCheck,
    BookOpen,
    Calendar,
    Activity,
    CirclePlay,
    Pencil,
    Bell,
    Target,
    ArrowRight,
    CircleHelp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { dashboardService } from '../services/dashboardService';
import { attendanceService } from '../services/attendanceService';
import { authService } from '../services/authService';
// import ExamModal from '../components/exams/ExamModal';

const StudentDashboard = () => {
    const user = authService.getCurrentUser();
    // const [selectedExam, setSelectedExam] = useState<any>(null);
    // const [isExamModalOpen, setIsExamModalOpen] = useState(false);

    const { data: dashboardData } = useQuery({
        queryKey: ['student-dashboard-stats'],
        queryFn: () => dashboardService.getStudentStats(),
    });

    const { data: attendanceData } = useQuery({
        queryKey: ['my-attendance'],
        queryFn: () => attendanceService.getMyAttendance(),
    });

    // Calculate attendance stats
    const totalAttendance = attendanceData?.length || 0;
    const presentCount = attendanceData?.filter((a: any) => a.status === 'PRESENT')?.length || 0;
    const absentCount = attendanceData?.filter((a: any) => a.status === 'ABSENT')?.length || 0;
    const executedCount = attendanceData?.filter((a: any) => a.status === 'LATE' || a.status === 'EXCUSED')?.length || 0;
    const presentPercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;
    const absentPercentage = totalAttendance > 0 ? Math.round((absentCount / totalAttendance) * 100) : 0;
    const executedPercentage = totalAttendance > 0 ? Math.round((executedCount / totalAttendance) * 100) : 0;

    const stats = [
        {
            label: 'Active Courses',
            value: dashboardData?.overview?.activeEnrollments || 0,
            icon: BookOpen,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            change: '+2 this month'
        },
        {
            label: 'Completed',
            value: dashboardData?.overview?.completedEnrollments || 0,
            icon: CircleCheck,
            color: 'text-green-600',
            bg: 'bg-green-50',
            change: 'Great progress!'
        },
        {
            label: 'Overall Progress',
            value: `${dashboardData?.overview?.overallProgress || 0}%`,
            icon: TrendingUp,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            change: '+12% this week'
        },
        {
            label: 'Study Hours',
            value: '24h',
            icon: Clock,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            change: '8h this week'
        },
    ];

    const recentCourses = dashboardData?.enrollments?.slice(0, 3) || [];

    // Mock upcoming lessons
    const upcomingLessons = [
        { title: 'Advanced JavaScript Concepts', course: 'Web Development', time: 'Today, 2:00 PM', type: 'Live Session' },
        { title: 'React Hooks Deep Dive', course: 'React Mastery', time: 'Tomorrow, 10:00 AM', type: 'Video Lesson' },
        { title: 'Final Project Submission', course: 'Full Stack Development', time: 'Jan 30, 11:59 PM', type: 'Deadline' },
    ];

    // Mock announcements
    const announcements = [
        { title: 'New Course Available: AI Fundamentals', time: '2 hours ago', type: 'info' },
        { title: 'System Maintenance Scheduled', time: '1 day ago', type: 'warning' },
        { title: 'Congratulations on completing React Basics!', time: '3 days ago', type: 'success' },
    ];

    /*
    const upcomingExams = [
        { id: 1, title: 'JavaScript Fundamentals Final', course: 'Web Development', duration: 60, date: 'Today, 3:00 PM', status: 'upcoming' },
        { id: 2, title: 'React Components Quiz', course: 'React Mastery', duration: 30, date: 'Tomorrow, 10:00 AM', status: 'upcoming' },
        { id: 3, title: 'Full Stack Project Assessment', course: 'Full Stack Development', duration: 90, date: 'Feb 2, 2:00 PM', status: 'scheduled' },
    ];

    const handleOpenExam = (exam: any) => {
        setSelectedExam(exam);
        setIsExamModalOpen(true);
    };
    */

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Dashboard Overview</h1>
                            <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.name}!</p>
                        </div>
                        <div className="hidden md:flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current Streak</p>
                                <p className="text-2xl font-black text-orange-500">7 days 🔥</p>
                            </div>
                        </div>
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
                        {/* Left Column: Main Content */}
                        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                            {/* Attendance Summary Widget */}
                            <div className="bg-gradient-to-br from-[#0f2238] to-[#1a3a5c] rounded-2xl p-6 text-white shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Attendance Summary
                                    </h2>
                                    <Activity className="h-5 w-5 opacity-80" />
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black mb-1">{totalAttendance}</div>
                                        <div className="text-xs font-bold text-white/80">Total Sessions</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black text-green-300 mb-1">{presentPercentage}%</div>
                                        <div className="text-xs font-bold text-white/80">Present</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black text-red-300 mb-1">{absentPercentage}%</div>
                                        <div className="text-xs font-bold text-white/80">Absent</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black text-yellow-300 mb-1">{executedPercentage}%</div>
                                        <div className="text-xs font-bold text-white/80">Executed</div>
                                    </div>
                                </div>

                                <Link
                                    to="/dashboard/attendance"
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-colors"
                                >
                                    View Full Attendance Report
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {/* Course Overview */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black text-slate-900">My Courses</h2>
                                    <Link to="/dashboard/courses" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                        View All Courses
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>

                                {recentCourses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-500 font-medium mb-4">No courses enrolled yet</p>
                                        <Link to="/courses" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                                            Browse Courses
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {recentCourses.map((enrollment: any, i: number) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                                            >
                                                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                                                    {enrollment.course?.title?.charAt(0) || 'C'}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                                                        {enrollment.course?.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-500 font-medium">{enrollment.course?.category}</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                                                                style={{ width: `${enrollment.progress || 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-600">{enrollment.progress || 0}%</span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/learn/${enrollment.courseId}`}
                                                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <CirclePlay className="h-4 w-4" />
                                                    Continue
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Upcoming Lessons / Deadlines */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Target className="h-5 w-5 text-orange-500" />
                                    Upcoming Lessons & Deadlines
                                </h2>
                                <div className="space-y-3">
                                    {upcomingLessons.map((lesson, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                                <Clock className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm">{lesson.title}</h3>
                                                <p className="text-xs text-slate-500 font-medium">{lesson.course}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs font-bold text-orange-600">{lesson.time}</span>
                                                    <span className="text-xs text-slate-400">•</span>
                                                    <span className="text-xs text-slate-500">{lesson.type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Sidebar Widgets */}
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
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <h3 className="font-bold text-slate-900">{user?.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4">{user?.email}</p>
                                    <Link
                                        to="/profile"
                                        className="block w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-sm text-slate-700 transition-colors"
                                    >
                                        Pencil Profile
                                    </Link>
                                </div>
                            </div>

                            {/* Announcements & Messages */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <Bell className="h-5 w-5 text-yellow-500" />
                                    Announcements
                                </h2>
                                <div className="space-y-3">
                                    {announcements.map((announcement, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className="flex items-start gap-2">
                                                <div className={`h-2 w-2 rounded-full mt-2 flex-shrink-0 ${announcement.type === 'success' ? 'bg-green-500' :
                                                    announcement.type === 'warning' ? 'bg-yellow-500' :
                                                        'bg-blue-500'
                                                    }`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900">{announcement.title}</p>
                                                    <p className="text-xs text-slate-500 font-medium mt-1">{announcement.time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-4">Quick Actions</h2>
                                <div className="space-y-2">
                                    <Link to="/courses" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                        <BookOpen className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Browse Courses</span>
                                    </Link>
                                    <Link to="/dashboard/notifications" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                        <Bell className="h-5 w-5 text-yellow-600" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-yellow-600">Notifications</span>
                                    </Link>
                                    <Link to="/dashboard/help" className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                                        <CircleHelp className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-green-600">Help & Support</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Modal */}
            {/*
            {selectedExam && (
                <ExamModal
                    isOpen={isExamModalOpen}
                    onClose={() => setIsExamModalOpen(false)}
                    exam={selectedExam}
                />
            )}
            */}
        </div>
    );
};

export default StudentDashboard;

