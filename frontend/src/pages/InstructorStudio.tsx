import { useState } from 'react';
import {
    Plus,
    Users,
    DollarSign,
    BookOpen,
    BarChart3,
    MoreHorizontal,
    Loader2,
    Video,
    Eye,
    Edit3
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { instructorService } from '../services/instructorService';

const InstructorStudio = () => {
    const [isCreating, setIsCreating] = useState(false);

    const { data: courses, isLoading } = useQuery({
        queryKey: ['instructor-courses'],
        queryFn: () => instructorService.getMyCourses(),
    });

    const stats = [
        { label: 'Total Students', value: '1,284', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Course Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Avg. Rating', value: '4.9', icon: BarChart3, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Courses', value: courses?.length || '0', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Instructor Studio</h1>
                        <p className="text-slate-500 font-medium">Manage your curriculum and track student performance.</p>
                    </div>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="h-5 w-5" />
                        Create New Course
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-100/30"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
                                    <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Course List Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900">Your Masterclasses</h2>
                        <div className="flex gap-2">
                            <button className="rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">Drafts</button>
                            <button className="rounded-xl bg-slate-900 border border-slate-900 px-4 py-2 text-xs font-bold text-white">Published</button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/50">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                        </div>
                    ) : courses?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                                <Video className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No courses yet</h3>
                            <p className="mb-6 text-sm text-slate-500">Transform your knowledge into a world-class course.</p>
                            <button onClick={() => setIsCreating(true)} className="text-blue-600 font-bold hover:underline">Launch your first course</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {courses?.map((course: any, i: number) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50 md:flex-row md:items-center"
                                >
                                    <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-56">
                                        <img src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'} className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="" />
                                    </div>

                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <div className="mb-1 flex items-center gap-2">
                                                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-blue-600">{course.category}</span>
                                                <span className="text-[10px] font-bold text-slate-300">• Published Aug 20, 2025</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                                        </div>

                                        <div className="flex flex-wrap gap-8">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled</span>
                                                <span className="text-lg font-bold text-slate-900">{course._count?.enrollments || 0}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Earnings</span>
                                                <span className="text-lg font-bold text-slate-900">${(course.price * (course._count?.enrollments || 0)).toLocaleString()}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                                                <div className="flex items-center gap-1 text-lg font-bold text-amber-500">
                                                    <span>4.8</span>
                                                    <BarChart3 className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                                            <Edit3 className="h-5 w-5" />
                                        </button>
                                        <button className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Simple Modal Placeholder for Creating Course */}
            {isCreating && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
                    >
                        <h2 className="mb-6 text-2xl font-black text-slate-900">New Masterclass</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Course Title</label>
                                <input type="text" placeholder="e.g. Advanced AI Integration" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold focus:border-blue-600 focus:bg-white focus:outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
                                <select className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold focus:border-blue-600 focus:bg-white focus:outline-none">
                                    <option>Computer Science</option>
                                    <option>Business</option>
                                    <option>Art & Design</option>
                                </select>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setIsCreating(false)} className="flex-1 rounded-2xl border-2 border-slate-100 py-4 text-sm font-bold text-slate-400 hover:bg-slate-50">Discard</button>
                                <button className="flex-1 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-xl shadow-blue-200 hover:bg-blue-700">Initialize Course</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default InstructorStudio;
