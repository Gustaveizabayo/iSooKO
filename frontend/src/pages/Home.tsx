import Navbar from '../components/layout/Navbar';
import CourseCard from '../components/courses/CourseCard';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, Loader2, Award, Search, ArrowRight, Monitor, FlaskConical, Briefcase, Palette, Languages, Megaphone, Camera, Music, Sparkles, MessageCircle, Lightbulb } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '../services/courseService';
import { useState, useEffect } from 'react';

const backgrounds = [
    "/images/hero-1.jpg",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2000"
];

const Home = () => {
    const [currentBg, setCurrentBg] = useState(0);
    const { data: courses, isLoading, isError } = useQuery({
        queryKey: ['featured-courses'],
        queryFn: () => courseService.getAll(),
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBg((prev) => (prev + 1) % backgrounds.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section - Matching Image with Background Slider */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                    {/* Background Image Slider */}
                    <div className="absolute inset-0 z-0">
                        {backgrounds.map((bg, i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${bg})` }}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: currentBg === i ? 1 : 0,
                                    scale: currentBg === i ? 1 : 1.1
                                }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                        ))}
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-slate-900/60 transition-opacity" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-center mb-6"
                        >
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#0f2238]/80 backdrop-blur-sm px-5 py-2 text-sm font-bold text-white ring-1 ring-white/10 shadow-2xl">
                                <span className="text-yellow-500 mr-1">◀</span>
                                Where Learning Meeta, Growth
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-6xl font-black tracking-tight text-white sm:text-7xl md:text-8xl"
                        >
                            Unlock Your <br />
                            <span className="text-yellow-500">Full Potential</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mx-auto mt-8 max-w-2xl text-xl font-medium text-slate-100"
                        >
                            Learn from world-class instructors and gain the <br className="hidden md:block" />
                            skills you need to succeed. 5+
                        </motion.p>

                        {/* Search Bar - Matching provided image exactly */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mx-auto mt-12 max-w-3xl"
                        >
                            <div className="relative flex items-center bg-white rounded-2xl p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                                <Search className="ml-4 h-6 w-6 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="What do you want to learn today?"
                                    className="flex-1 border-none bg-transparent px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:ring-0"
                                />
                                <button className="rounded-xl bg-[#0f2238] px-10 py-4 text-base font-black text-white transition-all hover:bg-[#1a3a5a] active:scale-95 flex items-center gap-2">
                                    Search
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Popular Tags / Populate Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mt-10 flex flex-wrap justify-center gap-4 text-sm"
                        >
                            <span className="font-bold text-white/80">Populate:</span>
                            {['New Development', 'Data Stome', 'UDUE Desgn'].map((tag) => (
                                <button key={tag} className="rounded-lg bg-white/10 backdrop-blur-md px-5 py-1.5 text-white font-medium hover:bg-white/20 transition-all border border-white/10">
                                    {tag}
                                </button>
                            ))}
                        </motion.div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="h-10 w-6 rounded-full border-2 border-white/30 flex justify-center p-1"
                        >
                            <div className="h-2 w-1.5 rounded-full bg-white/50" />
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="pt-8 pb-24 bg-slate-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
                            {[
                                { icon: BookOpen, count: "8+", label: "Courses" },
                                { icon: Users, count: "10K+", label: "Students" },
                                { icon: Award, count: "500+", label: "Instructors" },
                                { icon: Trophy, count: "95%", label: "Success Rate" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-2">
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                    <div className="text-3xl font-black text-[#0f2238]">{stat.count}</div>
                                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Courses - Main on landing page */}
                <section className="py-20 bg-slate-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <div className="mb-2 inline-block rounded bg-amber-100 px-3 py-1 text-xs font-bold text-amber-600">
                                    <span className="mr-1">★</span> Featured
                                </div>
                                <h2 className="text-3xl font-bold text-[#0f2238]">Featured Courses</h2>
                                <p className="mt-2 text-slate-500">Hand-picked courses by our expert team</p>
                            </div>
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                Browse All Courses <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex h-64 items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            </div>
                        ) : isError ? (
                            <div className="rounded-2xl bg-red-50 p-8 text-center text-red-600">
                                Could not load courses.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                                {courses?.map((course: any, index: number) => (
                                    <CourseCard
                                        key={course.id}
                                        title={course.title}
                                        instructor={course.instructor?.name || 'Instructor'}
                                        rating={4.8}
                                        reviews={course._count?.reviews || 0}
                                        price={course.price}
                                        duration={`${course.duration}h`}
                                        category={course.category}
                                        thumbnail={course.thumbnailUrl || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800'}
                                        isFeatured={true}
                                        level={index % 2 === 0 ? "Beginner" : "Intermediate"}
                                        lessons={index * 12 + 24}
                                        students={index * 340 + 1200}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Explore Categories Section */}
                <section className="py-20 bg-white">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-12 flex items-end justify-between">
                            <div>
                                <div className="mb-2 inline-block rounded bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600">
                                    Top Categories
                                </div>
                                <h2 className="text-3xl font-bold text-[#0f2238]">Explore Categories</h2>
                                <p className="mt-2 text-slate-500">Find the perfect course from our diverse catalog</p>
                            </div>
                            <button className="hidden text-sm font-bold text-blue-600 hover:text-blue-800 sm:flex items-center gap-1">
                                View All <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { name: 'Technology', count: '2 courses', icon: Monitor, color: 'bg-blue-600' },
                                { name: 'Science', count: '1 courses', icon: FlaskConical, color: 'bg-teal-600' },
                                { name: 'Business', count: '1 courses', icon: Briefcase, color: 'bg-emerald-600' },
                                { name: 'Design', count: '1 courses', icon: Palette, color: 'bg-pink-600' },
                                { name: 'Language', count: '2 courses', icon: Languages, color: 'bg-indigo-600' },
                                { name: 'Marketing', count: '1 courses', icon: Megaphone, color: 'bg-orange-600' },
                                { name: 'Photography', count: '1 courses', icon: Camera, color: 'bg-cyan-600' },
                                { name: 'Music', count: '1 courses', icon: Music, color: 'bg-purple-600' },
                            ].map((category) => (
                                <div key={category.name} className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${category.color}`}>
                                        <category.icon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#0f2238] group-hover:text-blue-600 transition-colors">{category.name}</h3>
                                        <p className="text-xs text-slate-500">{category.count}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Chat Button */}
            <button className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f2238] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95">
                <MessageCircle className="h-6 w-6" />
            </button>

            {/* Footer - Matching Image 1 */}
            <footer className="bg-[#0f2238] text-white">
                {/* CTA Section */}
                <div className="border-b border-white/10">
                    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold sm:text-4xl mb-4">Ready to Start Learning?</h2>
                        <p className="text-slate-400 mb-10 max-w-xl mx-auto">
                            Join thousands of learners who are already growing their skills with iSooKO.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="rounded-lg bg-yellow-500 px-8 py-3 text-base font-bold text-[#0f2238] hover:bg-yellow-400 transition-colors flex items-center gap-2">
                                <Trophy className="h-4 w-4" /> Start Learning Free
                            </button>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full max-w-xs rounded-lg border-0 bg-white px-4 py-3 text-[#0f2238] placeholder-slate-400 focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Links Section */}
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
                        <div className="col-span-1 lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-6 w-6 text-yellow-500" />
                                <span className="text-xl font-bold">iSooKo</span>
                            </div>
                            <p className="text-sm text-slate-400 max-w-xs">
                                Where Learning Meets Growth. Empowering learners worldwide with top-tier education.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Explore</h3>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">All Courses</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Categories</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Teach on iSooKO</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Support</h3>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Contact Us</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">FAQs</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Legal</h3>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-yellow-500 transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-16 border-t border-white/10 pt-8 text-center">
                        <p className="text-sm text-slate-500">© 2026 iSooKO. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};



export default Home;
