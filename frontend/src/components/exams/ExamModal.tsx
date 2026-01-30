import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Camera, Eye, AlertTriangle, Clock, ArrowRight, X, Video } from 'lucide-react';

interface ExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    exam: {
        title: string;
        duration: number;
        course: string;
    };
}

const ExamModal = ({ isOpen, onClose, exam }: ExamModalProps) => {
    const [cameraEnabled, setCameraEnabled] = useState(false);

    const requirements = [
        { icon: Camera, text: 'Webcam access enabled', status: cameraEnabled },
        { icon: Eye, text: 'Keep your face visible at all times', status: true },
        { icon: AlertTriangle, text: 'Do not switch tabs or leave the browser', status: true },
    ];

    const handleEnableCamera = () => {
        // In a real app, this would request camera permissions
        setCameraEnabled(true);
    };

    const handleStartExam = () => {
        if (!cameraEnabled) {
            alert('Please enable your camera before starting the exam.');
            return;
        }
        // Navigate to exam page or start exam logic
        alert('Starting exam...');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-[#0A2540] to-[#1a3a5a] p-8 text-center">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                                >
                                    <X className="h-6 w-6" />
                                </button>

                                <div className="h-16 w-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-yellow-400" />
                                </div>

                                <h2 className="text-2xl font-black text-white mb-2">
                                    Proctored Exam
                                </h2>
                                <p className="text-blue-200 text-sm font-medium">
                                    {exam.course}
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                {/* Camera Preview */}
                                <div className="mb-6 rounded-2xl bg-slate-100 p-8 text-center">
                                    {cameraEnabled ? (
                                        <div className="space-y-3">
                                            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                                                <Video className="h-6 w-6 text-green-600" />
                                            </div>
                                            <p className="text-sm font-bold text-green-600">Camera Enabled</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <Camera className="h-12 w-12 text-slate-400 mx-auto" />
                                            <button
                                                onClick={handleEnableCamera}
                                                className="px-6 py-2.5 bg-[#0A2540] text-white text-sm font-bold rounded-xl hover:bg-yellow-500 hover:text-[#0A2540] transition-all"
                                            >
                                                Enable Camera
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Requirements */}
                                <div className="space-y-3 mb-6">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                                        Exam Requirements
                                    </h3>
                                    {requirements.map((req, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${req.status ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                <req.icon className={`h-4 w-4 ${req.status ? 'text-green-600' : 'text-red-600'
                                                    }`} />
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium pt-1">
                                                {req.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Duration */}
                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                        <span className="text-sm font-bold text-slate-900">Duration</span>
                                    </div>
                                    <span className="text-sm font-black text-yellow-600">
                                        {exam.duration} minutes
                                    </span>
                                </div>

                                {/* Start Button */}
                                <button
                                    onClick={handleStartExam}
                                    disabled={!cameraEnabled}
                                    className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A2540] py-4 text-base font-black text-white shadow-xl shadow-[#0A2540]/20 transition-all hover:bg-yellow-500 hover:text-[#0A2540] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Start Exam
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ExamModal;

