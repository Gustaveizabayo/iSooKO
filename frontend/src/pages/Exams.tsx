import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, FileText, ArrowRight, Calendar, CircleAlert } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import ExamModal from '../components/exams/ExamModal';
// import { authService } from '../services/authService';

const Exams = () => {
    // const user = authService.getCurrentUser();
    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [isExamModalOpen, setIsExamModalOpen] = useState(false);

    const upcomingExams = [
        { id: 1, title: 'JavaScript Fundamentals Final', course: 'Web Development', duration: 60, date: 'Today, 3:00 PM', status: 'upcoming', type: 'Final Exam' },
        { id: 2, title: 'React Components Quiz', course: 'React Mastery', duration: 30, date: 'Tomorrow, 10:00 AM', status: 'upcoming', type: 'Quiz' },
        { id: 3, title: 'Full Stack Project Assessment', course: 'Full Stack Development', duration: 90, date: 'Feb 2, 2:00 PM', status: 'scheduled', type: 'Project' },
    ];

    const completedExams = [
        { id: 4, title: 'HTML & CSS Basics', course: 'Web Development', score: 95, date: 'Jan 20, 2026', type: 'Quiz' },
        { id: 5, title: 'JavaScript ES6 Features', course: 'Web Development', score: 88, date: 'Jan 15, 2026', type: 'Midterm' },
    ];

    const handleOpenExam = (exam: any) => {
        setSelectedExam(exam);
        setIsExamModalOpen(true);
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] px-4 lg:px-8 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-14 w-14 rounded-2xl bg-yellow-500 flex items-center justify-center">
                                <Shield className="h-7 w-7 text-[#0A2540]" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black text-white">Proctored Exams</h1>
                                <p className="text-blue-200 font-medium mt-1">Secure online assessments</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8 max-w-7xl mx-auto">
                    {/* Info Banner */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <CircleAlert className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-black text-blue-900 mb-2">Exam Requirements</h3>
                                <ul className="text-sm text-blue-800 space-y-1 font-medium">
                                    <li>• Webcam must be enabled during the entire exam</li>
                                    <li>• Keep your face visible at all times</li>
                                    <li>• Do not switch tabs or leave the browser</li>
                                    <li>• Ensure stable internet connection</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <Calendar className="h-6 w-6 text-blue-600" />
                            Upcoming Exams
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {upcomingExams.map((exam, i) => (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    onClick={() => handleOpenExam(exam)}
                                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                                            <FileText className="h-7 w-7 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${exam.status === 'upcoming'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {exam.status === 'upcoming' ? 'Ready to Start' : 'Scheduled'}
                                            </span>
                                            <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">
                                                {exam.title}
                                            </h3>
                                            <p className="text-sm text-slate-600 font-medium mt-1">{exam.course}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <span className="font-bold">{exam.duration} minutes</span>
                                        </div>
                                        <span className="text-slate-400">•</span>
                                        <span className="font-medium">{exam.date}</span>
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-[#0A2540] text-white rounded-xl font-bold hover:bg-yellow-500 hover:text-[#0A2540] transition-all group-hover:shadow-lg">
                                        Start Exam
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Completed Exams */}
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-green-600" />
                            Completed Exams
                        </h2>
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-xs font-black text-slate-900 uppercase tracking-wider">Exam</th>
                                            <th className="text-left px-6 py-4 text-xs font-black text-slate-900 uppercase tracking-wider">Course</th>
                                            <th className="text-left px-6 py-4 text-xs font-black text-slate-900 uppercase tracking-wider">Type</th>
                                            <th className="text-left px-6 py-4 text-xs font-black text-slate-900 uppercase tracking-wider">Score</th>
                                            <th className="text-left px-6 py-4 text-xs font-black text-slate-900 uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {completedExams.map((exam) => (
                                            <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-900">{exam.title}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600 font-medium">{exam.course}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                                        {exam.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-black text-lg ${exam.score >= 90 ? 'text-green-600' :
                                                        exam.score >= 70 ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                        {exam.score}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-slate-600 font-medium">{exam.date}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Modal */}
            {selectedExam && (
                <ExamModal
                    isOpen={isExamModalOpen}
                    onClose={() => setIsExamModalOpen(false)}
                    exam={selectedExam}
                />
            )}
        </div>
    );
};

export default Exams;

