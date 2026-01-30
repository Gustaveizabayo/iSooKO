import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, CircleCheck, CircleX, CircleAlert, Download } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { attendanceService } from '../services/attendanceService';
import { motion } from 'framer-motion';

const AttendancePage = () => {
    const { data: attendanceData, isLoading } = useQuery({
        queryKey: ['my-attendance'],
        queryFn: () => attendanceService.getMyAttendance(),
    });

    const totalAttendance = attendanceData?.length || 0;
    const presentCount = attendanceData?.filter((a: any) => a.status === 'PRESENT')?.length || 0;
    const absentCount = attendanceData?.filter((a: any) => a.status === 'ABSENT')?.length || 0;
    const lateCount = attendanceData?.filter((a: any) => a.status === 'LATE')?.length || 0;
    const excusedCount = attendanceData?.filter((a: any) => a.status === 'EXCUSED')?.length || 0;
    const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return <CircleCheck className="h-5 w-5 text-green-600" />;
            case 'ABSENT':
                return <CircleX className="h-5 w-5 text-red-600" />;
            case 'LATE':
                return <CircleAlert className="h-5 w-5 text-yellow-600" />;
            case 'EXCUSED':
                return <Clock className="h-5 w-5 text-blue-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PRESENT':
                return 'bg-green-50 text-green-700 border-green-200';
            case 'ABSENT':
                return 'bg-red-50 text-red-700 border-red-200';
            case 'LATE':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'EXCUSED':
                return 'bg-blue-50 text-blue-700 border-blue-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 ml-64">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900">Attendance</h1>
                            <p className="text-slate-500 font-medium mt-1">Track your attendance across all courses</p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
                            <Download className="h-4 w-4" />
                            Export Report
                        </button>
                    </div>
                </div>

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
                        >
                            <div className="text-sm font-bold opacity-90 mb-2">Attendance Rate</div>
                            <div className="text-4xl font-black">{attendancePercentage}%</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
                                    <CircleCheck className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{presentCount}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Present</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center">
                                    <CircleX className="h-5 w-5 text-red-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{absentCount}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Absent</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                                    <CircleAlert className="h-5 w-5 text-yellow-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{lateCount}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Late</div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">{excusedCount}</div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Excused</div>
                        </motion.div>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Attendance History
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                                <p className="text-slate-500 mt-4 font-medium">Loading attendance...</p>
                            </div>
                        ) : !attendanceData || attendanceData.length === 0 ? (
                            <div className="p-12 text-center">
                                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No attendance records found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Course</th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {attendanceData.map((record: any, i: number) => (
                                            <motion.tr
                                                key={i}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-slate-900">
                                                        {new Date(record.timestamp).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-slate-500 font-medium">
                                                        {new Date(record.timestamp).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-bold text-slate-900">{record.course?.title || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                                                        {record.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(record.status)}`}>
                                                        {getStatusIcon(record.status)}
                                                        {record.status}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;

