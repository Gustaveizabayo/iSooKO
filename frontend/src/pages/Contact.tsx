import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
    ChevronDown,
    Linkedin,
    Twitter,
    Github,
    Globe,
    CircleCheck
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { toast } from 'sonner';
import api from '../services/api';

const Contact = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await api.post('/contact', formData);
            setIsSubmitted(true);
            toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
            window.scrollTo(0, 0);

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                service: '',
                message: ''
            });
        } catch (error: any) {
            console.error('Contact form error:', error);
            toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header Section */}
            <div className="bg-[#0f2238] pt-40 pb-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block rounded-full bg-yellow-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-500 mb-6">
                            Contact Us
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
                            Get in <span className="text-yellow-500">Touch</span>
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto font-medium text-lg">
                            Have questions or want to partner with us? We're here to help you unlock your professional potential.
                        </p>
                    </motion.div>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Send Us a Message Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm"
                    >
                        {isSubmitted ? (
                            <div className="text-center py-12">
                                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                    <CircleCheck className="h-10 w-10" />
                                </div>
                                <h2 className="text-2xl font-black text-[#0f2238] mb-4">Message Sent!</h2>
                                <p className="text-slate-500 font-medium">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="mt-8 font-black text-yellow-600 hover:text-yellow-700 transition-colors uppercase text-xs tracking-widest"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-[#0f2238] mb-3">Send Us a <span className="text-yellow-500">Message</span></h2>
                                    <p className="text-slate-500 font-medium text-sm">Fill out the form below and we'll get back to you within 24 hours.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">First Name *</label>
                                            <input
                                                required
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="First Name"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Last Name *</label>
                                            <input
                                                required
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Last Name"
                                                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Email Address *</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="email@example.com"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+250 7XX XXX XXX"
                                            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Service Interested In *</label>
                                        <div className="relative">
                                            <select
                                                required
                                                name="service"
                                                value={formData.service}
                                                onChange={handleChange}
                                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-900 hover:border-slate-300 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all outline-none cursor-pointer"
                                            >
                                                <option value="" disabled>Select a service</option>
                                                <option value="corporate">Corporate Training</option>
                                                <option value="partnership">Academic Partnership</option>
                                                <option value="instructor">Become an Instructor</option>
                                                <option value="other">Other Inquiry</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-slate-400">
                                                <ChevronDown className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">Your Message *</label>
                                        <textarea
                                            required
                                            rows={5}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us about your project or inquiry..."
                                            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 font-bold text-slate-900 placeholder-slate-400 hover:border-slate-300 focus:ring-4 focus:ring-yellow-500/10 focus:border-yellow-500 transition-all outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full rounded-2xl bg-[#0f2238] py-5 text-base font-black text-white shadow-xl hover:bg-yellow-500 hover:text-[#0f2238] transition-all flex items-center justify-center gap-3 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="h-5 w-5" />
                                    </button>
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 25 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:pl-10 space-y-12"
                    >
                        <div>
                            <h2 className="text-3xl font-black text-[#0f2238] mb-4">Contact <span className="text-yellow-500">Information</span></h2>
                            <p className="text-slate-500 font-medium">Reach out to us through any of these channels. We're here to help!</p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex gap-6">
                                <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-blue-600 shadow-sm">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#0f2238] uppercase tracking-widest mb-1">Visit Our Office</h4>
                                    <p className="text-slate-500 font-medium">KN 78 St Street, Kigali<br />Rwanda, East Africa</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="h-14 w-14 bg-yellow-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-yellow-600 shadow-sm">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#0f2238] uppercase tracking-widest mb-1">Call Us</h4>
                                    <p className="text-slate-500 font-medium">+250 786 656 352</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-indigo-600 shadow-sm">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#0f2238] uppercase tracking-widest mb-1">Email Us</h4>
                                    <p className="text-slate-500 font-medium">info@isooko.com<br />support@isooko.com</p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="h-14 w-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 text-orange-600 shadow-sm">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#0f2238] uppercase tracking-widest mb-1">Business Hours</h4>
                                    <p className="text-slate-500 font-medium">Mon - Fri: 8:00 AM - 6:00 PM<br />Sat: 9:00 AM - 1:00 PM</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-black text-[#0f2238] uppercase tracking-widest mb-6">Follow Us</h4>
                            <div className="flex gap-4">
                                {[Linkedin, Twitter, Github, Globe].map((Icon, i) => (
                                    <a key={i} href="#" className="h-12 w-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:bg-yellow-500 hover:text-[#0f2238] hover:border-yellow-500 transition-all shadow-sm">
                                        <Icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Interactive Map Placeholder */}
                        <div className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm grayscale hover:grayscale-0 transition-all duration-700 aspect-video relative group">
                            <div className="absolute inset-0 bg-[#0f2238]/5 group-hover:bg-transparent transition-colors z-10" />
                            <iframe
                                title="Office Location"
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                scrolling="no"
                                marginHeight={0}
                                marginWidth={0}
                                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Kigali,Rwanda+(iSooKO)&t=&z=14&ie=UTF8&iwloc=B&output=embed"
                            />
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Contact;

