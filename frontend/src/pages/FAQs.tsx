import { useState } from 'react';
import { motion } from 'framer-motion';
import { CircleHelp, Plus, Minus, Search, Book, User, Shield, CreditCard, MessageSquare } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const FAQs = () => {
    const [openCategory, setOpenCategory] = useState('general');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'general', name: 'General', icon: CircleHelp },
        { id: 'courses', name: 'Courses', icon: Book },
        { id: 'account', name: 'Account', icon: User },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'payments', name: 'Payments', icon: CreditCard },
    ];

    const faqs = {
        general: [
            {
                question: 'What is iSooKO?',
                answer: 'iSooKO is a comprehensive learning management system that connects students with expert instructors. We offer high-quality courses across various disciplines to help you achieve your learning goals.'
            },
            {
                question: 'Is iSooKO free to use?',
                answer: 'Creating an account on iSooKO is free. We offer both free and premium courses. Prices for premium courses vary depending on the content and instructor.'
            },
            {
                question: 'Can I access iSooKO on mobile?',
                answer: 'Yes! iSooKO is fully responsive and optimized for mobile devices, allowing you to learn on the go from your smartphone or tablet.'
            }
        ],
        courses: [
            {
                question: 'How do I enroll in a course?',
                answer: 'Simply browse our course catalog, click on a course you\'re interested in, and hit the "Enroll" button. If it\'s a paid course, you\'ll be guided through the payment process.'
            },
            {
                question: 'Do courses have a time limit?',
                answer: 'most courses offer lifetime access, allowing you to learn at your own pace. Some specific certification programs may have completion deadlines.'
            },
            {
                question: 'Can I track my attendance?',
                answer: 'Yes, our platform automatically tracks your attendance and progress. You can view detailed reports in your dashboard under the "Attendance" tab.'
            },
            {
                question: 'Why can\'t I see my course progress?',
                answer: 'Course progress updates automatically as you complete lessons. If you don\'t see updates, try refreshing the page or ensuring you\'ve marked lessons as complete.'
            }
        ],
        account: [
            {
                question: 'How do I reset my password?',
                answer: 'Go to the login page and click "Forgot Password". Enter your email address, and we\'ll send you instructions to reset your password securely.'
            },
            {
                question: 'Can I change my email address?',
                answer: 'Yes, you can update your email address in your profile settings. You\'ll need to verify the new email address before the change takes effect.'
            },
            {
                question: 'How do I delete my account?',
                answer: 'You can request account deletion through your profile settings or by contacting our support team. Please note this action is permanent.'
            }
        ],
        security: [
            {
                question: 'Is my data safe with iSooKO?',
                answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal information and learning data.'
            },
            {
                question: 'Do you offer two-factor authentication?',
                answer: 'Yes, we recommend enabling 2FA in your security settings for an added layer of protection for your account.'
            },
            {
                question: 'Who can see my profile?',
                answer: 'By default, your profile is visible to instructors of courses you\'re enrolled in. You can adjust visibility settings in your privacy preferences.'
            }
        ],
        payments: [
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept major credit cards (Visa, MasterCard, Amex), PayPal, and various local payment methods depending on your region.'
            },
            {
                question: 'Can I get a refund?',
                answer: 'We offer a 30-day money-back guarantee for most paid courses. If you\'re not satisfied, contact support within 30 days of purchase.'
            },
            {
                question: 'Are payments secure?',
                answer: 'Yes, all payments are processed through secure, PCI-compliant payment gateways. We do not store your credit card information on our servers.'
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] pt-24 pb-24 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 border border-white/20"
                >
                    <MessageSquare className="h-6 w-6 text-yellow-500 mr-2" />
                    <span className="text-white font-bold">Frequently Asked Questions</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                    How can we help you?
                </h1>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for answers..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 text-slate-900 font-medium shadow-2xl focus:ring-4 focus:ring-yellow-500/20 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Categories Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg p-2 sticky top-24">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setOpenCategory(cat.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${openCategory === cat.id
                                        ? 'bg-[#0A2540] text-white shadow-md'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <cat.icon className={`h-4 w-4 ${openCategory === cat.id ? 'text-yellow-500' : 'text-slate-400'}`} />
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* FAQs List */}
                    <div className="flex-1 space-y-4">
                        {faqs[openCategory as keyof typeof faqs].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <details className="group">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none bg-white hover:bg-slate-50 transition-colors">
                                        <h3 className="text-lg font-bold text-[#0A2540] pr-8">{faq.question}</h3>
                                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 group-open:bg-yellow-100 group-open:text-yellow-700 transition-colors">
                                            <Plus className="h-4 w-4 block group-open:hidden" />
                                            <Minus className="h-4 w-4 hidden group-open:block" />
                                        </div>
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </details>
                            </motion.div>
                        ))}

                        {/* Additional Help CTA */}
                        <div className="bg-blue-50 rounded-2xl p-8 text-center mt-12 border border-blue-100">
                            <h3 className="text-xl font-black text-[#0A2540] mb-2">Can't find what you're looking for?</h3>
                            <p className="text-slate-600 mb-6">Our support team is always ready to help you.</p>
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A2540] text-white rounded-xl font-bold hover:bg-[#0f2d4d] transition-all"
                            >
                                <MessageSquare className="h-4 w-4" />
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default FAQs;

