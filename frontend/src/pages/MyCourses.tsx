import { useQuery } from '@tanstack/react-query';
import { BookOpen, CirclePlay, Clock, CircleCheck, TrendingUp, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { enrollmentService } from '../services/enrollmentService';
import { useState } from 'react';

const MyCourses = () => {
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: apiEnrollments, isLoading } = useQuery({
        queryKey: ['my-enrollments'],
        queryFn: () => enrollmentService.getMyEnrollments(),
    });

    const MOCK_ENROLLMENTS = [
        {
            id: 'mock-1',
            status: 'ACTIVE',
            progress: 65,
            courseId: 'mock-1',
            course: {
                title: 'Data Science with Python',
                description: 'Complete data science bootcamp with projects',
                duration: '32h',
                level: 'Intermediate'
            }
        },
        {
            id: 'mock-2',
            status: 'ACTIVE',
            progress: 25,
            courseId: 'mock-2',
            course: {
                title: 'UI/UX Design Fundamentals',
                description: 'Learn to design beautiful interfaces',
                duration: '24h',
                level: 'Beginner'
            }
        },
        {
            id: 'mock-3',
            status: 'COMPLETED',
            progress: 100,
            courseId: 'mock-3',
            course: {
                title: 'Introduction to Marketing',
                description: 'Digital marketing basics',
                duration: '12h',
                level: 'Beginner'
            }
        }
    ];

    const enrollments = (apiEnrollments && apiEnrollments.length > 0) ? apiEnrollments : MOCK_ENROLLMENTS;

    const activeCourses = enrollments?.filter((e: any) => e.status === 'ACTIVE') || [];
    const completedCourses = enrollments?.filter((e: any) => e.status === 'COMPLETED') || [];

    const displayCourses = activeTab === 'active' ? activeCourses : completedCourses;
    const filteredCourses = displayCourses.filter((e: any) =>
        e.course?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">My Courses</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage and track your learning journey</p>
                        </div>
                        <Link
                            to="/courses"
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                        >
                            <BookOpen className="h-5 w-5" />
                            Browse Courses
                        </Link>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8">
                    {/* Search and Tabs */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1">
                                <button
                                    onClick={() => setActiveTab('active')}
                                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'active'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Active ({activeCourses.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('completed')}
                                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'completed'
                                        ? 'bg-white text-green-600 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    Completed ({completedCourses.length})
                                </button>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="text-2xl font-black text-blue-600">{activeCourses.length}</div>
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">In Progress</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <div className="text-2xl font-black text-green-600">{completedCourses.length}</div>
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">Completed</div>
                            </div>
                            <div className="p-4 bg-orange-50 rounded-xl">
                                <div className="text-2xl font-black text-orange-600">
                                    {Math.round(enrollments?.reduce((acc: number, e: any) => acc + (e.progress || 0), 0) / (enrollments?.length || 1))}%
                                </div>
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">Avg Progress</div>
                            </div>
                            <div className="p-4 bg-indigo-50 rounded-xl">
                                <div className="text-2xl font-black text-indigo-600">{enrollments?.length || 0}</div>
                                <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">Total Courses</div>
                            </div>
                        </div>
                    </div>

                    {/* Course Grid */}
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                            <p className="text-slate-500 mt-4 font-medium">Loading courses...</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-slate-900 mb-2">
                                {searchTerm ? 'No courses found' : `No ${activeTab} courses`}
                            </h3>
                            <p className="text-slate-500 font-medium mb-6">
                                {searchTerm ? 'Try a different search term' : 'Start learning by enrolling in a course'}
                            </p>
                            <Link
                                to="/courses"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                <BookOpen className="h-5 w-5" />
                                Browse Courses
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((enrollment: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    {/* Course Image */}
                                    <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                        <div className="text-6xl font-black text-white opacity-20">
                                            {enrollment.course?.title?.charAt(0) || 'C'}
                                        </div>
                                    </div>

                                    {/* Course Info */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {enrollment.course?.title}
                                            </h3>
                                            {enrollment.status === 'COMPLETED' && (
                                                <CircleCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-500 font-medium mb-4 line-clamp-2">
                                            {enrollment.course?.description || 'No description available'}
                                        </p>

                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs font-bold text-slate-600">Progress</span>
                                                <span className="text-xs font-black text-blue-600">{enrollment.progress || 0}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                                                    style={{ width: `${enrollment.progress || 0}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span className="font-medium">{enrollment.course?.duration || 'N/A'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4" />
                                                <span className="font-medium">{enrollment.course?.level || 'All Levels'}</span>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            to={enrollment.status === 'COMPLETED' ? `/course/${enrollment.courseId}` : `/learn/${enrollment.courseId}`}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                        >
                                            {enrollment.status === 'COMPLETED' ? (
                                                <>
                                                    <CircleCheck className="h-5 w-5" />
                                                    View Certificate
                                                </>
                                            ) : (
                                                <>
                                                    <CirclePlay className="h-5 w-5" />
                                                    Continue Learning
                                                </>
                                            )}
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;

