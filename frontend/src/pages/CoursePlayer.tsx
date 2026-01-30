import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    CirclePlay,
    FileText,
    CircleCheck,
    Settings,
    MessageSquare,
    Paperclip,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProctoringUI from '../components/proctoring/ProctoringUI';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { analyticsService } from '../services/analyticsService';
import { attendanceService } from '../services/attendanceService';
import { useEffect, useRef } from 'react';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [activeModule, setActiveModule] = useState(0);
    const [activeLesson, setActiveLesson] = useState(0);
    const [sidebarOpen] = useState(true);

    // Fetch real course content
    const { data: course, isLoading } = useQuery({
        queryKey: ['course-content', courseId],
        queryFn: () => courseService.getById(courseId as string),
        enabled: !!courseId,
    });

    // Use real data if available, otherwise fallback to high-quality mock data structure
    const modules = (course as any)?.modules || [
        {
            title: "Foundations of Modern Development",
            lessons: [
                { title: "Course Introduction", type: "video", duration: "05:00", active: true },
                { title: "Environment Configuration", type: "video", duration: "12:30", active: false },
                { title: "Hello World: Deep Dive", type: "reading", duration: "10m", active: false },
            ]
        },
        {
            title: "Advanced Architecture Patterns",
            lessons: [
                { title: "Dependency Injection Explained", type: "video", duration: "18:20", active: false },
                { title: "Middleware & Interceptors", type: "video", duration: "22:15", active: false },
                { title: "Practical Application: Building a Service", type: "quiz", duration: "15m", active: false },
            ]
        }
    ];

    // Track Video Progress
    const watchTimeRef = useRef(0);
    useEffect(() => {
        const interval = setInterval(() => {
            if (courseId && modules[activeModule] && modules[activeModule].lessons[activeLesson]) {
                watchTimeRef.current += 10;
                analyticsService.trackProgress({
                    courseId: courseId as string,
                    lessonId: modules[activeModule].lessons[activeLesson].id || modules[activeModule].lessons[activeLesson].title,
                    watchedDuration: watchTimeRef.current,
                    totalDuration: 3600,
                    lastPosition: watchTimeRef.current
                }).catch(err => console.error("Analytics failed:", err));
            }
        }, 10000);

        // Log Attendance when lesson starts
        if (modules[activeModule] && modules[activeModule].lessons[activeLesson]) {
            const lesson = modules[activeModule].lessons[activeLesson];
            if (lesson.id) {
                attendanceService.logPresence(lesson.id).catch(err => console.error("Attendance log failed:", err));
            }
        }

        return () => {
            clearInterval(interval);
            watchTimeRef.current = 0;
        };
    }, [courseId, activeModule, activeLesson, modules]);

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-900">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-white">
            {/* Top Header */}
            <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-sm font-black text-slate-900 line-clamp-1">{course?.title || 'Course Player'}</h1>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-blue-600">Module {activeModule + 1}</span>
                            <span>•</span>
                            <span>Lesson {activeLesson + 1} of {modules[activeModule].lessons.length}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-2 lg:flex">
                        <div className="h-1.5 w-32 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full w-[45%] bg-blue-600" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 tracking-tighter">45% COMPLETE</span>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-50 text-slate-400">
                        <Settings className="h-5 w-5" />
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200">
                        <CircleCheck className="h-5 w-5" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content (Video Area) */}
                <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50/50 relative">

                    {/* AI Proctoring Fixed Overlay */}
                    <div className="absolute top-6 right-6 z-20 w-80 pointer-events-none">
                        <div className="pointer-events-auto">
                            <ProctoringUI />
                        </div>
                    </div>

                    {/* Player Wrapper */}
                    <div className="mx-auto w-full max-w-5xl p-6 lg:p-12">
                        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1200"
                                className="h-full w-full object-cover opacity-50"
                                alt="Video background"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition-all"
                                >
                                    <CirclePlay className="h-10 w-10 fill-current" />
                                </motion.button>
                            </div>

                            {/* Controls Bar Placeholder */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                <div className="h-1 w-full rounded-full bg-white/20">
                                    <div className="h-full w-[35%] bg-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Content Details */}
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                                <h2 className="text-2xl font-black text-slate-900">
                                    {modules[activeModule].lessons[activeLesson].title}
                                </h2>
                                <div className="flex gap-2">
                                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50">
                                        <MessageSquare className="h-4 w-4" /> Discussion
                                    </button>
                                    <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50">
                                        <Paperclip className="h-4 w-4" /> Resources
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-slate max-w-none font-sans">
                                <p className="text-lg leading-relaxed text-slate-600 font-medium">
                                    In this lesson, we will explore the core architecture of our application. We'll be focusing specifically on how NestJS handles request lifecycles and how we can implement clean code principles using decorators and providers.
                                </p>
                                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                                        <h4 className="mb-2 text-sm font-bold text-slate-900">Key Takeaways</h4>
                                        <ul className="list-inside list-disc space-y-2 text-sm text-slate-500 font-bold">
                                            <li>Understanding Modularity</li>
                                            <li>Provider Injection Patterns</li>
                                            <li>Lifecycle Hooks Integration</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Syllabus) */}
                <motion.aside
                    initial={false}
                    animate={{ width: sidebarOpen ? '400px' : '0px' }}
                    className="flex flex-col border-l border-slate-100 bg-white overflow-hidden relative"
                >
                    <div className="flex h-16 items-center border-b border-slate-100 px-6 font-black text-slate-900 flex-shrink-0">
                        Course Content
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {modules.map((mod: any, modIdx: number) => (
                            <div key={modIdx} className="space-y-2">
                                <div className="flex items-center px-2 py-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Module {modIdx + 1}: {mod.title}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    {mod.lessons.map((lesson: any, lessonIdx: number) => {
                                        const isSelected = activeModule === modIdx && activeLesson === lessonIdx;
                                        return (
                                            <button
                                                key={lessonIdx}
                                                onClick={() => {
                                                    setActiveModule(modIdx);
                                                    setActiveLesson(lessonIdx);
                                                }}
                                                className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all ${isSelected ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white'
                                                    }`}>
                                                    {lesson.type === 'video' ? <CirclePlay className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                                        {lesson.title}
                                                    </div>
                                                    <div className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                                        {lesson.duration}
                                                    </div>
                                                </div>
                                                {lessonIdx === 0 && modIdx === 0 ? (
                                                    <CircleCheck className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-green-500'}`} />
                                                ) : null}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Footer Controls */}
                    <div className="border-t border-slate-100 p-4 bg-slate-50/50">
                        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-4 text-xs font-bold text-slate-900 transition-all hover:bg-white/50">
                            Next Module <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </motion.aside>
            </div>
        </div>
    );
};

export default CoursePlayer;

