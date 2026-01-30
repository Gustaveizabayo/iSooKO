import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    User,
    Calendar,
    Settings,
    LogOut,
    GraduationCap,
    Bell,
    CircleHelp,
    Users,
    BarChart3,
    Shield,
    Menu,
    X
} from 'lucide-react';
import { authService } from '../../services/authService';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const user = authService.getCurrentUser();
    const [isOpen, setIsOpen] = useState(true);

    // Role-based navigation
    const getNavigation = () => {
        switch (user?.role) {
            case 'STUDENT':
                return [
                    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
                    { name: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
                    { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
                    { name: 'Profile Settings', href: '/profile', icon: User },
                    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
                    { name: 'Help & Support', href: '/dashboard/help', icon: CircleHelp },
                ];
            case 'INSTRUCTOR':
                return [
                    { name: 'Dashboard', href: '/instructor', icon: LayoutDashboard },
                    { name: 'My Courses', href: '/instructor/courses', icon: BookOpen },
                    { name: 'Attendance Reports', href: '/instructor/attendance', icon: Calendar },
                    { name: 'Gradebook', href: '/instructor/gradebook', icon: BarChart3 },
                    { name: 'Profile Settings', href: '/profile', icon: User },
                    { name: 'Notifications', href: '/instructor/notifications', icon: Bell },
                    { name: 'Help & Support', href: '/instructor/help', icon: CircleHelp },
                ];
            case 'ADMIN':
                return [
                    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
                    { name: 'Manage Students', href: '/admin/students', icon: Users },
                    { name: 'Manage Instructors', href: '/admin/instructors', icon: GraduationCap },
                    { name: 'Manage Courses', href: '/admin/courses', icon: BookOpen },
                    { name: 'Attendance Reports', href: '/admin/attendance', icon: Calendar },
                    { name: 'System Settings', href: '/admin/settings', icon: Settings },
                    { name: 'Security & Accounts', href: '/admin/security', icon: Shield },
                    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
                    { name: 'Help & Support', href: '/admin/help', icon: CircleHelp },
                ];
            default:
                return [];
        }
    };

    const navigation = getNavigation();

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0f2238] text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Sidebar */}
            <div className={`
                fixed left-0 top-0 h-screen bg-[#0f2238] text-white transition-all duration-300 z-40
                ${isOpen ? 'w-64' : 'w-0 lg:w-20'}
                overflow-hidden
            `}>
                {/* Logo */}
                <div className="flex h-20 items-center px-6 border-b border-white/10">
                    <GraduationCap className="h-8 w-8 text-yellow-400 flex-shrink-0" />
                    {isOpen && <span className="ml-3 text-xl font-black">iSooKO LMS</span>}
                </div>

                {/* User Info */}
                <div className={`px-6 py-6 border-b border-white/10 ${!isOpen && 'lg:px-2'}`}>
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {isOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                                <p className="text-xs text-slate-400 truncate capitalize">{user?.role?.toLowerCase()}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${isActive
                                    ? 'bg-white/10 text-white shadow-lg'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    } ${!isOpen && 'lg:justify-center lg:px-2'}`}
                                title={!isOpen ? item.name : ''}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {isOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-4 py-6 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 hover:bg-red-500/10 hover:text-red-400 transition-all ${!isOpen && 'lg:justify-center lg:px-2'}`}
                        title={!isOpen ? 'Logout' : ''}
                    >
                        <LogOut className="h-5 w-5 flex-shrink-0" />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;

