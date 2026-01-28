import { Clock, CheckCircle2, TrendingUp, PlayCircle, Loader2, Download, Calendar, Award, Trophy } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { enrollmentService } from '../services/enrollmentService';
import { authService } from '../services/authService';
import { certificateService } from '../services/certificateService';
import confetti from 'canvas-confetti';

const StudentDashboard = () => {
    const user = authService.getCurrentUser();

    const { data: enrollments, isLoading } = useQuery({
        queryKey: ['my-enrollments'],
        queryFn: () => enrollmentService.getMyEnrollments(),
    });

    const stats = [
        { label: 'In Progress', value: enrollments?.filter((e: any) => e.status === 'ACTIVE').length || 0, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Completed', value: enrollments?.filter((e: any) => e.status === 'COMPLETED').length || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Avg. Score', value: (enrollments?.length > 0) ? '92%' : '0%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Hours', value: (enrollments?.length > 0) ? '12h' : '0h', icon: PlayCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header & Welcome Banner */}
                <div className="mb-10 relative overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-2xl">
                    {/* Background Video Animation */}
                    <div className="absolute inset-0 z-0">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="h-full w-full object-cover opacity-30 saturate-0 hover:saturate-100 transition-all duration-1000"
                        >
                            <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-at-night-42283-large.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
                    </div>

                    <div className="relative z-10 px-8 py-12 md:px-12 md:py-16">
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-blue-400 backdrop-blur-md"
                            >
                                <PlayCircle className="h-4 w-4" />
                                Welcome back
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl font-black text-white md:text-5xl"
                            >
                                {user?.name || 'Student'}'s Space
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-4 text-lg font-medium text-slate-300"
                            >
                                You've completed 75% of your weekly goal. Keep pushing towards your certification!
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-8 flex gap-4"
                            >
                                <button className="rounded-2xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-blue-900/40 hover:bg-blue-700 transition-all active:scale-95">
                                    Continue Learning
                                </button>
                                <button className="rounded-2xl bg-white/10 px-8 py-3 text-sm font-bold text-white backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all">
                                    View Schedule
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400">{stat.label}</div>
                                    <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Main Content: My Courses */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-extrabold text-slate-900">Currently Learning</h2>
                            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">View All</a>
                        </div>

                        {isLoading ? (
                            <div className="flex h-48 items-center justify-center bg-white rounded-3xl border border-slate-100">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        ) : enrollments?.length === 0 ? (
                            <div className="flex h-48 flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 space-y-4">
                                <p className="text-slate-500 font-medium">You haven't enrolled in any courses yet.</p>
                                <button className="text-blue-600 font-bold hover:underline">Browse Catalog</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {enrollments?.map((enrollment: any, i: number) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center gap-6 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                                    >
                                        <div className="h-24 w-40 flex-shrink-0 overflow-hidden rounded-2xl">
                                            <img src={enrollment.course?.thumbnailUrl || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800'} className="h-full w-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{enrollment.course?.title}</h3>
                                                <p className="text-xs font-medium text-slate-400">by Markus Chen</p>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-xs font-bold">
                                                    <span className="text-slate-500">Progress</span>
                                                    <span className="text-blue-600">45%</span>
                                                </div>
                                                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `45%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-blue-600 rounded-full"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                                                    {enrollment.status === 'COMPLETED' ? 'Completed' : 'Last accessed Today'}
                                                </span>
                                                <div className="flex gap-2">
                                                    {enrollment.status === 'COMPLETED' && (
                                                        <button
                                                            onClick={() => {
                                                                confetti({
                                                                    particleCount: 150,
                                                                    spread: 70,
                                                                    origin: { y: 0.6 },
                                                                    colors: ['#2563eb', '#10b981', '#f59e0b']
                                                                });
                                                                certificateService.getCertificate(enrollment.courseId);
                                                            }}
                                                            className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-1.5 text-xs font-bold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                                                        >
                                                            <Download className="h-3.5 w-3.5" />
                                                            Certificate
                                                        </button>
                                                    )}
                                                    <button className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-600 hover:text-white">
                                                        <PlayCircle className="h-3.5 w-3.5" />
                                                        {enrollment.status === 'COMPLETED' ? 'Review' : 'Continue'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Upcoming Sessions & Schedule */}
                    <div className="space-y-8">
                        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-slate-900">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Live Sessions
                            </h2>
                            <div className="space-y-4">
                                <div className="group relative flex items-start gap-4 rounded-2xl border-l-4 border-blue-600 bg-slate-50/50 p-4 transition-all hover:bg-blue-50/50">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-blue-600">Today, 2:00 PM</div>
                                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Q&A: Backend Security Protocols</div>
                                        <div className="text-[10px] font-medium text-slate-400">Microsoft Teams Session</div>
                                    </div>
                                </div>

                                <div className="group relative flex items-start gap-4 rounded-2xl border-l-4 border-slate-200 bg-white p-4 transition-all hover:bg-slate-50/50">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-slate-400">Tomorrow, 10:00 AM</div>
                                        <div className="text-sm font-bold text-slate-900">Workshop: ML Model Deployment</div>
                                        <div className="text-[10px] font-medium text-slate-400">Zoom Webinar</div>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-6 w-full rounded-2xl border-2 border-slate-100 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50">
                                View Full Calendar
                            </button>
                        </div>

                        {/* Recent Certificates Section */}
                        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-slate-900">
                                <Award className="h-5 w-5 text-blue-600" />
                                My Certificates
                            </h2>
                            <div className="space-y-4">
                                {!enrollments || enrollments?.filter((e: any) => e.status === 'COMPLETED').length === 0 ? (
                                    <p className="text-sm text-slate-400 font-medium text-center py-4">Finish a course to earn your first certificate!</p>
                                ) : (
                                    enrollments?.filter((e: any) => e.status === 'COMPLETED').map((e: any, i: number) => (
                                        <div key={i} className="flex flex-col gap-3 rounded-2xl bg-slate-50 p-4">
                                            <div className="text-sm font-bold text-slate-900 line-clamp-1">{e.course?.title}</div>
                                            <button
                                                onClick={() => certificateService.getCertificate(e.courseId)}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-white py-2 text-xs font-bold text-blue-600 border border-slate-100 hover:bg-blue-50 transition-all"
                                            >
                                                <Download className="h-3.5 w-3.5" /> Download PDF
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Achievement Card */}
                        <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-6 text-white shadow-xl shadow-blue-200">
                            <div className="relative z-10 space-y-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                                    <Trophy className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">New Milestone!</h3>
                                    <p className="text-sm text-blue-100">You've completed 10 lessons this week. Keep up the momentum!</p>
                                </div>
                                <button className="w-full rounded-2xl bg-white py-3 text-sm font-bold text-blue-600 shadow-lg transition-all hover:bg-blue-50">
                                    View Achievements
                                </button>
                            </div>
                            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
