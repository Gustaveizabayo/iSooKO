import { CircleHelp, Search, Book, MessageCircle, Video, FileText, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import { useState } from 'react';

const HelpSupport = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const faqs = [
        {
            category: 'Getting Started',
            icon: Book,
            questions: [
                { q: 'How do I enroll in a course?', a: 'Navigate to the Courses page, select a course, and click the "Enroll Now" button.' },
                { q: 'How do I track my progress?', a: 'Visit your Dashboard to see progress bars for all enrolled courses.' },
                { q: 'Can I access courses on mobile?', a: 'Yes! Our platform is fully responsive and works on all devices.' },
            ]
        },
        {
            category: 'Courses & Learning',
            icon: Video,
            questions: [
                { q: 'How long do I have access to a course?', a: 'You have lifetime access to all enrolled courses.' },
                { q: 'Can I download course materials?', a: 'Yes, downloadable resources are available in the Resources section.' },
                { q: 'How do I submit assignments?', a: 'Go to the course player and click on the assignment to upload your work.' },
            ]
        },
        {
            category: 'Certificates',
            icon: FileText,
            questions: [
                { q: 'How do I get a certificate?', a: 'Complete all course modules and pass the final assessment to receive your certificate.' },
                { q: 'Are certificates verified?', a: 'Yes, all certificates include a unique verification code.' },
                { q: 'Can I share my certificate?', a: 'Absolutely! You can download and share your certificate on LinkedIn and other platforms.' },
            ]
        },
        {
            category: 'Account & Billing',
            icon: MessageCircle,
            questions: [
                { q: 'How do I update my profile?', a: 'Go to Profile Settings from the sidebar to update your information.' },
                { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page to receive a reset link.' },
                { q: 'How do I contact support?', a: 'Use the contact form below or email us at support@isookoo.com' },
            ]
        },
    ];

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(q =>
            q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.a.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#0f2238] to-[#1a3a5c] text-white px-4 lg:px-8 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <CircleHelp className="h-16 w-16 mx-auto mb-4 opacity-90" />
                        <h1 className="text-3xl lg:text-4xl font-black mb-4">How can we help you?</h1>
                        <p className="text-lg text-white/80 font-medium mb-8">
                            Search our knowledge base or contact support
                        </p>

                        {/* Search */}
                        <div className="relative max-w-2xl mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search for help..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                    {/* Quick Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 -mt-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg text-center"
                        >
                            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-black text-slate-900 mb-2">Email Support</h3>
                            <p className="text-sm text-slate-500 font-medium mb-3">Get help via email</p>
                            <a href="mailto:support@isookoo.com" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                                support@isookoo.com
                            </a>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg text-center"
                        >
                            <div className="h-12 w-12 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                                <MessageCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-black text-slate-900 mb-2">Live Chat</h3>
                            <p className="text-sm text-slate-500 font-medium mb-3">Chat with our team</p>
                            <button className="text-sm font-bold text-green-600 hover:text-green-700">
                                Start Chat
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg text-center"
                        >
                            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
                                <Phone className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="font-black text-slate-900 mb-2">Phone Support</h3>
                            <p className="text-sm text-slate-500 font-medium mb-3">Call us directly</p>
                            <a href="tel:+1234567890" className="text-sm font-bold text-orange-600 hover:text-orange-700">
                                +1 (234) 567-890
                            </a>
                        </motion.div>
                    </div>

                    {/* FAQs */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>

                        {searchTerm && filteredFaqs.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                                <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-black text-slate-900 mb-2">No results found</h3>
                                <p className="text-slate-500 font-medium">
                                    Try a different search term or contact support
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {(searchTerm ? filteredFaqs : faqs).map((category, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
                                    >
                                        <div className="p-6 bg-slate-50 border-b border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                                    <category.icon className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <h3 className="text-lg font-black text-slate-900">{category.category}</h3>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {category.questions.map((item, j) => (
                                                <details key={j} className="group">
                                                    <summary className="flex items-center justify-between cursor-pointer p-4 rounded-xl hover:bg-slate-50 transition-colors">
                                                        <span className="font-bold text-slate-900 group-open:text-blue-600">
                                                            {item.q}
                                                        </span>
                                                        <CircleHelp className="h-5 w-5 text-slate-400 group-open:text-blue-600 transition-colors" />
                                                    </summary>
                                                    <div className="mt-2 p-4 bg-blue-50 rounded-xl">
                                                        <p className="text-sm text-slate-700 font-medium">{item.a}</p>
                                                    </div>
                                                </details>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">Still need help?</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                                <textarea
                                    rows={5}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium resize-none"
                                    placeholder="Describe your issue..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpSupport;

