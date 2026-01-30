import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, BarChart3, ShoppingBag, Globe } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const CookiePolicy = () => {
    const cookieTypes = [
        {
            icon: Shield,
            title: 'Essential Cookies',
            status: 'Always Active',
            description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
            examples: [
                'Session identifiers for login',
                'Security tokens (CSRF protection)',
                'Load balancing preferences',
                'Cookie consent settings'
            ]
        },
        {
            icon: Settings,
            title: 'Functional Cookies',
            status: 'Optional',
            description: 'These cookies enable the website to provide enhanced functionality and personalization.',
            examples: [
                'Language preferences',
                'Video player settings',
                'Remembering your username',
                'Chat widget state'
            ]
        },
        {
            icon: BarChart3,
            title: 'Analytics Cookies',
            status: 'Optional',
            description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
            examples: [
                'Page visit counts',
                'Traffic source tracking',
                'User journey analysis',
                'Performance monitoring'
            ]
        },
        {
            icon: ShoppingBag,
            title: 'Marketing Cookies',
            status: 'Optional',
            description: 'These cookies may be set through our site by our advertising partners to build a profile of your interests.',
            examples: [
                'Ad personalization',
                'Campaign tracking',
                'Retargeting audience lists',
                'Social media integration'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-yellow-500 mb-6">
                            <Cookie className="h-8 w-8 text-[#0A2540]" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                            Cookie Policy
                        </h1>
                        <p className="text-xl text-blue-200 mb-4">
                            Understanding how we use cookies
                        </p>
                        <p className="text-sm text-blue-300">
                            Last updated: January 29, 2026
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Introduction */}
                <div className="bg-white rounded-2xl p-8 border border-slate-200 mb-12">
                    <h2 className="text-2xl font-black text-slate-900 mb-4">What are cookies?</h2>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        At iSooKO, we use cookies to improve your learning experience, remember your preferences, and help us understand how you use our platform.
                    </p>
                </div>

                {/* Cookie Types Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {cookieTypes.map((type, index) => (
                        <motion.div
                            key={type.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <type.icon className="h-6 w-6 text-blue-600" />
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${type.status === 'Always Active'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {type.status}
                                </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">{type.title}</h3>
                            <p className="text-sm text-slate-600 mb-4 h-10">{type.description}</p>

                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Examples:</p>
                                <ul className="space-y-1">
                                    {type.examples.map((example, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                            {example}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cookie Management */}
                <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] rounded-2xl p-8 text-white text-center">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h2 className="text-2xl font-black mb-4">Managing Your Preferences</h2>
                    <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
                        You can change your cookie preferences at any time. You can also control cookies through your browser settings, but please note that disabling certain cookies may affect the functionality of our website.
                    </p>
                    <button className="px-8 py-3 bg-yellow-500 text-[#0A2540] rounded-xl font-bold hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-lg">
                        Update Cookie Settings
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CookiePolicy;
