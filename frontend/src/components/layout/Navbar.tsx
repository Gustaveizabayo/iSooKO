import { Search, Bell, LogIn, Menu, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const user = authService.getCurrentUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    // Theme context retained for potential future use but toggle removed from UI
    const { } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
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
                            { name: 'Teach', path: '/instructor' },
                            { name: 'My Learning', path: '/dashboard' },
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`text-sm font-bold transition-colors ${scrolled ? 'text-slate-200 hover:text-white' : 'text-white/80 hover:text-white'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar - Hidden as image 2 has it in hero, but keeping a compact version if needed */}
                    <div className="hidden flex-1 px-8 lg:block max-w-sm ml-auto">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f2238] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                className="w-full rounded-xl border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm font-medium text-[#0f2238] transition-all placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-yellow-500/20"
                            />
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
                                <Link to="/profile" className="flex items-center gap-3 group">
                                    <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/20 transition-all group-hover:border-yellow-500">
                                        <img
                                            src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name}&background=0f2238&color=EAB308`}
                                            alt={user.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div >
                                </Link >
                            </div >
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-bold text-white/80 hover:text-white transition-all">
                                    Login
                                </Link>
                                <Link to="/register" className="rounded-xl bg-yellow-500 px-6 py-2.5 text-sm font-bold text-[#0f2238] shadow-lg shadow-black/20 hover:bg-yellow-400 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                                    Join for Free
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
                            <Link to="/courses" className="block text-base font-bold text-[#0f2238]">Courses</Link>
                            <Link to="/instructor" className="block text-base font-bold text-[#0f2238]">Teach</Link>
                            <Link to="/dashboard" className="block text-base font-bold text-[#0f2238]">My Learning</Link>
                            <div className="pt-4 space-y-2 border-t border-slate-100">
                                <Link
                                    to="/login"
                                    className="block w-full rounded-xl border-2 border-slate-100 py-3 text-center text-sm font-bold text-[#0f2238]"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full rounded-xl bg-[#0f2238] py-3 text-center text-sm font-bold text-white"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navbar;
