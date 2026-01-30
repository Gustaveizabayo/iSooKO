import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Trophy,
    X,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { toast } from 'sonner';
import { authService } from '../services/authService';

const InstructorApplication = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        bio: '',
        expertise: [] as string[],
        experience: '5',
        website: '',
        linkedin: '',
        motivation: ''
    });

    const [newExpertise, setNewExpertise] = useState('');

    const handleAddExpertise = (e: React.FormEvent) => {
        e.preventDefault();
        if (newExpertise && !formData.expertise.includes(newExpertise)) {
            setFormData({
                ...formData,
                expertise: [...formData.expertise, newExpertise]
            });
            setNewExpertise('');
        }
    };

    const removeExpertise = (item: string) => {
        setFormData({
            ...formData,
            expertise: formData.expertise.filter(e => e !== item)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.expertise.length === 0) {
            toast.error('Please add at least one area of expertise');
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast.success('Application submitted successfully!');
            // Redirect to pending page
            navigate('/instructor/pending');
        } catch (error) {
            toast.error('Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-[#0f2238] pt-32 pb-24 px-4 text-center relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[100px]"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-500 blur-[100px]"></div>
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-bold mb-6 backdrop-blur-sm border border-white/10"
                        >
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            Join 500+ Expert Instructors
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
                        >
                            Become an <span className="text-yellow-500">iSooKO</span> Instructor
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-300 max-w-2xl mx-auto font-medium"
                        >
                            Share your expertise with thousands of eager learners and build your teaching career with us.
                        </motion.p>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="relative z-20 -mt-16 px-4 max-w-7xl mx-auto mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: '💰', title: 'Earn Revenue', desc: 'Keep 70% of your course earnings' },
                            { icon: '👥', title: 'Reach Students', desc: 'Access our global student community' },
                            { icon: '🏆', title: 'Build Your Brand', desc: 'Establish yourself as an expert' },
                            { icon: '🎓', title: 'Make Impact', desc: 'Transform lives through education' },
                        ].map((benefit, i) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center hover:transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="h-16 w-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">
                                    {benefit.icon}
                                </div>
                                <h3 className="text-lg font-black text-[#0f2238] mb-2">{benefit.title}</h3>
                                <p className="text-sm text-slate-500 font-bold">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Application Form */}
                <section className="max-w-3xl mx-auto px-4 pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden"
                    >
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-2xl font-black text-[#0f2238]">Apply to Become an Instructor</h2>
                        </div>

                        <div className="p-8 md:p-10">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-[#0f2238] mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0f2238] mb-2">
                                        Professional Bio
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-slate-400 min-h-[120px] resize-none"
                                        placeholder="Tell us about your background and expertise..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0f2238] mb-2">
                                        Areas of Expertise
                                    </label>
                                    <div className="flex gap-2 mb-3">
                                        <input
                                            type="text"
                                            value={newExpertise}
                                            onChange={(e) => setNewExpertise(e.target.value)}
                                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-slate-400"
                                            placeholder="Add expertise (e.g., Web Development)"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddExpertise}
                                            className="px-6 py-3 bg-white border-2 border-slate-200 text-[#0f2238] font-bold rounded-xl hover:bg-slate-50 transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.expertise.map((item, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold"
                                            >
                                                {item}
                                                <button
                                                    type="button"
                                                    onClick={() => removeExpertise(item)}
                                                    className="hover:text-blue-900"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0f2238] mb-2">
                                        Years of Experience
                                    </label>
                                    <select
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all cursor-pointer appearance-none bg-white"
                                        required
                                    >
                                        <option value="" disabled>Select experience level</option>
                                        <option value="1">1 year</option>
                                        <option value="2">2 years</option>
                                        <option value="3">3 years</option>
                                        <option value="4">4 years</option>
                                        <option value="5+">5+ years</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0f2238] mb-2">
                                        Portfolio/Website URL (optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="https://yourwebsite.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0f2238] mb-2">
                                        LinkedIn Profile (optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.linkedin}
                                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-slate-400"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#0f2238] mb-2">
                                        Why do you want to teach on iSooKO?
                                    </label>
                                    <textarea
                                        value={formData.motivation}
                                        onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all placeholder:text-slate-400 min-h-[120px] resize-none"
                                        placeholder="Share your motivation and what you hope to achieve..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-[#0f2238] rounded-xl font-black text-lg transition-all shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <span className="text-xl">→</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default InstructorApplication;

