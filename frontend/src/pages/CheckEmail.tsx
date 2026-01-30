import { motion } from 'framer-motion';
import { Mail, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
// // import { useNavigate } from 'react-router-dom';

const CheckEmail = () => {
    // const navigate = useNavigate();

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
                    className="w-full max-w-md p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-xl text-center"
                >
                    <div className="h-24 w-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Mail className="h-12 w-12" />
                    </div>

                    <h2 className="text-3xl font-black text-[#0f2238] mb-4">Check your email</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        We've sent a verification link to your email address.
                        Please click the link inside to activate your account.
                    </p>

                    <button
                        onClick={() => window.open('https://gmail.com', '_blank')}
                        className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 py-4 text-[#0f2238] font-bold hover:bg-slate-100 transition-all mb-4"
                    >
                        Open Gmail
                        <ArrowRight className="h-4 w-4" />
                    </button>

                    <p className="text-xs text-slate-400 font-medium">
                        Did not receive the email? <span className="text-blue-600 cursor-pointer hover:underline">Resend</span>
                    </p>

                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default CheckEmail;
