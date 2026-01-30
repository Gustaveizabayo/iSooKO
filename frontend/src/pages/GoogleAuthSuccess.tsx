import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, CircleCheck } from 'lucide-react';
import { authService } from '../services/authService';
import { toast } from 'sonner';

const GoogleAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogleAuth = async () => {
            const token = searchParams.get('token');
            const refreshToken = searchParams.get('refreshToken');
            const userId = searchParams.get('userId');
            const email = searchParams.get('email');
            const name = searchParams.get('name');
            const role = searchParams.get('role');

            if (!token || !userId) {
                toast.error('Authentication failed. Please try again.');
                navigate('/login');
                return;
            }

            // Store auth data
            const user = {
                id: userId,
                email: email || '',
                name: name || '',
                role: role || 'STUDENT',
            };

            authService.setToken(token);
            authService.setRefreshToken(refreshToken || '');
            authService.setUser(user);

            // Show success message
            toast.success(`Welcome back to iSooKO, ${name}!`, {
                duration: 4000,
            });

            // Redirect based on role
            setTimeout(() => {
                switch (role) {
                    case 'ADMIN':
                        navigate('/admin');
                        break;
                    case 'INSTRUCTOR':
                        navigate('/instructor');
                        break;
                    default:
                        navigate('/dashboard');
                }
            }, 1500);
        };

        handleGoogleAuth();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                >
                    <CircleCheck className="h-10 w-10 text-green-600" />
                </motion.div>

                <h2 className="text-3xl font-black text-[#0f2238] mb-3">
                    Authentication Successful!
                </h2>

                <p className="text-slate-600 font-medium mb-8">
                    Redirecting you to your dashboard...
                </p>

                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block"
                >
                    <Loader2 className="h-8 w-8 text-yellow-500" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default GoogleAuthSuccess;

