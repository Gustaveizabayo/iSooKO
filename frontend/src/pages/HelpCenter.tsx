import { motion } from 'framer-motion';
import { CircleHelp, BookOpen, User, BarChart3, Settings, Mail, MessageCircle, Search } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const HelpCenter = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const helpCategories = [
        {
            icon: BookOpen,
            title: 'Getting Started',
            color: 'blue',
            articles: [
                { title: 'How to create an account', content: 'Click "Join for Free" on the homepage, fill in your details, and verify your email.' },
                { title: 'How to enroll in courses', content: 'Browse courses, click on a course card, and hit "Enroll Now" to start learning.' },
                { title: 'Navigating your dashboard', content: 'Your dashboard shows active courses, progress, attendance, and upcoming lessons.' },
                { title: 'Understanding course structure', content: 'Courses are divided into modules with videos, quizzes, and assignments.' },
            ]
        },
        {
            icon: User,
            title: 'Account Management',
            color: 'green',
            articles: [
                { title: 'Updating your profile photo', content: 'Go to Profile → Click on your avatar → Upload a new image (max 5MB).' },
                { title: 'Changing your bio', content: 'Navigate to Profile → Pencil Bio → Save changes to update your description.' },
                { title: 'Updating email address', content: 'Profile → Account Settings → Change Email → Verify new email address.' },
                { title: 'Resetting your password', content: 'Login page → "Forgot Password" → Enter email → Follow reset link sent to your inbox.' },
            ]
        },
        {
            icon: BarChart3,
            title: 'Course Access & Progress',
            color: 'purple',
            articles: [
                { title: 'How to join a course', content: 'Browse courses → Select course → Click "Enroll Now" → Start learning immediately.' },
                { title: 'Tracking your progress', content: 'Dashboard shows completion percentage, time spent, and modules completed.' },
                { title: 'Submitting assignments', content: 'Open assignment → Upload file or enter text → Click "Submit" before deadline.' },
                { title: 'Accessing course materials', content: 'Course page → Materials tab → Download PDFs, slides, and resources.' },
            ]
        },
        {
            icon: BarChart3,
            title: 'Attendance & Reports',
            color: 'orange',
            articles: [
                { title: 'Viewing attendance percentage', content: 'Dashboard → Attendance widget shows present, absent, and excused percentages.' },
                { title: 'Exporting attendance reports', content: 'Attendance page → "Export Report" → Download as PDF or CSV.' },
                { title: 'Understanding attendance status', content: 'Present (green), Absent (red), Late (yellow), Excused (blue).' },
                { title: 'Attendance requirements', content: 'Most courses require 75% attendance to receive a certificate.' },
            ]
        },
        {
            icon: Settings,
            title: 'Technical Support',
            color: 'red',
            articles: [
                { title: 'Troubleshooting login issues', content: 'Clear browser cache → Try incognito mode → Reset password if needed.' },
                { title: 'Search bar not working', content: 'Refresh page → Check internet connection → Contact support if issue persists.' },
                { title: 'Video playback problems', content: 'Check internet speed → Update browser → Try different browser.' },
                { title: 'Notification alerts', content: 'Enable browser notifications → Check notification settings in profile.' },
            ]
        },
        {
            icon: Mail,
            title: 'Contact Us',
            color: 'yellow',
            articles: [
                { title: 'Email support', content: 'Send detailed questions to support@isooko.com for assistance within 24 hours.' },
                { title: 'Live chat', content: 'Click the chat icon (bottom right) for immediate help during business hours.' },
                { title: 'Phone support', content: 'Call +1 (234) 567-890 Monday-Friday, 9 AM - 6 PM EST.' },
                { title: 'Community forum', content: 'Join our community forum to ask questions and connect with other learners.' },
            ]
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600',
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-yellow-500 mb-6">
                            <CircleHelp className="h-8 w-8 text-[#0A2540]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Help Center
                        </h1>
                        <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
                            Find answers to common questions and learn how to make the most of iSooKO
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for help articles..."
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 text-slate-900 font-medium shadow-xl focus:ring-4 focus:ring-yellow-500/20"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {helpCategories.map((category, index) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-12 w-12 rounded-xl ${colorClasses[category.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                                    <category.icon className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">{category.title}</h2>
                            </div>

                            <div className="space-y-4">
                                {category.articles.map((article, idx) => (
                                    <details key={idx} className="group">
                                        <summary className="flex items-center justify-between cursor-pointer list-none p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                                            <span className="font-bold text-slate-900 group-open:text-blue-600">
                                                {article.title}
                                            </span>
                                            <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                                        </summary>
                                        <div className="mt-2 p-4 text-sm text-slate-600 leading-relaxed bg-blue-50 rounded-xl">
                                            {article.content}
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Support CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white"
                >
                    <MessageCircle className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-2xl font-black mb-2">Still need help?</h3>
                    <p className="text-blue-100 mb-6">Our support team is here to assist you</p>
                    <Link
                        to="/contact"
                        className="inline-block px-8 py-3 bg-yellow-500 text-[#0A2540] rounded-xl font-bold hover:bg-yellow-400 transition-all transform hover:scale-105"
                    >
                        Contact Support
                    </Link>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default HelpCenter;

