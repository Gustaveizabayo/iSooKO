import { motion } from 'framer-motion';
import { Eye, Headphones, MousePointer, Keyboard, Settings, MessageSquare, Accessibility as AccessIcon } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Accessibility = () => {
    const features = [
        {
            icon: Eye,
            title: "Visual Support",
            description: "High contrast modes, scalable text up to 200% without loss of content, and color-blind friendly palettes."
        },
        {
            icon: Headphones,
            title: "Auditory Support",
            description: "Closed captions for all video content, transcripts for audio materials, and compatibility with screen readers."
        },
        {
            icon: Keyboard,
            title: "Keyboard Navigation",
            description: "Full keyboard accessibility for all interactive elements, logical tab order, and visible focus indicators."
        },
        {
            icon: MousePointer,
            title: "Motor Support",
            description: "Large click targets, avoidance of rapid flashing content, and support for voice control software."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] pt-32 pb-24 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 border border-white/20">
                        <AccessIcon className="h-6 w-6 text-yellow-500 mr-2" />
                        <span className="text-white font-bold">Accessibility Statement</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                        Learning Without <span className="text-yellow-500">Barriers</span>
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                        We are committed to making education accessible to everyone, regardless of ability or technology.
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Introduction */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-black text-[#0A2540] mb-6">Our Commitment</h2>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        iSooKO is dedicated to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all"
                        >
                            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                                <feature.icon className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0A2540] mb-4">{feature.title}</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Standards & Feedback */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#0A2540] rounded-3xl p-8 md:p-12 text-white">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                                <Settings className="h-6 w-6 text-yellow-500" />
                            </div>
                            <h3 className="text-2xl font-black">Conformance Status</h3>
                        </div>
                        <p className="text-blue-200 leading-relaxed mb-6">
                            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
                        </p>
                        <p className="text-white font-bold text-lg">
                            iSooKO is partially conformant with WCAG 2.1 level AA.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-black text-[#0A2540]">Feedback</h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-8">
                            We welcome your feedback on the accessibility of iSooKO. Please let us know if you encounter accessibility barriers on iSooKO.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-slate-700">
                                <strong className="text-[#0A2540]">Email:</strong> accessibility@isooko.com
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <strong className="text-[#0A2540]">Phone:</strong> +1 (234) 567-890
                            </li>
                            <li className="flex items-center gap-3 text-slate-700">
                                <strong className="text-[#0A2540]">Response Time:</strong> Within 2 business days
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Accessibility;
