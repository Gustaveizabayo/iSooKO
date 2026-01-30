import { motion } from 'framer-motion';
import { Newspaper, Mic, Award, Download, ArrowUpRight, Mail } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Press = () => {
    const pressReleases = [
        {
            date: "January 15, 2026",
            title: "iSooKO Reaches 1 Million Active Learners Milestone",
            source: "Official Press Release",
            link: "#"
        },
        {
            date: "December 10, 2025",
            title: "Introducing AI-Powered Proctoring for Secure Online Exams",
            source: "Product Announcement",
            link: "#"
        },
        {
            date: "November 05, 2025",
            title: "iSooKO Partners with Top Global Universities for Accredited Courses",
            source: "Partnership News",
            link: "#"
        }
    ];

    const mediaCoverage = [
        {
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/TechCrunch_logo.svg/1200px-TechCrunch_logo.svg.png",
            title: "How iSooKO is Democratizing Education in Emerging Markets",
            outlet: "TechCrunch",
            date: "Jan 2026"
        },
        {
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Forbes_logo.svg/2560px-Forbes_logo.svg.png",
            title: "The Top EdTech Startups to Watch in 2026",
            outlet: "Forbes",
            date: "Dec 2025"
        },
        {
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Wired_logo.svg/2560px-Wired_logo.svg.png",
            title: "The Future of Remote Proctoring is Here",
            outlet: "WIRED",
            date: "Nov 2025"
        }
    ];

    const assets = [
        { name: "Brand Guidelines", size: "2.4 MB", type: "PDF" },
        { name: "Logo Pack", size: "15 MB", type: "ZIP" },
        { name: "Leadership Photos", size: "48 MB", type: "ZIP" },
        { name: "Product Screenshots", size: "22 MB", type: "ZIP" },
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
                        <Mic className="h-6 w-6 text-yellow-500 mr-2" />
                        <span className="text-white font-bold">Newsroom</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        iSooKO in the News
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                        Latest updates, press releases, and media resources from the world's fastest-growing learning platform.
                    </p>
                    <a href="mailto:press@isooko.com" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#0A2540] rounded-xl font-bold hover:bg-slate-100 transition-all shadow-xl">
                        <Mail className="h-5 w-5" /> Contact Press Team
                    </a>
                </motion.div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Press Releases & Coverage */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Press Releases */}
                        <section>
                            <h2 className="text-2xl font-black text-[#0A2540] mb-8 flex items-center gap-3">
                                <Newspaper className="h-6 w-6 text-yellow-500" />
                                Latest Press Releases
                            </h2>
                            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                                {pressReleases.map((release, i) => (
                                    <div key={i} className="p-8 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                            <span className="text-sm font-bold text-slate-400">{release.date}</span>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit">
                                                {release.source}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#0A2540] mb-4 group-hover:text-blue-600 transition-colors">
                                            {release.title}
                                        </h3>
                                        <button className="flex items-center gap-2 text-sm font-bold text-slate-600 group-hover:text-[#0A2540] transition-colors">
                                            Read Release <ArrowUpRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Media Coverage */}
                        <section>
                            <h2 className="text-2xl font-black text-[#0A2540] mb-8 flex items-center gap-3">
                                <Award className="h-6 w-6 text-yellow-500" />
                                Media Coverage
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mediaCoverage.map((item, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all hover:-translate-y-1">
                                        <div className="h-12 mb-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                                            <img src={item.logo} alt={item.outlet} className="h-full object-contain" />
                                        </div>
                                        <h3 className="font-bold text-[#0A2540] mb-2">{item.title}</h3>
                                        <p className="text-sm text-slate-500">{item.outlet} • {item.date}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Media Kit */}
                    <div className="space-y-8">
                        <section className="bg-[#0A2540] rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-20 bg-yellow-500 rounded-full blur-[80px] opacity-20"></div>
                            <h2 className="text-2xl font-black mb-2 relative z-10">Brand Assets</h2>
                            <p className="text-blue-200 mb-8 max-w-xs relative z-10">
                                Official logos, photos, and resources for media usage.
                            </p>

                            <div className="space-y-4 relative z-10">
                                {assets.map((asset, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                                                <Download className="h-5 w-5 text-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">{asset.name}</p>
                                                <p className="text-xs text-blue-200">{asset.type} • {asset.size}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-4 bg-yellow-500 text-[#0A2540] rounded-xl font-bold hover:bg-yellow-400 transition-colors relative z-10">
                                Download All Assets
                            </button>
                        </section>

                        <section className="bg-white rounded-3xl p-8 border border-slate-200">
                            <h3 className="font-bold text-[#0A2540] mb-4">Media Contact</h3>
                            <p className="text-slate-600 mb-6 text-sm">
                                For press inquiries, interview requests, or additional information, please contact our communications team.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    press@isooko.com
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Press;
