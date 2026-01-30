import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Shield, Mail, Ban, CircleCheck } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { userService } from '../services/userService';
import { toast } from 'sonner';

const MOCK_STUDENTS = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'STUDENT', status: 'ACTIVE', joinedAt: '2023-01-15' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'STUDENT', status: 'ACTIVE', joinedAt: '2023-02-20' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'STUDENT', status: 'SUSPENDED', joinedAt: '2023-03-10' },
];

const AdminStudents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: apiStudents, isLoading } = useQuery({
        queryKey: ['admin-students'],
        queryFn: () => userService.getUsersByRole('STUDENT'),
    });

    const students = Array.isArray(apiStudents) && apiStudents.length > 0 ? apiStudents : MOCK_STUDENTS;

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => userService.updateUserStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-students'] });
            toast.success('Student status updated');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const handleStatusUpdate = (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        // status property might be missing in real API, so we default to 'ACTIVE'
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const filteredStudents = students.filter((s: any) =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Manage Students</h1>
                            <p className="text-slate-500 font-medium mt-1">View and manage student accounts</p>
                        </div>
                    </div>
                </div>

                <div className="p-4 lg:p-8">
                    {/* Controls */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 font-bold">
                                <Filter className="h-4 w-4" />
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">Loading students...</td>
                                        </tr>
                                    ) : filteredStudents.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No students found.</td>
                                        </tr>
                                    ) : (
                                        filteredStudents.map((student: any, i: number) => (
                                            <motion.tr
                                                key={student.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black">
                                                            {student.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{student.name}</div>
                                                            <div className="text-xs text-slate-500">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-black">
                                                        STUDENT
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black ${student.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                                        }`}>
                                                        {student.status === 'SUSPENDED' ? <Ban className="h-3 w-3" /> : <CircleCheck className="h-3 w-3" />}
                                                        {student.status || 'ACTIVE'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                                                            title="Email"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(student.id, student.status || 'ACTIVE')}
                                                            className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${student.status === 'SUSPENDED' ? 'text-green-600 hover:text-green-700' : 'text-slate-400 hover:text-red-600'
                                                                }`}
                                                            title={student.status === 'SUSPENDED' ? "Activate" : "Suspend"}
                                                        >
                                                            {student.status === 'SUSPENDED' ? <Shield className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;

