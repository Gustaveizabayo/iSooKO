import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Play, FileText, Star, Clock, Globe, Shield, User, Loader2, CircleCheck, CircleHelp, Heart, Download, Paperclip } from 'lucide-react';
import ProctoringUI from '../components/proctoring/ProctoringUI';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { reviewService } from '../services/reviewService';
import { paymentService } from '../services/paymentService';
import { enrollmentService } from '../services/enrollmentService';
import { useState } from 'react';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [enrollSuccess, setEnrollSuccess] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const queryClient = useQueryClient();

    // Like Mutation
    const likeMutation = useMutation({
        mutationFn: () => reviewService.toggleLike(id as string),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course', id] });
            toast.success('Course updated');
        }
    });

    // Review Mutation
    const reviewMutation = useMutation({
        mutationFn: (data: any) => reviewService.create({ ...data, courseId: id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-reviews', id] });
            queryClient.invalidateQueries({ queryKey: ['course', id] });
            toast.success('Review submitted successfully');
            setShowReviewForm(false);
        }
    });

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

    // Fetch user enrollments to check if already enrolled
    const { data: myEnrollments } = useQuery({
        queryKey: ['my-enrollments'],
        queryFn: () => enrollmentService.getMyEnrollments(),
    });

    const isEnrolled = myEnrollments?.some((e: any) => e.courseId === id);

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
                            <div className="flex items-center justify-between">
                                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                                    {course.category}
                                </div>
                                <button
                                    onClick={() => likeMutation.mutate()}
                                    disabled={likeMutation.isPending}
                                    className="group flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-50"
                                >
                                    <Heart className="h-5 w-5 transition-transform group-active:scale-125" />
                                    <span>Like</span>
                                </button>
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

                        {/* Resources / Attachments */}
                        {course.attachments && course.attachments.length > 0 && (
                            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                                <h2 className="mb-6 text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    <Paperclip className="h-5 w-5" /> Course Resources
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {course.attachments.map((file: any) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <FileText className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                                                <div className="text-sm font-bold text-slate-700 group-hover:text-blue-700">{file.name}</div>
                                            </div>
                                            <Download className="h-4 w-4 text-slate-300 group-hover:text-blue-400" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Curriculum */}
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                            <h2 className="mb-6 text-2xl font-bold text-slate-900">Course Content</h2>

                            {(!course.modules || course.modules.length === 0) ? (
                                <p className="text-slate-500">No content available yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {course.modules.map((module: any) => (
                                        <div key={module.id} className="space-y-3">
                                            <h3 className="font-black text-slate-700 uppercase tracking-widest text-xs ml-1">{module.title}</h3>
                                            <div className="space-y-2">
                                                {module.lessons?.map((lesson: any) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="group flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white">
                                                                {lesson.type === 'VIDEO' ? <Play className="h-4 w-4" /> :
                                                                    lesson.type === 'QUIZ' ? <CircleHelp className="h-4 w-4" /> :
                                                                        <FileText className="h-4 w-4" />}
                                                            </div>
                                                            <div className="text-sm font-bold text-slate-900">{lesson.title}</div>
                                                        </div>
                                                        <div className="text-xs font-bold text-slate-400">{lesson.duration ? `${lesson.duration}m` : '-'}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-12 space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-slate-900">Student Feedback</h2>
                                <button
                                    onClick={() => setShowReviewForm(!showReviewForm)}
                                    className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                >
                                    Write a Review
                                </button>
                            </div>

                            {/* Add Review Form */}
                            {showReviewForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-slate-50 p-6 rounded-3xl border border-slate-100"
                                >
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target as HTMLFormElement);
                                        const rating = formData.get('rating');
                                        const comment = formData.get('comment');
                                        reviewMutation.mutate({ rating: Number(rating), comment: String(comment) });
                                    }} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Rating</label>
                                            <div className="flex gap-4">
                                                {[5, 4, 3, 2, 1].map((star) => (
                                                    <label key={star} className="cursor-pointer">
                                                        <input type="radio" name="rating" value={star} className="peer sr-only" required />
                                                        <Star className="h-6 w-6 text-slate-300 peer-checked:text-amber-500 peer-checked:fill-amber-500 hover:text-amber-400 transition-colors" />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Review</label>
                                            <textarea
                                                name="comment"
                                                rows={3}
                                                required
                                                placeholder="Share your experience..."
                                                className="w-full p-4 rounded-2xl border border-slate-200 bg-white font-medium text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setShowReviewForm(false)} className="px-4 py-2 text-sm font-bold text-slate-500">Cancel</button>
                                            <button type="submit" disabled={reviewMutation.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50">
                                                {reviewMutation.isPending ? 'Submitting...' : 'Post Review'}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
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
                                            <CircleCheck className="h-8 w-8 animate-bounce" />
                                            <span className="font-bold">Successfully Enrolled!</span>
                                        </div>
                                    ) : isEnrolled ? (
                                        <button
                                            onClick={() => navigate(`/learn/${id}`)}
                                            className="w-full rounded-2xl bg-[#0f2238] py-4 text-base font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Continue Learning
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => checkoutMutation.mutate(id as string)}
                                            disabled={checkoutMutation.isPending}
                                            className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white shadow-xl shadow-blue-200 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {checkoutMutation.isPending ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Enroll Now'}
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
            <Footer />
        </div>
    );
};

export default CourseDetails;

