import { Search, Bell, Menu, Lightbulb, User, Book, GraduationCap, Shield, LogOut, ChevronDown, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../../hooks/useSearch';

const Navbar = () => {
    const user = authService.getCurrentUser();
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const { } = useTheme();
    const { results, isSearching, search, clearSearch } = useSearch();

    const handleLogout = () => {
        authService.logout();
        setIsUserMenuOpen(false);
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim()) {
                search(searchQuery);
                setShowSearchResults(true);
            } else {
                clearSearch();
                setShowSearchResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Click outside to close search results
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };

        if (showSearchResults) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSearchResults]);

    const handleSearchResultClick = (courseId: string) => {
        setShowSearchResults(false);
        setSearchQuery('');
        clearSearch();
        navigate(`/course/${courseId}`);
    };

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${!isHomePage || scrolled
                ? 'bg-[#0f2238] border-b border-white/10 shadow-lg py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    {/* Logo - Matching Image 1/2 */}
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-900/5 transition-transform group-hover:scale-110">
                            <Lightbulb className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className={`text-2xl font-black tracking-tight transition-colors ${scrolled ? 'text-white' : 'text-white'}`}>
                                <span className="text-yellow-500">I</span>SooKo
                            </span>
                            <span className={`text-[0.6rem] font-bold uppercase tracking-widest transition-colors ${scrolled ? 'text-slate-400' : 'text-slate-300'}`}>
                                Where Learning Meets Growth
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Updated to match Image 1 */}
                    <div className="hidden md:ml-10 md:flex md:items-center md:gap-8">
                        {[
                            { name: 'Courses', path: '/courses' },
                            {
                                name: 'Teach',
                                path: !user || user.role === 'STUDENT' ? '/instructor/apply' : '/instructor'
                            },
                            { name: 'My Learning', path: '/dashboard' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`relative text-sm font-bold transition-all duration-300 group ${scrolled ? 'text-slate-200 hover:text-white' : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Functional Search Bar */}
                    <div className="hidden flex-1 px-8 lg:block max-w-sm ml-auto" ref={searchRef}>
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-500 transition-colors z-10" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery && setShowSearchResults(true)}
                                placeholder="Search courses..."
                                autoComplete="off"
                                className="w-full rounded-xl border-slate-200 bg-slate-50 py-2 pl-10 pr-10 text-sm font-medium text-[#0f2238] transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        clearSearch();
                                        setShowSearchResults(false);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}

                            {/* Search Results Dropdown */}
                            <AnimatePresence>
                                {showSearchResults && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl border border-slate-200 max-h-96 overflow-y-auto z-50"
                                    >
                                        {isSearching ? (
                                            <div className="p-4 text-center text-slate-500 text-sm">
                                                Searching...
                                            </div>
                                        ) : results.length > 0 ? (
                                            <div className="py-2">
                                                {results.map((result) => (
                                                    <button
                                                        key={result.id}
                                                        onClick={() => handleSearchResultClick(result.id)}
                                                        className="w-full px-4 py-3 hover:bg-slate-50 transition-colors text-left flex items-center gap-3 group"
                                                    >
                                                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                                                            <Book className="h-6 w-6 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate group-hover:text-yellow-600 transition-colors">
                                                                {result.title}
                                                            </p>
                                                            {result.instructor && (
                                                                <p className="text-xs text-slate-500 truncate">
                                                                    {result.instructor}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : searchQuery.trim() ? (
                                            <div className="p-8 text-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                                    <Search className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-900 mb-1">No results found</p>
                                                <p className="text-xs text-slate-500">Try searching with different keywords</p>
                                            </div>
                                        ) : null}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden items-center gap-4 md:flex ml-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <button className="relative rounded-full p-2 text-slate-300 hover:bg-white/10 transition-colors">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-[#0f2238]"></span>
                                </button>

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-2 group p-1 rounded-2xl hover:bg-white/5 transition-all"
                                    >
                                        <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/20 transition-all group-hover:border-yellow-500 ring-2 ring-offset-2 ring-offset-[#0f2238] ring-transparent group-hover:ring-yellow-500/50">
                                            <img
                                                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=0f2238&color=EAB308`}
                                                alt={user.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isUserMenuOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl"
                                            >
                                                <div className="bg-slate-50/50 p-6 border-b border-slate-100">
                                                    <p className="text-sm font-black text-[#0f2238]">{user.name}</p>
                                                    <p className="text-[11px] font-bold text-slate-400 truncate">{user.email}</p>
                                                </div>

                                                <div className="p-2">
                                                    <Link
                                                        to="/dashboard"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center gap-3 rounded-2xl p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors group"
                                                    >
                                                        <div className="rounded-xl bg-blue-50 p-2 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                                            <User className="h-4 w-4" />
                                                        </div>
                                                        Dashboard
                                                    </Link>

                                                    <Link
                                                        to="/dashboard"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center gap-3 rounded-2xl p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors group"
                                                    >
                                                        <div className="rounded-xl bg-orange-50 p-2 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                                                            <Book className="h-4 w-4" />
                                                        </div>
                                                        My Learning
                                                    </Link>

                                                    {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                                                        <Link
                                                            to="/instructor"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                            className="flex items-center gap-3 rounded-2xl p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors group"
                                                        >
                                                            <div className="rounded-xl bg-amber-50 p-2 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                                                                <GraduationCap className="h-4 w-4" />
                                                            </div>
                                                            Instructor Studio
                                                        </Link>
                                                    )}

                                                    {user.role === 'ADMIN' && (
                                                        <Link
                                                            to="/admin"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                            className="flex items-center gap-3 rounded-2xl p-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors group"
                                                        >
                                                            <div className="rounded-xl bg-purple-50 p-2 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                                                                <Shield className="h-4 w-4" />
                                                            </div>
                                                            Admin Panel
                                                        </Link>
                                                    )}

                                                    <div className="mt-2 border-t border-slate-100 pt-2">
                                                        <button
                                                            onClick={handleLogout}
                                                            className="flex w-full items-center gap-3 rounded-2xl p-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors group"
                                                        >
                                                            <div className="rounded-xl bg-red-50 p-2 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white">
                                                                <LogOut className="h-4 w-4" />
                                                            </div>
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/contact"
                                    className="relative px-4 py-2 text-sm font-bold text-white/80 hover:text-white transition-all duration-300 group"
                                >
                                    Contact Us
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="relative rounded-xl bg-yellow-500 px-6 py-2.5 text-sm font-bold text-[#0f2238] shadow-lg shadow-black/20 hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-yellow-500/30 active:scale-95 overflow-hidden group"
                                >
                                    <span className="relative z-10">Join for Free</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                </Link>
                            </>
                        )}
                    </div >

                    {/* Mobile menu button */}
                    < div className="flex md:hidden" >
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-50"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div >
                </div >
            </div >

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className="border-t border-slate-100 bg-white p-4 md:hidden">
                        <div className="space-y-4">
                            <Link
                                to="/courses"
                                className="block text-base font-black text-[#0f2238] hover:text-yellow-600 transition-colors duration-300 hover:translate-x-1 transform"
                            >
                                Explore Courses
                            </Link>
                            <Link
                                to="/contact"
                                className="block text-base font-black text-[#0f2238] hover:text-yellow-600 transition-colors duration-300 hover:translate-x-1 transform"
                            >
                                Contact Us
                            </Link>

                            {user && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className="block text-base font-black text-[#0f2238] hover:text-yellow-600 transition-colors duration-300 hover:translate-x-1 transform"
                                    >
                                        My Learning
                                    </Link>
                                    {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN') && (
                                        <Link
                                            to="/instructor"
                                            className="block text-base font-black text-[#0f2238] hover:text-yellow-600 transition-colors duration-300 hover:translate-x-1 transform"
                                        >
                                            Instructor Studio
                                        </Link>
                                    )}
                                    {user.role === 'ADMIN' && (
                                        <Link
                                            to="/admin"
                                            className="block text-base font-black text-[#0f2238] hover:text-yellow-600 transition-colors duration-300 hover:translate-x-1 transform"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left text-base font-black text-red-600 hover:text-red-700 transition-colors duration-300 hover:translate-x-1 transform"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            )}

                            {!user && (
                                <div className="pt-4 space-y-2 border-t border-slate-100">
                                    <Link
                                        to="/login"
                                        className="block w-full rounded-xl border-2 border-slate-100 py-3 text-center text-sm font-black text-[#0f2238] hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block w-full rounded-xl bg-[#0f2238] py-3 text-center text-sm font-black text-white hover:bg-yellow-500 hover:text-[#0f2238] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
