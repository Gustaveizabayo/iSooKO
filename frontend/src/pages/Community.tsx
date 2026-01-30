import { motion } from 'framer-motion';
import { Users, MessageCircle, Heart, Share2, Calendar, Award, ExternalLink } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Community = () => {
    const events = [
        {
            date: "Feb 15",
            time: "2:00 PM EST",
            title: "Global Learning Summit 2026",
            type: "Virtual Conference",
            attendees: "15k+"
        },
        {
            date: "Feb 22",
            time: "11:00 AM EST",
            title: "Women in Tech: Career Panel",
            type: "Live Workshop",
            attendees: "3.2k"
        },
        {
            date: "Mar 05",
            time: "4:00 PM EST",
            title: "Building Scalable Systems with Node.js",
            type: "Tech Talk",
            attendees: "800+"
        }
    ];

    const discussions = [
        {
            topic: "Study Tips for Python Certification",
            author: "Sarah J.",
            replies: 45,
            tag: "Programming"
        },
        {
            topic: "How to stay motivated while learning remotely?",
            author: "Mike T.",
            replies: 128,
            tag: "Productivity"
        },
        {
            topic: "Project showcase: My first React App",
            author: "Elena R.",
            replies: 56,
            tag: "Showcase"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#0A2540] to-[#1a3a5a] pt-32 pb-24 text-center px-4 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-20 left-10 h-32 w-32 bg-yellow-500 rounded-full blur-[80px] opacity-20"></div>
                <div className="absolute bottom-20 right-10 h-40 w-40 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-6 border border-white/20">
                        <Users className="h-6 w-6 text-yellow-500 mr-2" />
                        <span className="text-white font-bold">Community Hub</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                        Learn, Share, <span className="text-yellow-500">Connect</span>
                    </h1>
                    <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
                        Join over 2 million learners worldwide. Share your journey, get help, and grow together.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-4 bg-yellow-500 text-[#0A2540] rounded-xl font-black hover:bg-yellow-400 transition-all transform hover:scale-105 shadow-xl">
                            Join Discussion
                        </button>
                        <button className="px-8 py-4 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                            Find a Mentor
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Stats */}
            <div className="bg-[#0f2d4d] border-y border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-black text-white mb-1">2M+</div>
                            <div className="text-sm font-bold text-blue-300 uppercase tracking-widest">Learners</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1">150+</div>
                            <div className="text-sm font-bold text-blue-300 uppercase tracking-widest">Countries</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1">50k+</div>
                            <div className="text-sm font-bold text-blue-300 uppercase tracking-widest">Discussions</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1">500+</div>
                            <div className="text-sm font-bold text-blue-300 uppercase tracking-widest">Events</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Events Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#0A2540] flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-yellow-500" />
                                Upcoming Events
                            </h2>
                            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</a>
                        </div>
                        <div className="space-y-4">
                            {events.map((event, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="flex gap-6">
                                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50 rounded-xl text-blue-700">
                                            <span className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</span>
                                            <span className="text-xl font-black">{event.date.split(' ')[1]}</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                                                    {event.type}
                                                </span>
                                                <span className="text-xs text-slate-400 font-medium">{event.time}</span>
                                            </div>
                                            <h3 className="font-bold text-[#0A2540] text-lg mb-1 group-hover:text-blue-600 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-slate-500 flex items-center gap-1">
                                                <Users className="h-3 w-3" /> {event.attendees} Attending
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Discussions Section */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-[#0A2540] flex items-center gap-3">
                                <MessageCircle className="h-6 w-6 text-yellow-500" />
                                Trending Discussions
                            </h2>
                            <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-700">View Forum</a>
                        </div>
                        <div className="space-y-4">
                            {discussions.map((topic, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group cursor-pointer"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                                            {topic.tag}
                                        </span>
                                        <span className="text-xs text-slate-400">• Posted by {topic.author}</span>
                                    </div>
                                    <h3 className="font-bold text-[#0A2540] text-lg mb-3 group-hover:text-blue-600 transition-colors">
                                        {topic.topic}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4 text-slate-400" />
                                            {topic.replies} replies
                                        </span>
                                        <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                            <Heart className="h-4 w-4 text-slate-400" /> Like
                                        </span>
                                        <span className="flex items-center gap-1 hover:text-blue-500 transition-colors ml-auto">
                                            <Share2 className="h-4 w-4 text-slate-400" /> Share
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Rewards Preview */}
                <div className="mt-20 bg-white rounded-3xl p-8 md:p-12 border border-slate-200 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                    <Award className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-[#0A2540] mb-4">Earn While You Learn</h2>
                    <p className="text-slate-600 max-w-xl mx-auto mb-8 text-lg">
                        Collect badges, climb the leaderboard, and earn exclusive rewards by contributing to the community.
                    </p>
                    <button className="px-8 py-4 bg-[#0A2540] text-white rounded-xl font-bold hover:bg-[#0f2d4d] transition-all inline-flex items-center gap-2 shadow-lg">
                        View Rewards Program <ExternalLink className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Community;
