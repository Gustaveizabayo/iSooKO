import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleCheck, Loader2, CircleX, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import api from '../services/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            const email = searchParams.get('email');
            const code = searchParams.get('code');

            if (!email || !code) {
                setStatus('ERROR');
                setMessage('Invalid verification link.');
                return;
            }

            try {
                // Determine if this is initial status check or active verification
                const response = await api.post('/auth/verify-otp', { email, otpCode: code });

                if (response.data.accessToken) {
                    localStorage.setItem('token', response.data.accessToken);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    setStatus('SUCCESS');
                } else {
                    setStatus('ERROR');
                    setMessage('Verification failed. Please try again.');
                }

            } catch (err: any) {
                console.error(err);
                setStatus('ERROR');
                setMessage(err.response?.data?.message || 'Verification failed. Link may be expired.');
            }
        };

        // Only verifying once on mount
        verify();
    }, [searchParams]);

    const handleContinue = () => {
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            <Navbar />
            <div className="absolute inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 right-0 h-[800px] w-[800px] rounded-full bg-blue-50/50 blur-[120px]" />
                <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-yellow-50/30 blur-[100px]" />
            </div>

            <main className="pt-40 pb-32 flex items-center justify-center min-h-[80vh]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-xl text-center"
                >

                    {status === 'LOADING' && (
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-6" />
                            <h2 className="text-2xl font-black text-[#0f2238]">Verifying Email...</h2>
                            <p className="mt-2 text-slate-500 font-medium">Please wait while we secure your account.</p>
                        </div>
                    )}

                    {status === 'SUCCESS' && (
                        <div className="flex flex-col items-center">
                            <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                <CircleCheck className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-black text-[#0f2238]">Email Verified!</h2>
                            <p className="mt-2 text-slate-500 font-medium mb-8">Your account has been successfully activated.</p>

                            <button
                                onClick={handleContinue}
                                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f2238] py-4 text-white font-black hover:bg-yellow-500 hover:text-[#0f2238] transition-all"
                            >
                                Continue to Dashboard
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    )}

                    {status === 'ERROR' && (
                        <div className="flex flex-col items-center">
                            <div className="h-20 w-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                                <CircleX className="h-10 w-10" />
                            </div>
                            <h2 className="text-2xl font-black text-[#0f2238]">Verification Failed</h2>
                            <p className="mt-2 text-slate-500 font-medium mb-8">{message}</p>

                            <button
                                onClick={() => navigate('/login')}
                                className="text-sm font-bold text-slate-400 hover:text-[#0f2238] transition-colors"
                            >
                                Return to Login
                            </button>
                        </div>
                    )}
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default VerifyEmail;

