import { motion } from 'framer-motion';
import { Briefcase, Users, Heart, Zap, Globe, MapPin, Clock, ArrowRight } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Careers = () => {
    const benefits = [
        { icon: Heart, title: 'Health & Wellness', description: 'Comprehensive medical, dental, and vision coverage for you and your family.' },
        { icon: Zap, title: 'Continuous Growth', description: 'Annual learning stipend, mentorship programs, and career development paths.' },
        { icon: Clock, title: 'Flexible Hours', description: 'Work-life balance is priority. Choose hours that work best for your productivity.' },
        { icon: Globe, title: 'Remote-First', description: 'Work from anywhere in the world. We support digital nomads and home offices.' },
    ];

    const openings = [
        { title: 'Senior Full Stack Engineer', dept: 'Engineering', location: 'Remote', type: 'Full-time' },
        { title: 'Product Designer', dept: 'Design', location: 'Remote (US/EU)', type: 'Full-time' },
        { title: 'Course Content Strategist', dept: 'Content', location: 'London, UK', type: 'Hybrid' },
        { title: 'Customer Success Manager', dept: 'Support', location: 'Remote', type: 'Full-time' },
        { title: 'Marketing Lead', dept: 'Marketing', location: 'New York, USA', type: 'Hybrid' },
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
                        <Briefcase className="h-6 w-6 text-yellow-500 mr-2" />
                        <span className="text-white font-bold">Join Our Team</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        Build the Future of <span className="text-yellow-500">Education</span>
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                        We're on a mission to democratize learning globally. Join us in creating a world where anyone, anywhere can transform their life through education.
                    </p>
                    <button className="px-8 py-4 bg-yellow-500 text-[#0A2540] rounded-xl font-black hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl">
                        View Open Positions
                    </button>
                </motion.div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-[#0A2540] mb-4">Why Work at iSooKO?</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        We believe in taking care of our people so they can take care of our learners.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={benefit.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                                <benefit.icon className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0A2540] mb-3">{benefit.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Open Roles */}
            <div className="bg-white py-20 border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="text-3xl font-black text-[#0A2540]">Open Positions</h2>
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                            {openings.length} Roles Available
                        </span>
                    </div>

                    <div className="space-y-4">
                        {openings.map((role, index) => (
                            <motion.div
                                key={role.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-2xl border border-slate-200 hover:border-yellow-500 hover:shadow-md transition-all bg-slate-50 hover:bg-white cursor-pointer"
                            >
                                <div className="mb-4 md:mb-0 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-[#0A2540] group-hover:text-blue-600 transition-colors">{role.title}</h3>
                                    <div className="flex items-center gap-4 mt-2 justify-center md:justify-start">
                                        <span className="flex items-center gap-1 text-sm text-slate-500">
                                            <Users className="h-4 w-4" /> {role.dept}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin className="h-4 w-4" /> {role.location}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-slate-500">
                                            <Clock className="h-4 w-4" /> {role.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:bg-yellow-500 group-hover:border-yellow-500 transition-colors">
                                    <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#0A2540]" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Careers;
