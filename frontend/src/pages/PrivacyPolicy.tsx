import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Users, Download, Globe } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: Eye,
            title: 'Data Collection',
            content: [
                'We collect personal information including your name, email address, profile photo, and course activity.',
                'Account creation requires a valid email address for verification and communication.',
                'Profile information (bio, avatar, preferences) is stored to personalize your experience.',
                'Course activity data includes enrollment history, progress tracking, quiz scores, and assignment submissions.',
                'Technical data such as IP address, browser type, and device information is collected for security and analytics.',
            ]
        },
        {
            icon: Lock,
            title: 'Data Usage',
            content: [
                'Your data is used to provide personalized learning experiences and track your progress.',
                'Email addresses are used for account verification, course updates, and important notifications.',
                'Profile information helps instructors and peers recognize you in discussions and collaborative activities.',
                'Progress data enables us to recommend relevant courses and improve our platform.',
                'Technical data helps us maintain security, prevent fraud, and optimize platform performance.',
            ]
        },
        {
            icon: Users,
            title: 'Data Sharing',
            content: [
                'We do not sell your personal data to third parties under any circumstances.',
                'Course instructors can view your name, profile photo, and course-specific progress.',
                'Administrators have access to user data for support, moderation, and platform management.',
                'Aggregated, anonymized data may be shared for research and analytics purposes.',
                'We may share data with service providers (hosting, email) who are bound by confidentiality agreements.',
            ]
        },
        {
            icon: Shield,
            title: 'Security Measures',
            content: [
                'All user sessions are encrypted using industry-standard SSL/TLS protocols.',
                'Passwords are hashed using bcrypt with salt for maximum security.',
                'Optional two-factor authentication (2FA) is available for enhanced account protection.',
                'Regular security audits and penetration testing ensure platform integrity.',
                'Data is stored in secure, encrypted databases with restricted access controls.',
            ]
        },
        {
            icon: Download,
            title: 'Your Rights',
            content: [
                'You have the right to request a complete copy of your personal data at any time.',
                'You can request correction of inaccurate or incomplete information in your profile.',
                'You may request deletion of your account and associated data (subject to legal requirements).',
                'You can opt-out of non-essential communications while maintaining account functionality.',
                'You have the right to lodge a complaint with data protection authorities if concerns arise.',
            ]
        },
        {
            icon: Globe,
            title: 'Compliance & Standards',
            content: [
                'iSooKO complies with GDPR (General Data Protection Regulation) for European users.',
                'We adhere to COPPA (Children\'s Online Privacy Protection Act) requirements.',
                'Our practices align with CCPA (California Consumer Privacy Act) standards.',
                'We follow local data protection laws in all jurisdictions where we operate.',
                'Regular compliance audits ensure ongoing adherence to privacy regulations.',
            ]
        },
    ];

    const colorClasses = [
        'bg-blue-100 text-blue-600',
        'bg-green-100 text-green-600',
        'bg-purple-100 text-purple-600',
        'bg-orange-100 text-orange-600',
        'bg-red-100 text-red-600',
        'bg-indigo-100 text-indigo-600',
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-yellow-500 mb-6">
                            <Shield className="h-8 w-8 text-[#0A2540]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Privacy Policy
                        </h1>
                        <p className="text-xl text-blue-200 mb-4">
                            Your privacy is our priority
                        </p>
                        <p className="text-sm text-blue-300">
                            Last updated: January 29, 2026
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Introduction */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-8 border border-slate-200 mb-8"
                >
                    <h2 className="text-2xl font-black text-slate-900 mb-4">Introduction</h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        Welcome to iSooKO's Privacy Policy. This document explains how we collect, use, protect, and share your personal information when you use our learning management system.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        By using iSooKO, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your privacy and ensuring transparency in our data practices.
                    </p>
                </motion.div>

                {/* Policy Sections */}
                <div className="space-y-6">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`h-12 w-12 rounded-xl ${colorClasses[index]} flex items-center justify-center`}>
                                    <section.icon className="h-6 w-6" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">{section.title}</h2>
                            </div>

                            <ul className="space-y-3">
                                {section.content.map((item, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                            {idx + 1}
                                        </span>
                                        <span className="text-slate-600 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Contact Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
                >
                    <h3 className="text-2xl font-black mb-4">Questions About Privacy?</h3>
                    <p className="text-blue-100 mb-6 leading-relaxed">
                        If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="mailto:privacy@isooko.com"
                            className="inline-block px-6 py-3 bg-yellow-500 text-[#0A2540] rounded-xl font-bold hover:bg-yellow-400 transition-all text-center"
                        >
                            Email Privacy Team
                        </a>
                        <a
                            href="/contact"
                            className="inline-block px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all text-center"
                        >
                            Contact Support
                        </a>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
