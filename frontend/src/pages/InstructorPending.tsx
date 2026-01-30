import { Clock, Mail, CircleCheck, CircleAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { authService } from '../services/authService';

const InstructorPending = () => {
    const user = authService.getCurrentUser();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full"
                >
                    <div className="bg-white rounded-2xl border border-slate-100 p-8 md:p-12 text-center">
                        {/* Icon */}
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-yellow-100 mb-6">
                            <Clock className="h-10 w-10 text-yellow-600 animate-pulse" />
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                            Application Under Review
                        </h1>

                        {/* Message */}
                        <p className="text-lg text-slate-600 font-medium mb-8">
                            Thank you for applying to become an instructor on iSooKO!
                            Your application is currently being reviewed by our team.
                        </p>

                        {/* Status Cards */}
                        <div className="space-y-4 mb-8">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-4">
                                <CircleCheck className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                                <div className="text-left">
                                    <h3 className="font-bold text-green-900 mb-1">Application Submitted</h3>
                                    <p className="text-sm text-green-700 font-medium">
                                        We have received your application and all supporting documents.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-4">
                                <Clock className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                                <div className="text-left">
                                    <h3 className="font-bold text-yellow-900 mb-1">Review in Progress</h3>
                                    <p className="text-sm text-yellow-700 font-medium">
                                        Our team is carefully reviewing your qualifications and experience.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4">
                                <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div className="text-left">
                                    <h3 className="font-bold text-blue-900 mb-1">Email Notification</h3>
                                    <p className="text-sm text-blue-700 font-medium">
                                        You will receive an email at <strong>{user?.email}</strong> once your application is processed.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-slate-50 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-black text-slate-900 mb-4">What Happens Next?</h3>
                            <div className="space-y-3 text-left">
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        1
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Application Review</p>
                                        <p className="text-xs text-slate-600">Our team reviews your credentials (1-2 days)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        2
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Background Verification</p>
                                        <p className="text-xs text-slate-600">We verify your qualifications and experience (1-2 days)</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold">
                                        3
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Decision & Notification</p>
                                        <p className="text-xs text-slate-600">You'll receive our decision via email (within 3 days)</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                            <div className="flex items-start gap-3">
                                <CircleAlert className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-700 font-medium text-left">
                                    <strong>Average review time: 2-3 business days.</strong> We appreciate your patience
                                    as we ensure the quality of our instructor community.
                                </p>
                            </div>
                        </div>

                        {/* Contact Support */}
                        <div className="text-center">
                            <p className="text-sm text-slate-600 font-medium mb-4">
                                Have questions about your application?
                            </p>
                            <a
                                href="mailto:instructor-support@isookoo.com"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                                Contact Support
                            </a>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default InstructorPending;

