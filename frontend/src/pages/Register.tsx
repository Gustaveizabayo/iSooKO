import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, Check, Lightbulb, CircleCheck, Users, Award, TrendingUp, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import GoogleLoginButton from '../components/auth/GoogleLoginButton';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreedToTerms) {
            setError('You must agree to the Terms of Service to continue.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await authService.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            navigate('/check-email');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: CircleCheck, text: 'Access to 500+ premium courses' },
        { icon: Users, text: 'Learn from industry experts' },
        { icon: Award, text: 'Earn certificates' },
        { icon: TrendingUp, text: 'Track your progress' },
        { icon: Lightbulb, text: 'Join our community' },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Blue Panel */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-[#0A2540] via-[#0f2d4d] to-[#1a3a5a] p-12 flex-col justify-between relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-yellow-500 flex items-center justify-center shadow-xl">
                        <Lightbulb className="h-7 w-7 text-[#0A2540]" />
                    </div>
                    <span className="text-2xl font-black text-white">iSooKO</span>
                </Link>

                {/* Content */}
                <div className="relative z-10">
                    <h1 className="text-5xl font-black text-white mb-6 leading-tight">
                        Join iSooKO<br />Today
                    </h1>
                    <p className="text-lg text-blue-100 mb-12 leading-relaxed">
                        Create your account and unlock unlimited access to world-class education.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 + index * 0.1 }}
                                className="flex items-center gap-3 text-blue-100"
                            >
                                <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                    <feature.icon className="h-5 w-5 text-yellow-400" />
                                </div>
                                <span className="font-medium">{feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <p className="text-sm text-blue-300 relative z-10">
                    © 2026 iSooKO. Empowering learners worldwide.
                </p>
            </motion.div>

            {/* Right Side - Registration Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md my-8"
                >
                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0A2540] font-bold text-sm mb-6 transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    {/* Mobile Logo */}
                    <Link to="/" className="flex lg:hidden items-center gap-3 mb-8 justify-center">
                        <div className="h-12 w-12 rounded-2xl bg-yellow-500 flex items-center justify-center shadow-xl">
                            <Lightbulb className="h-7 w-7 text-[#0A2540]" />
                        </div>
                        <span className="text-2xl font-black text-[#0A2540]">iSooKO</span>
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-[#0A2540] mb-3">
                            Create Account
                        </h2>
                        <p className="text-slate-600 font-medium">
                            Start your learning journey with iSooKO today
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 text-center animate-shake mb-6">
                            {error}
                        </div>
                    )}

                    {/* Google Register Button */}
                    <GoogleLoginButton text="Sign up with Google" />

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white px-4 text-slate-400 font-black">Or register with email</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0f2238] transition-colors" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    autoComplete="off"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-bold text-[#0f2238] placeholder-slate-400 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0f2238] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter your email address"
                                    autoComplete="off"
                                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-bold text-[#0f2238] placeholder-slate-400 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0f2238] transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Enter your password"
                                        autoComplete="new-password"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm font-bold text-[#0f2238] placeholder-slate-400 focus:border-yellow-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-yellow-500/10 transition-all outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-widest ml-1">Confirm</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0f2238] transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Re-enter your password"
                                        autoComplete="new-password"
                                        className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm font-bold text-[#0f2238] placeholder-slate-400 focus:outline-none focus:ring-4 transition-all outline-none ${formData.confirmPassword && formData.password !== formData.confirmPassword
                                            ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-500/10'
                                            : 'border-slate-200 bg-slate-50/50 focus:border-yellow-500 focus:bg-white focus:ring-yellow-500/10'
                                            }`}
                                    />
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-xs text-red-600 font-bold ml-1">⚠ Passwords do not match</p>
                                )}
                            </div>
                        </div>

                        <div
                            className="flex items-center gap-3 py-2 cursor-pointer group"
                            onClick={() => setAgreedToTerms(prev => !prev)}
                        >
                            <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${agreedToTerms ? 'border-yellow-500 bg-yellow-500' : 'border-slate-300 bg-white group-hover:border-yellow-400'}`}>
                                {agreedToTerms && <Check className="h-3 w-3 text-[#0f2238] font-bold" />}
                            </div>
                            <p className="text-xs font-medium text-slate-500 select-none">
                                I agree to the <span className="text-[#0f2238] font-black hover:underline" onClick={(e) => e.stopPropagation()}>Terms of Service</span> and <span className="text-[#0f2238] font-black hover:underline" onClick={(e) => e.stopPropagation()}>Privacy Policy</span>.
                            </p>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0A2540] py-4 text-base font-black text-white shadow-xl shadow-[#0A2540]/20 transition-all hover:bg-yellow-500 hover:text-[#0A2540] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-black text-[#0A2540] hover:text-yellow-600 transition-colors">
                            Sign In
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;

