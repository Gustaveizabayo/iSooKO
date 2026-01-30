import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Mail, Ban, CircleCheck, Clock } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';
import { userService } from '../services/userService';
import { toast } from 'sonner';

const MOCK_INSTRUCTORS = [
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@example.com', role: 'INSTRUCTOR', status: 'ACTIVE' },
    { id: '2', name: 'Prof. Mike Chen', email: 'mike@example.com', role: 'INSTRUCTOR', status: 'ACTIVE' },
    { id: '3', name: 'James Wilson', email: 'james@example.com', role: 'INSTRUCTOR', status: 'PENDING' },
];

const AdminInstructors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const queryClient = useQueryClient();

    const { data: apiInstructors, isLoading } = useQuery({
        queryKey: ['admin-instructors'],
        queryFn: () => userService.getUsersByRole('INSTRUCTOR'),
    });

    const instructors = Array.isArray(apiInstructors) && apiInstructors.length > 0 ? apiInstructors : MOCK_INSTRUCTORS;

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) => userService.updateUserStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-instructors'] });
            toast.success('Instructor status updated');
        },
        onError: () => {
            toast.error('Failed to update status');
        }
    });

    const handleStatusUpdate = (id: string, newStatus: string) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const filteredInstructors = instructors.filter((s: any) =>
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
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Manage Instructors</h1>
                            <p className="text-slate-500 font-medium mt-1">Approve and manage course instructors</p>
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
                                placeholder="Search instructors..."
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
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Instructor</th>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-slate-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-slate-500">Loading instructors...</td>
                                        </tr>
                                    ) : filteredInstructors.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-slate-500">No instructors found.</td>
                                        </tr>
                                    ) : (
                                        filteredInstructors.map((instructor: any, i: number) => (
                                            <motion.tr
                                                key={instructor.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="hover:bg-slate-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black">
                                                            {instructor.name?.charAt(0) || 'I'}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{instructor.name}</div>
                                                            <div className="text-xs text-slate-500">{instructor.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black ${instructor.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        instructor.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' :
                                                            'bg-green-100 text-green-700'
                                                        }`}>
                                                        {instructor.status === 'PENDING' ? <Clock className="h-3 w-3" /> :
                                                            instructor.status === 'SUSPENDED' ? <Ban className="h-3 w-3" /> :
                                                                <CircleCheck className="h-3 w-3" />}
                                                        {instructor.status || 'ACTIVE'}
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

                                                        {instructor.status === 'PENDING' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(instructor.id, 'ACTIVE')}
                                                                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusUpdate(instructor.id, 'REJECTED')}
                                                                    className="px-3 py-1 bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}

                                                        {instructor.status !== 'PENDING' && (
                                                            <button
                                                                onClick={() => handleStatusUpdate(instructor.id, instructor.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')}
                                                                className={`p-2 hover:bg-slate-100 rounded-lg transition-colors ${instructor.status === 'SUSPENDED' ? 'text-green-600' : 'text-slate-400 hover:text-red-600'
                                                                    }`}
                                                                title={instructor.status === 'SUSPENDED' ? "Activate" : "Suspend"}
                                                            >
                                                                {instructor.status === 'SUSPENDED' ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                                                            </button>
                                                        )}
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

export default AdminInstructors;

