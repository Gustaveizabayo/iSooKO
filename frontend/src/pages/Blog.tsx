import { motion } from 'framer-motion';
import { Newspaper, Calendar, User, ArrowRight, Tag, BookOpen } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';

const Blog = () => {
    const featuredPost = {
        title: "The Future of AI in Education: Personalized Learning at Scale",
        excerpt: "Discover how artificial intelligence is transforming the way we learn, making education more accessible, personalized, and effective for students worldwide.",
        author: "Dr. Sarah Chen",
        date: "Jan 28, 2026",
        category: "EdTech",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
    };

    const posts = [
        {
            title: "Top 10 High-Demand Skills for 2026",
            excerpt: "Stay ahead of the curve with our comprehensive guide to the most sought-after skills in the tech and business sectors.",
            author: "James Wilson",
            date: "Jan 25, 2026",
            category: "Career Growth",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Micro-Learning: Why Shorter is Better",
            excerpt: "Explore the science behind micro-learning and why bite-sized content leads to better retention and engagement.",
            author: "Emily Rodriguez",
            date: "Jan 22, 2026",
            category: "Learning Science",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Building a Portfolio That Gets You Hired",
            excerpt: "Practical tips and examples for creating a standout portfolio that showcases your skills to potential employers.",
            author: "Michael Chang",
            date: "Jan 18, 2026",
            category: "Career Tips",
            image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "The Rise of Green Skills in the Global Economy",
            excerpt: "Sustainability is reshaping industries. Learn which green skills are becoming essential for the future workforce.",
            author: "Anna Kowalski",
            date: "Jan 15, 2026",
            category: "Sustainability",
            image: "https://images.unsplash.com/photo-1473341304170-5799a28c34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        },
        {
            title: "Mastering Remote Collaboration Tools",
            excerpt: "A deep dive into the essential tools and strategies for effective teamwork in a distributed work environment.",
            author: "David Park",
            date: "Jan 10, 2026",
            category: "Productivity",
            image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            {/* Header */}
            <div className="bg-white pt-32 pb-12 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-6">
                            <Newspaper className="h-6 w-6 text-blue-600 mr-2" />
                            <span className="text-blue-800 font-bold">The iSooKO Blog</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#0A2540] mb-6">
                            Insights for Lifelong Learners
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Expert advice, industry trends, and learning strategies to help you reach your full potential.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Featured Post */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 relative rounded-3xl overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                    <img
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full md:w-2/3">
                        <span className="inline-block px-4 py-2 bg-yellow-500 text-[#0A2540] rounded-xl font-bold mb-4">
                            Featured Article
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                            {featuredPost.title}
                        </h2>
                        <p className="text-white/90 text-lg mb-6 line-clamp-2">
                            {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-white/80">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{featuredPost.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{featuredPost.date}</span>
                            </div>
                            <button className="hidden md:flex items-center gap-2 text-yellow-500 font-bold hover:text-yellow-400 transition-colors ml-auto">
                                Read Article <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Categories */}
                <div className="flex flex-wrap gap-4 mb-12 justify-center">
                    {['All Posts', 'EdTech', 'Career Growth', 'Learning Science', 'Sustainability', 'Productivity'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${i === 0
                                ? 'bg-[#0A2540] text-white shadow-lg'
                                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <motion.div
                            key={post.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col h-full"
                        >
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-blue-600 flex items-center gap-1">
                                        <Tag className="h-3 w-3" /> {post.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                                </div>
                                <h3 className="text-xl font-bold text-[#0A2540] mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                                <Link to="#" className="inline-flex items-center gap-2 text-yellow-600 font-bold text-sm hover:text-yellow-700 mt-auto">
                                    Read More <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter */}
                <div className="mt-20 bg-[#0A2540] rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-yellow-500 rounded-full blur-[100px] opacity-10"></div>
                    <div className="relative z-10">
                        <BookOpen className="h-12 w-12 text-yellow-500 mx-auto mb-6" />
                        <h2 className="text-3xl font-black text-white mb-4">Subscribe to Smart Learning</h2>
                        <p className="text-blue-200 mb-8 max-w-xl mx-auto">
                            Get the latest articles, learning tips, and course recommendations delivered straight to your inbox.
                        </p>
                        <div className="max-w-md mx-auto flex gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 rounded-xl border-0 focus:ring-4 focus:ring-yellow-500/30"
                            />
                            <button className="px-8 py-4 bg-yellow-500 text-[#0A2540] rounded-xl font-bold hover:bg-yellow-400 transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Blog;
