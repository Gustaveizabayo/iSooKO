import { useState } from 'react';
import {
    Plus,
    Users,
    DollarSign,
    BookOpen,
    BarChart3,
    Loader2,
    Video,
    Eye,
    Pencil,
    GraduationCap,
    Trophy,
    Check,
    ArrowRight,
    ChevronDown,
    Star
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { dashboardService } from '../services/dashboardService';
import { courseService } from '../services/courseService';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const InstructorStudio = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const isInstructor = user?.role === 'INSTRUCTOR' || user?.role === 'ADMIN';
    const [isCreating, setIsCreating] = useState(false);
    const [isApplied, setIsApplied] = useState(false);
    const [newCourse, setNewCourse] = useState({ title: '', category: 'Computer Science', description: '', price: 0 });
    const queryClient = useQueryClient();

    const { data: dashboardData, isLoading } = useQuery({
        queryKey: ['instructor-dashboard-stats'],
        queryFn: () => dashboardService.getInstructorStats(),
        enabled: isInstructor
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => courseService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-dashboard-stats'] });
            setIsCreating(false);
            setNewCourse({ title: '', category: 'Computer Science', description: '', price: 0 });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => courseService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-dashboard-stats'] });
        }
    });

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate({
            ...newCourse,
            thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
            level: 'BEGINNER',
            duration: 0
        });
    };

    const handleDeleteCourse = (id: string) => {
        if (window.confirm('Are you sure you want to delete this masterclass? This action cannot be undone.')) {
            deleteMutation.mutate(id);
        }
    };

    const courses = dashboardData?.courses || [];

    const stats = [
        { label: 'Total Students', value: dashboardData?.overview?.totalEnrollments?.toLocaleString() || '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Course Revenue', value: `$${dashboardData?.overview?.totalRevenue?.toLocaleString() || '0'}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Avg. Rating', value: dashboardData?.overview?.averageRating?.toFixed(1) || '0.0', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Published', value: dashboardData?.overview?.publishedCourses || '0', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    if (!isInstructor) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />

                {/* Hero Section - Matching Image 0 */}
                <div className="bg-[#0f2238] pt-40 pb-32 text-center text-white relative overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
                        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-1.5 text-xs font-bold ring-1 ring-white/20 mb-10"
                        >
                            <span className="text-yellow-500">★</span> Join 500+ Expert Instructors
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl font-black sm:text-7xl tracking-tighter leading-tight"
                        >
                            Become an <span className="text-yellow-500 italic">iSooKO</span> Instructor
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed"
                        >
                            Share your expertise with thousands of eager learners and build your teaching career with us.
                        </motion.p>
                    </div>
                </div>

                {/* Features Section - Matching Image 0 - Centered Grid */}
                <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 -mt-24 relative z-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: 'Earn Revenue', desc: 'Keep 70% of your course earnings', icon: DollarSign, color: 'bg-orange-50 text-orange-500' },
                            { title: 'Reach Students', desc: 'Access our global student community', icon: Users, color: 'bg-blue-50 text-blue-500' },
                            { title: 'Build Your Brand', desc: 'Establish yourself as an expert', icon: Trophy, color: 'bg-yellow-50 text-yellow-500' },
                            { title: 'Make Impact', desc: 'Transform lives through education', icon: GraduationCap, color: 'bg-amber-50 text-amber-500' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center text-center group hover:-translate-y-3 transition-all duration-500"
                            >
                                <div className={`h-16 w-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-inner`}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Application Form Section - Refined for Professional Appearance */}
                <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="bg-slate-50 rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-sm">
                        <div className="mb-10 text-center sm:text-left">
                            <h2 className="text-4xl font-black tracking-tight text-[#0f2238]">
                                Apply to Become an <span className="text-yellow-500">Instructor</span>
                            </h2>
                            <p className="mt-3 text-slate-500 font-medium text-sm">
                                Submit your credentials and start your teaching journey with <span className="text-[#0f2238] font-bold">iSooKO</span>.
                            </p>
                        </div>

                        {isApplied ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20 bg-green-50 rounded-[2rem]"
                            >
                                <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                                    <Check className="h-12 w-12" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 mb-4">Application Submitted!</h3>
                                <p className="text-slate-600 max-w-md mx-auto font-medium">Our team will review your profile and get back to you within 3-5 business days. Check your email for updates.</p>
                            </motion.div>
                        ) : (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsApplied(true); window.scrollTo(0, 0); }}>
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Full Name</label>
                                        <input type="text" placeholder="Name" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 hover:border-slate-300 hover:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white transition-all outline-none" required />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Professional Bio</label>
                                        <textarea rows={4} placeholder="Description" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 hover:border-slate-300 hover:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white transition-all outline-none resize-none" required />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Areas of Expertise</label>
                                        <div className="flex gap-3">
                                            <input type="text" placeholder="Skill" className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-bold text-[#0f2238] placeholder-slate-400 hover:border-slate-300 hover:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white transition-all outline-none" />
                                            <button type="button" className="px-6 py-3.5 bg-white border border-slate-200 rounded-xl font-black text-slate-600 hover:bg-yellow-500 hover:text-[#0f2238] hover:border-yellow-500 transition-all uppercase text-[10px] tracking-widest whitespace-nowrap shadow-sm">Add Skill</button>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Years of Experience</label>
                                        <div className="relative">
                                            <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-bold text-slate-900 hover:border-slate-300 hover:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white transition-all outline-none cursor-pointer" required>
                                                <option value="" disabled selected>Choose your years of experience</option>
                                                <option value="0-1">0 to 1 year</option>
                                                <option value="1-3">1 to 3 years</option>
                                                <option value="3-5">3 to 5 years</option>
                                                <option value="5-10">5 to 10 years</option>
                                                <option value="10+">10+ years</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Portfolio/Website</label>
                                            <input type="url" placeholder="https://yourwebsite.com" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-bold text-[#0f2238] placeholder-slate-400 hover:border-slate-300 hover:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white transition-all outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">LinkedIn Profile</label>
                                            <input type="url" placeholder="https://linkedin.com/in/username" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-bold text-[#0f2238] placeholder-slate-400 hover:border-slate-300 hover:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white transition-all outline-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Motivation</label>
                                        <textarea rows={3} placeholder="Why do you want to teach on iSooKO?" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 font-bold text-slate-900 hover:border-slate-300 hover:bg-white focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 focus:bg-white transition-all outline-none resize-none" required />
                                    </div>
                                </div>

                                <button type="submit" className="w-full rounded-xl bg-yellow-500 py-5 text-base font-black text-[#0f2238] shadow-lg hover:bg-yellow-400 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest">
                                    Submit Application <ArrowRight className="h-5 w-5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* FAQ / Support Section */}
                <div className="bg-slate-50 py-24 mb-16 rounded-[4rem] mx-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <h3 className="text-3xl font-black text-[#0f2238] mb-4">Still have <span className="text-yellow-500">questions?</span></h3>
                        <p className="text-slate-500 mb-10 font-medium text-lg">Check out our Instructor FAQ or reach out to our dedicated support team.</p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="px-10 py-4 bg-white rounded-2xl font-black text-[#0f2238] border border-slate-200 shadow-sm hover:bg-yellow-500 hover:border-yellow-500 transition-all">Instructor FAQ</button>
                            <button className="px-10 py-4 bg-[#0f2238] rounded-2xl font-black text-white shadow-xl hover:bg-yellow-500 hover:text-[#0f2238] transition-all">Contact Support</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-32">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Instructor Studio</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage your curriculum and track student performance.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-5 text-sm font-black text-white shadow-2xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-[1.05] active:scale-[0.95]"
                    >
                        <Plus className="h-6 w-6" />
                        Create New Course
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm flex items-center justify-center"
                        >
                            <div className="flex flex-col items-center">
                                <div className={`flex h-16 w-16 items-center justify-center rounded-[1.25rem] ${stat.color} ${stat.bg} mb-4 shadow-inner`}>
                                    <stat.icon className="h-8 w-8" />
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-1">{stat.label}</div>
                                <div className="text-3xl font-black text-slate-900 text-center tracking-tighter">{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Course List Section */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900">Your Masterclasses</h2>
                        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                            <button className="rounded-xl px-6 py-2.5 text-xs font-black text-slate-500 hover:text-slate-900 transition-all uppercase tracking-widest">Drafts</button>
                            <button className="rounded-xl bg-white shadow-sm px-6 py-2.5 text-xs font-black text-slate-900 uppercase tracking-widest">Published</button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-96 items-center justify-center rounded-[3rem] border border-dashed border-slate-200 bg-white/50">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        </div>
                    ) : courses?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-slate-100 bg-white p-24 text-center">
                            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
                                <Video className="h-12 w-12" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">No courses yet</h3>
                            <p className="mb-10 text-slate-500 font-medium max-w-xs mx-auto">Transform your professional knowledge into a world-class course.</p>
                            <button onClick={() => setIsCreating(true)} className="px-10 py-4 bg-[#0f2238] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">Launch first course</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {courses?.map((course: any, i: number) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group flex flex-col gap-8 rounded-[2.5rem] border border-slate-50 bg-white p-8 shadow-sm transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] md:flex-row md:items-center"
                                >
                                    <div className="h-44 w-full flex-shrink-0 overflow-hidden rounded-3xl md:w-72 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                                        <img src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                                    </div>

                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <div className="mb-3 flex items-center gap-3">
                                                <span className="rounded-full bg-blue-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600">{course.category}</span>
                                                <span className="text-[10px] font-bold text-slate-300">• Published Aug 20, 2025</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        </div>

                                        <div className="flex flex-wrap gap-12 border-t border-slate-50 pt-6">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Enrolled</span>
                                                <span className="text-xl font-black text-slate-900 tracking-tight">{course._count?.enrollments || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</span>
                                                <span className="text-xl font-black text-slate-900 tracking-tight">${(course.price * (course._count?.enrollments || 0)).toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</span>
                                                <div className="flex items-center gap-1.5 text-xl font-black text-amber-500 tracking-tight">
                                                    <span>4.8</span>
                                                    <Trophy className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col gap-3">
                                        <button className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm" title="View Course">
                                            <Eye className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={() => navigate(`/instructor/Pencil/${course.id}`)}
                                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"
                                            title="Pencil Course"
                                        >
                                            <Pencil className="h-6 w-6" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCourse(course.id)}
                                            disabled={deleteMutation.isPending}
                                            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50"
                                            title="Delete Course"
                                        >
                                            <Plus className="h-6 w-6 rotate-45" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Insights Section */}
                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Insights Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            Recent Enrollments
                            <span className="rounded-full bg-blue-100 text-blue-600 px-2 py-0.5 text-xs font-black">
                                {dashboardData?.recentEnrollments?.length || 0}
                            </span>
                        </h2>
                        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Student</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Course</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {dashboardData?.recentEnrollments?.map((enrollment: any, i: number) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600">
                                                        {enrollment.user?.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900">{enrollment.user?.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-600">{enrollment.course?.title}</td>
                                            <td className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase">{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {!dashboardData?.recentEnrollments?.length && (
                                <div className="p-12 text-center text-slate-400 italic text-xs">No recent enrollments.</div>
                            )}
                        </div>
                    </div>

                    {/* Reviews & Feedback */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            Top Feedback
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        </h2>
                        <div className="space-y-4">
                            {dashboardData?.recentReviews?.map((review: any, i: number) => (
                                <div key={i} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
                                    <div className="flex items-center gap-1 text-yellow-500 mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={star <= review.rating ? "h-3 w-3 fill-yellow-500" : "h-3 w-3 text-slate-200"} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600 italic leading-relaxed mb-4">"{review.comment}"</p>
                                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                                        <div className="text-[10px] font-black text-slate-900">{review.user?.name}</div>
                                        <div className="text-[9px] font-bold text-slate-400 truncate max-w-[100px]">{review.course?.title}</div>
                                    </div>
                                </div>
                            ))}
                            {!dashboardData?.recentReviews?.length && (
                                <div className="rounded-[2rem] border-2 border-dashed border-slate-100 p-12 text-center text-slate-400 italic text-xs">No reviews yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Create Course Modal */}
            {isCreating && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="w-full max-w-xl rounded-[3rem] bg-white p-12 shadow-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <button onClick={() => setIsCreating(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                <Plus className="h-8 w-8 rotate-45" />
                            </button>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">New Masterclass</h2>
                            <p className="mt-2 text-slate-500 font-medium">Create a curriculum that changes lives.</p>
                        </div>

                        <form onSubmit={handleCreateCourse} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Course Title</label>
                                <input
                                    type="text"
                                    required
                                    value={newCourse.title}
                                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                                    placeholder="e.g. Advanced AI Integration"
                                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-8 py-5 font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                                <select
                                    value={newCourse.category}
                                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-8 py-5 font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none appearance-none transition-all"
                                >
                                    <option>Computer Science</option>
                                    <option>Business & Strategy</option>
                                    <option>Art & Creative Direction</option>
                                    <option>Psychology & Human Behavior</option>
                                </select>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsCreating(false)} className="flex-1 rounded-[1.25rem] border-2 border-slate-50 py-5 text-sm font-black text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all uppercase tracking-widest">Discard</button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="flex-1 rounded-[1.25rem] bg-blue-600 py-5 text-sm font-black text-white shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all uppercase tracking-widest disabled:opacity-50"
                                >
                                    {createMutation.isPending ? 'Initializing...' : 'Initialize'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default InstructorStudio;

