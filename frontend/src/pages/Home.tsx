import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CourseCard from '../components/courses/CourseCard';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, Loader2, Award, Search, ArrowRight, Monitor, FlaskConical, Briefcase, Palette, Languages, Megaphone, Camera, Music, MessageCircle, Target, Eye, Zap } from 'lucide-react';
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
                                Where Learning Meets Growth
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
                            skills you need to succeed.
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
                            <span className="font-bold text-white/80">Popular:</span>
                            {['Web Development', 'Data Science', 'UI/UX Design'].map((tag) => (
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

                {/* Partners Section - Continuous Marquee Slider */}
                <section className="py-16 bg-white border-y border-slate-100 overflow-hidden group">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-10 text-center">
                        <p className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-[0.65rem] font-black uppercase tracking-[0.2em]">
                            Our Global Partners
                        </p>
                        <h3 className="mt-4 text-sm font-bold text-slate-400">Trusted by 500+ world-class companies and institutions</h3>
                    </div>

                    <div className="relative flex overflow-x-hidden">
                        <motion.div
                            animate={{
                                x: [0, -1035],
                            }}
                            transition={{
                                x: {
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 30,
                                    ease: "linear",
                                },
                            }}
                            className="flex whitespace-nowrap gap-16 items-center"
                        >
                            {[
                                'SOLVIT', 'IZUBA TV', 'Schnell Media', 'LIGHTMGROUP', 'Kwely',
                            ].map((brand, i) => (
                                <span
                                    key={i}
                                    className="text-2xl font-black text-blue-600/40 hover:text-[#0f2238] transition-colors duration-300 cursor-default uppercase tracking-tight"
                                >
                                    {brand}
                                </span>
                            ))}
                            {/* Duplicate for seamless loop */}
                            {[
                                'SOLVIT', 'IZUBA TV', 'Schnell Media', 'LIGHTMGROUP', 'Kwely',

                            ].map((brand, i) => (
                                <span
                                    key={`loop-${i}`}
                                    className="text-2xl font-black text-blue-600/40 hover:text-[#0f2238] transition-colors duration-300 cursor-default uppercase tracking-tight"
                                >
                                    {brand}
                                </span>
                            ))}
                        </motion.div>

                        {/* Faded edges for better transition */}
                        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
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
                <section className="py-24 bg-white">
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
                <section className="py-24 bg-slate-50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
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

                {/* Features Section - Highlighting LMS Capabilities */}
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <span className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-blue-600 mb-4">
                                Why Choose iSooKO
                            </span>
                            <h2 className="text-3xl font-black text-[#0f2238] sm:text-4xl">
                                Everything You Need to <span className="text-blue-600">Succeed</span>
                            </h2>
                            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                                A complete ecosystem designed for students, instructors, and administrators.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                {
                                    title: "Interactive Courses",
                                    desc: "Engage with high-quality video lessons, quizzes, and real-time feedback.",
                                    icon: BookOpen,
                                    color: "bg-blue-500",
                                    gradient: "from-blue-500 to-cyan-500"
                                },
                                {
                                    title: "Smart Attendance",
                                    desc: "Automated tracking for physical and virtual sessions with detailed reports.",
                                    icon: Target,
                                    color: "bg-green-500",
                                    gradient: "from-green-500 to-emerald-500"
                                },
                                {
                                    title: "Instructor Tools",
                                    desc: "Powerful studio to create, manage, and grade courses effortlessly.",
                                    icon: Briefcase,
                                    color: "bg-purple-500",
                                    gradient: "from-purple-500 to-pink-500"
                                },
                                {
                                    title: "Admin Control",
                                    desc: "Comprehensive dashboard for user management, security, and analytics.",
                                    icon: Trophy, // Using Trophy as a placeholder for 'Control/Shield' vibe or similar
                                    color: "bg-orange-500",
                                    gradient: "from-orange-500 to-red-500"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
                                >
                                    <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-[100px] transition-transform group-hover:scale-110`} />

                                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="h-7 w-7" />
                                    </div>

                                    <h3 className="text-xl font-black text-[#0f2238] mb-3 group-hover:text-blue-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                <section className="py-28 bg-gradient-to-b from-[#0f2238] via-[#1a3a5a] to-[#0f2238] text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 h-32 w-full bg-white/5 backdrop-blur-3xl opacity-20"></div>
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold sm:text-4xl text-white">What Our Students Say</h2>
                            <p className="mt-4 text-slate-300">Join thousands of successful learners worldwide</p>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                {
                                    name: "Sarah Jenkins",
                                    role: "Software Engineer",
                                    content: "iSooKO changed my life. The AI-integrated learning paths and proctored exams gave me the confidence I needed to switch careers.",
                                    avatar: "https://i.pravatar.cc/150?u=sarah"
                                },
                                {
                                    name: "Mark Wilson",
                                    role: "Project Manager",
                                    content: "The best LMS platform I've ever used. The interface is intuitive, and the quality of courses is premium. Highly recommended!",
                                    avatar: "https://i.pravatar.cc/150?u=mark"
                                },
                                {
                                    name: "Elena Rodriguez",
                                    role: "UI Designer",
                                    content: "As a designer, I appreciate the beautiful UI. The learning experience is seamless and the instructor support is outstanding.",
                                    avatar: "https://i.pravatar.cc/150?u=elena"
                                }
                            ].map((testimonial, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
                                >
                                    <div className="flex gap-1 text-yellow-500 mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                    <p className="text-slate-300 leading-relaxed italic mb-8">
                                        "{testimonial.content}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="h-12 w-12 rounded-full border-2 border-yellow-500" />
                                        <div>
                                            <h4 className="font-bold text-white">{testimonial.name}</h4>
                                            <p className="text-xs text-slate-400">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* About Us Section - Full Screen Refined Layout */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden py-24">
                    {/* Background with Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=2000"
                            alt="Student in Library"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[#0f2238]/90 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8"
                            >
                                <div>
                                    <span className="inline-block rounded-full bg-yellow-500 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-[#0f2238] mb-6">
                                        About Us
                                    </span>
                                    <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6">
                                        Where Learning <br />
                                        <span className="text-yellow-500 text-glow">Meets Growth</span>
                                    </h2>
                                    <h3 className="text-xl font-bold text-slate-300 mb-8 italic">"Unlock Your Full Potential"</h3>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4 items-start bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all group">
                                        <div className="h-12 w-12 bg-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Target className="h-6 w-6 text-[#0f2238]" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Our Mission</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                                iSooKO is an online learning platform that provides courses and learning resources curated by world-class instructors. Our mission is to make learning fun, flexible, and accessible for everyone.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 items-start bg-white/5 p-6 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all group">
                                        <div className="h-12 w-12 bg-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <Eye className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">Our Vision</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                                To become a world-class online learning platform empower individuals through accessible learning.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <a href="/contact" className="inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-base font-black text-[#0f2238] shadow-2xl hover:bg-yellow-500 transition-all active:scale-95 group">
                                        Partner With Us <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative hidden lg:block"
                            >
                                <div className="absolute inset-0 bg-yellow-500 blur-[150px] opacity-20 -z-10 animate-pulse"></div>
                                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-12 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8">
                                        <div className="h-20 w-20 bg-yellow-500 rounded-3xl flex flex-col items-center justify-center text-[#0f2238] shadow-2xl rotate-12 group-hover:rotate-0 transition-transform">
                                            <span className="text-2xl font-black">10+</span>
                                            <span className="text-[10px] font-black uppercase leading-none">Years</span>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                                                <Zap className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-white">Experience Excellence</h4>
                                                <p className="text-slate-400 font-medium">Over a decade of academic impact</p>
                                            </div>
                                        </div>
                                        <div className="h-px bg-white/10 w-full" />
                                        <p className="text-slate-300 text-lg font-medium leading-relaxed italic">
                                            "Learning is not just about information, it's about transformation. At iSooKO, we bridge the gap between where you are and where you want to be."
                                        </p>
                                        <div className="flex items-center gap-4">
                                            <div className="h-1 w-12 bg-yellow-500 rounded-full" />
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Trusted Worldwide</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Floating Chat Button */}
            <button className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f2238] text-white shadow-2xl transition-transform hover:scale-110 active:scale-95">
                <MessageCircle className="h-6 w-6" />
            </button>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
