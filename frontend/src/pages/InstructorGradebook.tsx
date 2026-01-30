import { useState } from 'react';
import { Search, Filter, Download, Save, CircleAlert, CircleCheck } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { motion } from 'framer-motion';

const InstructorGradebook = () => {
    const [selectedCourse, setSelectedCourse] = useState('1');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock courses for dropdown - In real app, fetch from courseService
    const courses = [
        { id: '1', title: 'Advanced JavaScript' },
        { id: '2', title: 'React Fundamentals' },
        { id: '3', title: 'Node.js Backend' }
    ];

    // Mock students and grades - In real app, fetch from gradeService
    const [students, setStudents] = useState([
        { id: 1, name: 'John Doe', email: 'john@example.com', attendance: 92, quiz1: 85, quiz2: 90, midterm: 88, final: 92, total: 89, status: 'PASS' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', attendance: 88, quiz1: 92, quiz2: 95, midterm: 94, final: 96, total: 94, status: 'PASS' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', attendance: 75, quiz1: 65, quiz2: 70, midterm: 68, final: 72, total: 69, status: 'WARN' },
        { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', attendance: 95, quiz1: 98, quiz2: 100, midterm: 96, final: 98, total: 98, status: 'PASS' },
        { id: 5, name: 'Tom Brown', email: 'tom@example.com', attendance: 60, quiz1: 50, quiz2: 55, midterm: 45, final: 50, total: 50, status: 'FAIL' },
    ]);

    const handleGradeChange = (id: number, field: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setStudents(students.map(s => {
            if (s.id === id) {
                // Determine status based on new Total (simplified logic)
                const newStudent = { ...s, [field]: numValue };
                // Recalculate total (mock calculation)
                const total = Math.round((newStudent.quiz1 * 0.1) + (newStudent.quiz2 * 0.1) + (newStudent.midterm * 0.3) + (newStudent.final * 0.5));
                newStudent.total = total;
                newStudent.status = total >= 60 ? 'PASS' : 'FAIL';
                return newStudent;
            }
            return s;
        }));
    };

    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Attendance', 'Quiz 1', 'Quiz 2', 'Midterm', 'Final', 'Total', 'Status'];
        const csvContent = [
            headers.join(','),
            ...students.map(s =>
                [s.name, s.email, s.attendance, s.quiz1, s.quiz2, s.midterm, s.final, s.total, s.status].join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'gradebook_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header */}
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Gradebook</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage student grades and performance</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Export CSV
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                                <Save className="h-4 w-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8">
                    {/* Controls */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                        <div className="w-full md:w-64">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Course</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="w-full p-2 border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 w-full relative">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Search Students</label>
                            <Search className="absolute left-3 top-8 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="w-full md:w-auto self-end">
                            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                                <Filter className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Grade Table */}
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-slate-500">Student</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Attendance</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Quiz 1 (10%)</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Quiz 2 (10%)</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Midterm (30%)</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Final (50%)</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Total</th>
                                        <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStudents.map((student, i) => (
                                        <motion.tr
                                            key={student.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-blue-50/50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900">{student.name}</div>
                                                        <div className="text-xs text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`font-bold ${student.attendance >= 90 ? 'text-green-600' : student.attendance >= 80 ? 'text-blue-600' : 'text-amber-500'}`}>
                                                    {student.attendance}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={student.quiz1}
                                                    onChange={(e) => handleGradeChange(student.id, 'quiz1', e.target.value)}
                                                    className="w-16 mx-auto text-center p-1 border border-slate-200 rounded font-medium focus:border-blue-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={student.quiz2}
                                                    onChange={(e) => handleGradeChange(student.id, 'quiz2', e.target.value)}
                                                    className="w-16 mx-auto text-center p-1 border border-slate-200 rounded font-medium focus:border-blue-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={student.midterm}
                                                    onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                                                    className="w-16 mx-auto text-center p-1 border border-slate-200 rounded font-medium focus:border-blue-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="number"
                                                    value={student.final}
                                                    onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                                                    className="w-16 mx-auto text-center p-1 border border-slate-200 rounded font-medium focus:border-blue-500 focus:outline-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="font-black text-slate-900 text-lg">{student.total}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {student.status === 'PASS' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-black">
                                                        <CircleCheck className="h-3 w-3" /> PASS
                                                    </span>
                                                ) : student.status === 'FAIL' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black">
                                                        <CircleAlert className="h-3 w-3" /> FAIL
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-black">
                                                        <CircleAlert className="h-3 w-3" /> WARN
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorGradebook;

