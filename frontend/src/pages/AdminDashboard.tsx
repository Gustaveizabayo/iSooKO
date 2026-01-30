import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Users,
    GraduationCap,
    BookOpen,
    Calendar,
    Shield,
    Settings,
    Download,
    Plus,
    Pencil,
    Trash2,
    Search,
    Filter,
    BarChart3,
    Activity,
    CircleAlert,
    CircleCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { dashboardService } from '../services/dashboardService';
// import { authService } from '../services/authService';
import { courseService } from '../services/courseService';

const AdminDashboard = () => {
    // const user = authService.getCurrentUser();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: dashboardData } = useQuery({
        queryKey: ['admin-dashboard-stats'],
        queryFn: () => dashboardService.getAdminStats(),
    });

    const { data: courses = [] } = useQuery({
        queryKey: ['admin-courses'],
        queryFn: () => courseService.getAll(),
    });

    // ... (keep stats array definition)
    const stats = [
        // ... (keep stats content)
        {
            label: 'Total Users', // Renamed from Students as API gives totalUsers
            value: dashboardData?.overview?.totalUsers || 0,
            icon: Users,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            change: '+12 this week'
        },
        {
            label: 'Total Instructors',
            value: 0, // Not available in overview interface yet
            icon: GraduationCap,
            color: 'text-green-600',
            bg: 'bg-green-50',
            change: '+3 this month'
        },
        {
            label: 'Total Courses',
            value: dashboardData?.overview?.totalCourses || 0,
            icon: BookOpen,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            change: '+5 this month'
        },
        {
            label: 'System Health',
            value: '98%',
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-50',
            change: 'Excellent'
        },
    ];

    // Mock student activity (Keep mock for now as we don't have activity log API)
    const recentActivity = [
        { user: 'John Doe', action: 'Enrolled in Advanced JavaScript', time: '5 min ago', type: 'enrollment' },
        { user: 'Jane Smith', action: 'Completed React Fundamentals', time: '15 min ago', type: 'completion' },
        { user: 'Mike Johnson', action: 'Submitted assignment', time: '1 hour ago', type: 'submission' },
        { user: 'Sarah Williams', action: 'Started Data Science Basics', time: '2 hours ago', type: 'enrollment' },
    ];

    // Mock attendance overview (Keep mock)
    const attendanceOverview = {
        totalSessions: 156,
        avgAttendance: 87,
        present: 136,
        absent: 12,
        late: 8
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* ... (Header) */}
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Admin Dashboard</h1>
                            <p className="text-slate-500 font-medium mt-1">System overview and management</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                to="/admin/courses/new"
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                Add Course
                            </Link>
                            <Link
                                to="/admin/instructors/assign"
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors text-sm"
                            >
                                <GraduationCap className="h-4 w-4" />
                                Assign Instructor
                            </Link>
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
                        {/* Left Column: Main Management */}
                        <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                            {/* Course Management Table */}
                            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                                <div className="p-6 border-b border-slate-100">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5" />
                                            Course Management
                                        </h2>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <div className="relative flex-1 sm:flex-initial">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search courses..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 w-full sm:w-64"
                                                />
                                            </div>
                                            <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                                <Filter className="h-4 w-4 text-slate-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Course</th>
                                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Instructor</th>
                                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Students</th>
                                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map((course: any, i: number) => (
                                                <motion.tr
                                                    key={course.id || i}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="hover:bg-slate-50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900">{course.title}</div>
                                                            <div className="text-xs text-slate-500 font-medium">{course.category}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-slate-700">{course.instructor?.name || 'Unassigned'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-slate-900">{course._count?.enrollments || 0}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${course.status === 'PUBLISHED'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {course.status || 'PUBLISHED'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Pencil">
                                                                <Pencil className="h-4 w-4 text-blue-600" />
                                                            </button>
                                                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Student Activity Summary */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Recent Activity
                                </h2>
                                <div className="space-y-3">
                                    {recentActivity.map((activity, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.type === 'enrollment' ? 'bg-blue-100' :
                                                activity.type === 'completion' ? 'bg-green-100' :
                                                    'bg-orange-100'
                                                }`}>
                                                {activity.type === 'enrollment' ? <Users className="h-5 w-5 text-blue-600" /> :
                                                    activity.type === 'completion' ? <CircleCheck className="h-5 w-5 text-green-600" /> :
                                                        <BookOpen className="h-5 w-5 text-orange-600" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900">{activity.user}</p>
                                                <p className="text-xs text-slate-600 font-medium">{activity.action}</p>
                                                <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attendance Charts */}
                            <div className="bg-gradient-to-br from-[#0f2238] to-[#1a3a5c] rounded-2xl p-6 text-white">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-black flex items-center gap-2">
                                        <Calendar className="h-5 w-5" />
                                        Attendance Overview
                                    </h2>
                                    <Link to="/admin/attendance" className="text-sm font-bold text-white/80 hover:text-white flex items-center gap-1">
                                        View Reports
                                        <Download className="h-4 w-4" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black mb-1">{attendanceOverview.totalSessions}</div>
                                        <div className="text-xs font-bold text-white/80">Total Sessions</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black text-green-300 mb-1">{attendanceOverview.avgAttendance}%</div>
                                        <div className="text-xs font-bold text-white/80">Avg. Attendance</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black text-green-300 mb-1">{attendanceOverview.present}</div>
                                        <div className="text-xs font-bold text-white/80">Present</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black text-red-300 mb-1">{attendanceOverview.absent}</div>
                                        <div className="text-xs font-bold text-white/80">Absent</div>
                                    </div>
                                    <div className="text-center p-4 bg-white/10 rounded-xl backdrop-blur">
                                        <div className="text-2xl font-black text-yellow-300 mb-1">{attendanceOverview.late}</div>
                                        <div className="text-xs font-bold text-white/80">Late</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Quick Actions & System */}
                        <div className="space-y-6 lg:space-y-8">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-4">Quick Actions</h2>
                                <div className="space-y-2">
                                    <Link to="/admin/courses/new" className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group">
                                        <Plus className="h-5 w-5 text-blue-600" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-blue-600">Add Course</span>
                                    </Link>
                                    <Link to="/admin/instructors/assign" className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition-colors group">
                                        <GraduationCap className="h-5 w-5 text-green-600" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-green-600">Assign Instructor</span>
                                    </Link>
                                    <Link to="/admin/reports" className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors group">
                                        <Download className="h-5 w-5 text-orange-600" />
                                        <span className="text-sm font-bold text-slate-700 group-hover:text-orange-600">Export Reports</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Account Management */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-red-500" />
                                    Security & Accounts
                                </h2>
                                <div className="space-y-3">
                                    <Link to="/admin/security/emails" className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <p className="text-sm font-bold text-slate-900">Change Emails</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Manage user email addresses</p>
                                    </Link>
                                    <Link to="/admin/security/reset" className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <p className="text-sm font-bold text-slate-900">Reset Accounts</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Reset passwords & accounts</p>
                                    </Link>
                                    <Link to="/admin/security/permissions" className="block p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                        <p className="text-sm font-bold text-slate-900">Manage Permissions</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">Control user access levels</p>
                                    </Link>
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-slate-500" />
                                    System Status
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                                        <div className="flex items-center gap-2">
                                            <CircleCheck className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-bold text-slate-700">Database</span>
                                        </div>
                                        <span className="text-xs font-bold text-green-600">Online</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50">
                                        <div className="flex items-center gap-2">
                                            <CircleCheck className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-bold text-slate-700">API Server</span>
                                        </div>
                                        <span className="text-xs font-bold text-green-600">Healthy</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-50">
                                        <div className="flex items-center gap-2">
                                            <CircleAlert className="h-5 w-5 text-yellow-600" />
                                            <span className="text-sm font-bold text-slate-700">Storage</span>
                                        </div>
                                        <span className="text-xs font-bold text-yellow-600">78% Used</span>
                                    </div>
                                </div>
                            </div>

                            {/* Instructor Performance */}
                            <div className="bg-white rounded-2xl p-6 border border-slate-100">
                                <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                                    Top Instructors
                                </h2>
                                <div className="space-y-3">
                                    {['Dr. Sarah Johnson', 'Prof. Mike Chen', 'Dr. Emily Brown'].map((name, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-sm">
                                                    {name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-slate-700">{name}</span>
                                            </div>
                                            <span className="text-xs font-bold text-green-600">4.{9 - i}/5.0</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

