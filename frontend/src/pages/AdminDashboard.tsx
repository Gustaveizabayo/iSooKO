import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    ShieldCheck,
    Users,
    BookOpen,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    ExternalLink,
    Loader2,
    TrendingUp,
    Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { adminService, type InstructorApplication } from '../services/adminService';

const AdminDashboard = () => {
    const queryClient = useQueryClient();

    // Fetch pending applications
    const { data: applications, isLoading } = useQuery({
        queryKey: ['pending-instructor-applications'],
        queryFn: () => adminService.getPendingApplications(),
    });

    // Approval Mutation
    const approveMutation = useMutation({
        mutationFn: (id: string) => adminService.approveApplication(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-instructor-applications'] });
        },
    });

    // Rejection Mutation
    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => adminService.rejectApplication(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pending-instructor-applications'] });
        },
    });

    const stats = [
        { label: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Instructors', value: applications?.length || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Total Courses', value: '458', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Revenue (MTD)', value: '$45,210', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Admin Control Center</h1>
                        <p className="text-slate-500 font-medium">System-wide monitoring and instructor lifecycle management.</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-bold text-white shadow-lg">
                        <ShieldCheck className="h-4 w-4" />
                        Super Admin Mode
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`rounded-2xl ${stat.bg} p-3 ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Application List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Instructor Applications
                            <span className="rounded-full bg-amber-100 text-amber-600 px-2 py-0.5 text-xs font-black">
                                {applications?.length || 0}
                            </span>
                        </h2>

                        {isLoading ? (
                            <div className="flex h-64 items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        ) : applications?.length === 0 ? (
                            <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 font-medium">
                                No new applications to review.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {applications?.map((app: InstructorApplication) => (
                                    <motion.div
                                        key={app.id}
                                        className="group rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black">
                                                        {app.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-slate-900 dark:text-white">{app.user?.name}</h3>
                                                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                                            <Mail className="h-3 w-3" />
                                                            {app.user?.email}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience & Bio</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                                        "{app.bio}"
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {app.qualifications.split(',').map((tag, i) => (
                                                        <span key={i} className="rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex gap-2 md:flex-col">
                                                <button
                                                    onClick={() => approveMutation.mutate(app.id)}
                                                    disabled={approveMutation.isPending}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => rejectMutation.mutate({ id: app.id, reason: 'Does not meet requirements' })}
                                                    disabled={rejectMutation.isPending}
                                                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white dark:bg-slate-800 border border-red-100 dark:border-red-900/30 px-6 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-50"
                                                >
                                                    <XCircle className="h-4 w-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar Logs */}
                    <div className="space-y-8">
                        <div className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center justify-between text-lg font-black text-slate-900 dark:text-white">
                                System Alerts
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { msg: 'Server Load Peak (92%)', time: '1h ago', type: 'error' },
                                    { msg: 'New Course Published', time: '4h ago', type: 'info' },
                                    { msg: 'Database Backup Complete', time: '10h ago', type: 'success' },
                                ].map((log, i) => (
                                    <div key={i} className="flex gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${log.type === 'error' ? 'bg-red-500' : log.type === 'info' ? 'bg-blue-500' : 'bg-green-500'
                                            }`} />
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-900 dark:text-white">{log.msg}</p>
                                            <p className="text-[10px] text-slate-400 font-medium">{log.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-100 dark:border-slate-800 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
                                View System Logs
                                <ExternalLink className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
