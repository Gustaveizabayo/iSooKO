import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Play, FileText, Star, Clock, Globe, Shield, User, Loader2, CheckCircle2 } from 'lucide-react';
import ProctoringUI from '../components/proctoring/ProctoringUI';
import { useQuery, useMutation } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { reviewService } from '../services/reviewService';
import { paymentService } from '../services/paymentService';
import { useState } from 'react';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [enrollSuccess, setEnrollSuccess] = useState(false);

    // Fetch real course details
    const { data: course, isLoading, isError } = useQuery({
        queryKey: ['course', id],
        queryFn: () => courseService.getById(id as string),
        enabled: !!id,
    });

    // Fetch real course reviews
    const { data: reviews } = useQuery({
        queryKey: ['course-reviews', id],
        queryFn: () => reviewService.getByCourse(id as string),
        enabled: !!id,
    });

    // Checkout mutation
    const checkoutMutation = useMutation({
        mutationFn: (courseId: string) => paymentService.createCheckoutSession(courseId),
        onSuccess: () => {
            // In a real app, we'd redirect to Stripe/PayPal here
            // window.location.href = data.url;

            // For this demo, let's simulate a direct enroll if it's free or skip for dev
            setEnrollSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError || !course) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-900">Course not found</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold underline">Go back home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

                    {/* Main Content (Left Column) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                {course.category}
                            </div>
                            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-6 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
                                        <User className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{course.instructor?.name || 'Expert Instructor'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                    <Star className="h-4 w-4 fill-current" />
                                    <span className="text-sm">4.8 ({course._count?.reviews || 0} reviews)</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                    <Globe className="h-4 w-4" />
                                    English
                                </div>
                            </div>
                        </div>

                        {/* Curriculum (Mocked for now since schema might not have it all in one go) */}
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-slate-900">Course Content</h2>
                            <div className="space-y-3">
                                {[
                                    { title: "Course Overview & Objectives", duration: "05:00", type: "video" },
                                    { title: "Foundational Concepts", duration: "25:40", type: "video" },
                                    { title: "Building your First Module", duration: "12:00", type: "video" },
                                    { title: "Practice Lab: Implementation", duration: "30:00", type: "reading" },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="group flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white">
                                                {item.type === 'video' ? <Play className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">{item.title}</div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400">{item.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-12 space-y-8">
                            <h2 className="text-2xl font-bold text-slate-900">Student Feedback</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {!reviews || (reviews as any[]).length === 0 ? (
                                    <div className="col-span-2 rounded-3xl bg-slate-50 p-8 text-center text-slate-500 font-medium">
                                        No reviews yet. Be the first to share your experience!
                                    </div>
                                ) : (
                                    (reviews as any[]).map((review: any, i: number) => (
                                        <div key={i} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                                                        {review.user?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900">{review.user?.name || 'Anonymous User'}</span>
                                                </div>
                                                <div className="flex text-amber-500">
                                                    {[...Array(review.rating)].map((_, j) => (
                                                        <Star key={j} className="h-4 w-4 fill-current" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div className="sticky top-24 space-y-6">
                            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
                                <div className="aspect-video">
                                    <img src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800'} className="h-full w-full object-cover" alt="" />
                                </div>
                                <div className="p-8">
                                    <div className="mb-6 flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-slate-900">${course.price}</span>
                                    </div>

                                    {enrollSuccess ? (
                                        <div className="flex flex-col items-center gap-2 rounded-2xl bg-green-50 p-4 text-green-600">
                                            <CheckCircle2 className="h-8 w-8 animate-bounce" />
                                            <span className="font-bold">Successfully Enrolled!</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => checkoutMutation.mutate(id as string)}
                                            disabled={checkoutMutation.isPending}
                                            className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {checkoutMutation.isPending ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : `Buy Now for $${course.price}`}
                                        </button>
                                    )}

                                    <div className="mt-8 space-y-4 border-t border-slate-50 pt-8">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <Clock className="h-4 w-4 text-blue-600" />
                                                <span>{course.duration} hours total</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <Shield className="h-4 w-4 text-blue-600" />
                                                <span>AI Proctoring Certification</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ProctoringUI />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CourseDetails;
