import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal, BookOpen, Star, Clock, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseService } from '../services/courseService';
import Navbar from '../components/layout/Navbar';
import { Link } from 'react-router-dom';

const Courses = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [showFilters, setShowFilters] = useState(false);

    // Categories based on typical LMS data
    const categories = ['All', 'Computer Science', 'Data Science', 'Business', 'Art & Design', 'Marketing'];

    // Fetch courses with filters
    const { data: courses, isLoading, isError } = useQuery({
        queryKey: ['courses', searchQuery, selectedCategory, sortBy],
        queryFn: () => courseService.getAll({
            search: searchQuery,
            category: selectedCategory !== 'All' ? selectedCategory : undefined,
            sort: sortBy
        }),
    });

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl mb-4">
                        Discover Your Next <span className="text-blue-600">Masterclass</span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-slate-500 font-medium">
                        Expert-led courses designed to help you master new skills and advance your career in record time.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="relative flex-1 max-w-2xl">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search for courses, skills, or instructors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base font-bold text-slate-900 shadow-sm transition-all focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-100"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 rounded-2xl border px-6 py-4 text-sm font-bold transition-all ${showFilters ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2">
                            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="popular">Most Popular</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Categories Quick Filter */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mb-8 overflow-hidden"
                        >
                            <div className="flex flex-wrap gap-2 p-1">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                                : 'bg-white border border-slate-100 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Results Grid */}
                {isLoading ? (
                    <div className="flex h-96 flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Updating Catalog...</p>
                    </div>
                ) : isError ? (
                    <div className="rounded-3xl bg-red-50 p-12 text-center text-red-600">
                        <h3 className="text-xl font-bold mb-2">Failed to load courses</h3>
                        <p>Please check your connection and try again.</p>
                    </div>
                ) : courses?.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-slate-200 p-20 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                            <BookOpen className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">No Courses Found</h3>
                        <p className="text-slate-500 font-medium">We couldn't find anything matching your search criteria.</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                            className="mt-6 text-blue-600 font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {courses?.map((course: any, i: number) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all hover:shadow-2xl hover:shadow-blue-100/50"
                            >
                                <Link to={`/course/${course.id}`} className="absolute inset-0 z-10" />

                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        alt={course.title}
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                                            {course.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col p-6">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-amber-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="text-xs font-black">4.9</span>
                                            <span className="text-[10px] font-bold text-slate-400">(1.2k)</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-slate-400">
                                            <Clock className="h-3 w-3" />
                                            <span className="text-[10px] font-bold">{course.duration || '12'}h</span>
                                        </div>
                                    </div>

                                    <h3 className="mb-3 text-lg font-black text-slate-900 leading-snug line-clamp-2">
                                        {course.title}
                                    </h3>

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black uppercase">
                                                {course.instructor?.name?.charAt(0) || 'I'}
                                            </div>
                                            <span className="text-xs font-bold">{course.instructor?.name || 'Expert'}</span>
                                        </div>
                                        <div className="text-xl font-black text-blue-600">
                                            ${course.price}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Courses;
