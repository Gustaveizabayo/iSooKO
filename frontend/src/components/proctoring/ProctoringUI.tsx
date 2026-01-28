import { useState, useEffect } from 'react';
import { Camera, ShieldAlert, UserCheck, Maximize, Settings, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { proctoringService } from '../../services/proctoringService';

const ProctoringUI = ({ attemptId }: { attemptId?: string }) => {
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [violations, setViolations] = useState(0);
    const [status, setStatus] = useState('Idle');
    const [lastViolation, setLastViolation] = useState<string | null>(null);

    // Simulated AI logic that could eventually be a real WebWorker or ML model
    useEffect(() => {
        if (isMonitoring) {
            setStatus('Secure');
            const interval = setInterval(() => {
                const rand = Math.random();

                let type = '';
                let severity = 'LOW';

                if (rand > 0.95) {
                    type = 'FACE_LOST';
                    severity = 'HIGH';
                } else if (rand > 0.90) {
                    type = 'MULTIPLE_FACES';
                    severity = 'MEDIUM';
                }

                if (type) {
                    setStatus(type.replace('_', ' '));
                    setViolations(prev => prev + 1);
                    setLastViolation(type);

                    // Log to real backend if attemptId exists
                    if (attemptId) {
                        proctoringService.logViolation(attemptId, { type, severity });
                    }

                    setTimeout(() => {
                        setStatus('Secure');
                        setLastViolation(null);
                    }, 3000);
                }
            }, 8000);
            return () => clearInterval(interval);
        }
    }, [isMonitoring, attemptId]);

    return (
        <div className="group relative rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all hover:shadow-blue-100/50">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`flex h - 10 w - 10 items - center justify - center rounded - xl transition - colors ${status !== 'Secure' && status !== 'Idle' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 text-blue-600'
                        } `}>
                        <Camera className="h-5 w-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 leading-none mb-1">AI Proctor Shield</h2>
                        <div className="flex items-center gap-2">
                            <span className={`h - 1.5 w - 1.5 rounded - full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-slate-300'} `} />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                {isMonitoring ? 'Encrypted Stream' : 'Ready to Shield'}
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => setIsMonitoring(!isMonitoring)}
                    className={`rounded - xl px - 4 py - 2 text - [10px] font - black uppercase tracking - widest transition - all ${isMonitoring ? 'bg-red-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                        } `}
                >
                    {isMonitoring ? 'Disable' : 'Initialize'}
                </button>
            </div>

            {/* Video Feed */}
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950">
                {!isMonitoring ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 text-slate-700">
                        <ShieldAlert className="h-10 w-10 opacity-10" />
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">Privacy Protected</p>
                    </div>
                ) : (
                    <>
                        <img
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                            className={`h - full w - full object - cover transition - all duration - 700 ${lastViolation ? 'grayscale sepia contrast-150 scale-105' : 'grayscale opacity-60'
                                } `}
                            alt="Live stream"
                        />

                        {/* HUD */}
                        <div className="absolute inset-0 p-4 font-mono">
                            <div className="flex h-full flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="rounded border border-white/10 bg-black/40 px-2 py-1 text-[8px] text-blue-400 backdrop-blur-md">
                                        MT-PR-LOG: AUTO_V2
                                    </div>
                                    <AnimatePresence>
                                        {lastViolation && (
                                            <motion.div
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                exit={{ x: 20, opacity: 0 }}
                                                className="flex items-center gap-2 rounded bg-red-600 px-2 py-1 text-[8px] text-white"
                                            >
                                                <AlertTriangle className="h-3 w-3" />
                                                FLAGGED: {lastViolation}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex justify-center">
                                    <div className={`rounded - xl px - 5 py - 1 text - [10px] font - black uppercase tracking - widest backdrop - blur - xl border ${status === 'Secure' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/30 text-red-500 border-red-500/50 scale-110'
                                        } transition - all duration - 300`}>
                                        {status}
                                    </div>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="space-y-1.5 opacity-60">
                                        <div className="h-[2px] w-20 bg-white/20">
                                            <div className="h-full w-[70%] bg-blue-500" />
                                        </div>
                                        <div className="h-[2px] w-16 bg-white/20">
                                            <div className="h-full w-[90%] bg-green-500" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 text-white/40">
                                        <Settings className="h-3 w-3" />
                                        <Maximize className="h-3 w-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                    <UserCheck className={`h - 4 w - 4 ${violations > 0 ? 'text-amber-500' : 'text-slate-400'} `} />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Infractions</span>
                </div>
                <span className={`text - sm font - black ${violations > 0 ? 'text-red-600' : 'text-slate-900'} `}>
                    {String(violations).padStart(2, '0')}
                </span>
            </div>
        </div>
    );
};

export default ProctoringUI;
