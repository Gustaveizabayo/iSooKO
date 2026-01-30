import { Bell, Check, X, Info, AlertTriangle, MessageSquare, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import { useState } from 'react';

const Notifications = () => {
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    // Mock notifications
    const notifications = [
        {
            id: 1,
            type: 'success',
            title: 'Course Completed!',
            message: 'Congratulations! You have completed "Advanced JavaScript"',
            time: '5 minutes ago',
            read: false,
            icon: Check
        },
        {
            id: 2,
            type: 'info',
            title: 'New Course Available',
            message: 'Check out our new course: "AI Fundamentals for Beginners"',
            time: '1 hour ago',
            read: false,
            icon: Info
        },
        {
            id: 3,
            type: 'warning',
            title: 'Assignment Due Soon',
            message: 'Your assignment for "React Fundamentals" is due in 2 days',
            time: '3 hours ago',
            read: true,
            icon: AlertTriangle
        },
        {
            id: 4,
            type: 'message',
            title: 'New Message from Instructor',
            message: 'Dr. Sarah Johnson replied to your question',
            time: '5 hours ago',
            read: true,
            icon: MessageSquare
        },
        {
            id: 5,
            type: 'info',
            title: 'Upcoming Live Session',
            message: 'Join the live Q&A session tomorrow at 2:00 PM',
            time: '1 day ago',
            read: true,
            icon: Calendar
        },
        {
            id: 6,
            type: 'success',
            title: 'Certificate Issued',
            message: 'Your certificate for "Web Development Bootcamp" is ready',
            time: '2 days ago',
            read: true,
            icon: Check
        },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;
    const displayNotifications = filter === 'unread'
        ? notifications.filter(n => !n.read)
        : notifications;

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-700';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'message':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            default:
                return 'bg-slate-50 border-slate-200 text-slate-700';
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'success':
                return 'text-green-600';
            case 'warning':
                return 'text-yellow-600';
            case 'error':
                return 'text-red-600';
            case 'message':
                return 'text-blue-600';
            default:
                return 'text-slate-600';
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 flex items-center gap-3">
                                <Bell className="h-8 w-8" />
                                Notifications
                            </h1>
                            <p className="text-slate-500 font-medium mt-1">
                                Stay updated with your learning activities
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl">
                                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
                                <span className="text-sm font-bold text-blue-700">
                                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8">
                    {/* Filter Tabs */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 w-fit">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'all'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                All Notifications ({notifications.length})
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${filter === 'unread'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Unread ({unreadCount})
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    {displayNotifications.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
                            <Bell className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-black text-slate-900 mb-2">No notifications</h3>
                            <p className="text-slate-500 font-medium">
                                {filter === 'unread' ? "You're all caught up!" : "You don't have any notifications yet"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayNotifications.map((notification, i) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`bg-white rounded-2xl border p-6 hover:shadow-md transition-all ${!notification.read ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeStyles(notification.type)}`}>
                                            <notification.icon className={`h-6 w-6 ${getIconColor(notification.type)}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="text-lg font-black text-slate-900">
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-2"></div>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium mb-3">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {notification.time}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    {!notification.read && (
                                                        <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                                                            Mark as Read
                                                        </button>
                                                    )}
                                                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Dismiss">
                                                        <X className="h-4 w-4 text-slate-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Mark All as Read */}
                    {unreadCount > 0 && (
                        <div className="mt-6 text-center">
                            <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                                Mark All as Read
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
