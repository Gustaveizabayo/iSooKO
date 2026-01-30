import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus,
    Trash2,
    Video,
    FileText,
    CircleHelp,
    GripVertical,
    ChevronDown,
    ChevronUp,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { courseService } from '../services/courseService';
import { Toaster, toast } from 'sonner';

const InstructorCourseEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

    // Fetch Course Data
    const { data: course, isLoading } = useQuery({
        queryKey: ['course-editor', id],
        queryFn: () => courseService.getById(id as string),
        enabled: !!id
    });

    // Mutations
    const updateCourseMutation = useMutation({
        mutationFn: (data: any) => courseService.update(id as string, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            toast.success('Course details updated');
        }
    });

    const addModuleMutation = useMutation({
        mutationFn: (title: string) => courseService.addModule(id as string, { title, order: 0 }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            toast.success('Module added');
            setNewModuleTitle('');
        }
    });

    const addLessonMutation = useMutation({
        mutationFn: ({ moduleId, data }: { moduleId: string, data: any }) =>
            courseService.addLesson(id as string, moduleId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['course-editor', id] });
            toast.success('Lesson added');
            setNewLesson({ title: '', type: 'VIDEO', content: '', duration: '5' });
            setAddingLessonTo(null);
        }
    });

    // Local State for forms
    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
    const [newLesson, setNewLesson] = useState({ title: '', type: 'VIDEO', content: '', duration: '5' });
    const [lessonFile, setLessonFile] = useState<File | null>(null);
    const [videoSourceType, setVideoSourceType] = useState<'URL' | 'UPLOAD'>('URL');

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
    if (!course) return <div>Course not found</div>;

    const handleUpdateDetails = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const updates = Object.fromEntries(formData);
        updateCourseMutation.mutate(updates);
    };

    const handleAddLesson = async (moduleId: string) => {
        let contentUrl = newLesson.content;

        if (newLesson.type === 'VIDEO' && videoSourceType === 'UPLOAD') {
            if (!lessonFile) {
                toast.error('Please select a video file');
                return;
            }

            try {
                const toastId = toast.loading('Uploading video...');
                const uploadResult = await courseService.uploadFile(lessonFile, id);
                toast.dismiss(toastId);
                toast.success('Video uploaded successfully');
                contentUrl = uploadResult.url;
            } catch (error) {
                console.error(error);
                toast.error('Upload failed. max 50MB for video.');
                return;
            }
        }

        addLessonMutation.mutate({
            moduleId,
            data: {
                ...newLesson,
                content: contentUrl,
                order: (course?.modules?.find((m: any) => m.id === moduleId)?.lessons?.length || 0) + 1
            }
        });
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <Toaster richColors />

            <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 pt-32">
                <button
                    onClick={() => navigate('/instructor')}
                    className="mb-6 flex items-center text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Studio
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Curriculum Editor</h1>
                        <p className="text-slate-500 font-medium">Build your course structure: {course.title}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold shadow-sm hover:bg-slate-50">Preview</button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700">Publish</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Course Details */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Course Basics</h2>
                            <form onSubmit={handleUpdateDetails} className="space-y-4">
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Title</label>
                                    <input
                                        name="title"
                                        defaultValue={course.title}
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Price ($)</label>
                                    <input
                                        name="price"
                                        type="number"
                                        defaultValue={course.price}
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Category</label>
                                    <select
                                        name="category"
                                        defaultValue={course.category}
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                                    >
                                        <option>Computer Science</option>
                                        <option>Business</option>
                                        <option>Art</option>
                                        <option>Marketing</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 tracking-widest block mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        defaultValue={course.description}
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:border-blue-500 resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={updateCourseMutation.isPending}
                                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex justify-center"
                                >
                                    {updateCourseMutation.isPending ? <Loader2 className="animate-spin" /> : 'Save Details'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column: Modules & Lessons */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm min-h-[500px]">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Curriculum Content</h2>

                            <div className="space-y-6">
                                {course.modules?.map((module: any, idx: number) => (
                                    <div key={module.id} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50/30">
                                        <div
                                            className="p-4 bg-white flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                            onClick={() => setActiveModuleId(activeModuleId === module.id ? null : module.id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="h-5 w-5 text-slate-300" />
                                                <div>
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Module {idx + 1}</span>
                                                    <h3 className="font-bold text-slate-900">{module.title}</h3>
                                                </div>
                                            </div>
                                            {activeModuleId === module.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                                        </div>

                                        {activeModuleId === module.id && (
                                            <div className="p-4 border-t border-slate-100 space-y-3">
                                                {/* Lessons List */}
                                                {module.lessons?.map((lesson: any) => (
                                                    <div key={lesson.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group hover:shadow-md transition-all">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${lesson.type === 'VIDEO' ? 'bg-blue-50 text-blue-500' :
                                                                lesson.type === 'QUIZ' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-500'
                                                                }`}>
                                                                {lesson.type === 'VIDEO' ? <Video className="h-4 w-4" /> :
                                                                    lesson.type === 'QUIZ' ? <CircleHelp className="h-4 w-4" /> :
                                                                        <FileText className="h-4 w-4" />}
                                                            </div>
                                                            <span className="font-bold text-slate-700 text-sm">{lesson.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs font-bold text-slate-400">{lesson.duration || 0}m</span>
                                                            <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                                        </div>
                                                    </div>
                                                ))}

                                                {/* Add Lesson Form */}
                                                {addingLessonTo === module.id ? (
                                                    <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                                                        <input
                                                            placeholder="Lesson Title"
                                                            value={newLesson.title}
                                                            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                                            className="w-full p-2 rounded-lg border border-slate-200 text-sm font-bold"
                                                        />
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={newLesson.type}
                                                                onChange={(e) => setNewLesson({ ...newLesson, type: e.target.value })}
                                                                className="flex-1 p-2 rounded-lg border border-slate-200 text-sm font-bold bg-white"
                                                            >
                                                                <option value="VIDEO">Video</option>
                                                                <option value="ARTICLE">Article</option>
                                                                <option value="QUIZ">Quiz</option>
                                                            </select>
                                                            <input
                                                                placeholder="Duration (m)"
                                                                type="number"
                                                                value={newLesson.duration}
                                                                onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                                                                className="w-20 p-2 rounded-lg border border-slate-200 text-sm font-bold"
                                                            />
                                                        </div>

                                                        {newLesson.type === 'VIDEO' && (
                                                            <div className="flex gap-4 text-sm font-bold text-slate-600">
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        checked={videoSourceType === 'URL'}
                                                                        onChange={() => setVideoSourceType('URL')}
                                                                    /> URL
                                                                </label>
                                                                <label className="flex items-center gap-2 cursor-pointer">
                                                                    <input
                                                                        type="radio"
                                                                        checked={videoSourceType === 'UPLOAD'}
                                                                        onChange={() => setVideoSourceType('UPLOAD')}
                                                                    /> Upload
                                                                </label>
                                                            </div>
                                                        )}

                                                        {newLesson.type === 'VIDEO' && videoSourceType === 'UPLOAD' ? (
                                                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center bg-white hover:bg-slate-50 transition-colors">
                                                                <input
                                                                    type="file"
                                                                    accept="video/mp4,video/quicktime"
                                                                    onChange={(e) => setLessonFile(e.target.files ? e.target.files[0] : null)}
                                                                    className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                                />
                                                                <p className="text-xs text-slate-400 mt-2">MP4, MOV up to 2GB</p>
                                                            </div>
                                                        ) : (
                                                            <textarea
                                                                placeholder={newLesson.type === 'QUIZ' ? "Enter quiz JSON..." : "Content URL or Text"}
                                                                value={newLesson.content}
                                                                onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                                                                className="w-full p-2 rounded-lg border border-slate-200 text-sm font-bold resize-none"
                                                                rows={2}
                                                            />
                                                        )}

                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setAddingLessonTo(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                                            <button
                                                                onClick={() => handleAddLesson(module.id)}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-blue-700"
                                                            >
                                                                Add Lesson
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setAddingLessonTo(module.id)}
                                                        className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50/50 transition-all font-bold text-sm"
                                                    >
                                                        <Plus className="h-4 w-4" /> Add Lesson
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add Module Section */}
                                <div className="mt-8 pt-8 border-t border-slate-100">
                                    <div className="flex gap-3">
                                        <input
                                            placeholder="New Module Title..."
                                            value={newModuleTitle}
                                            onChange={(e) => setNewModuleTitle(e.target.value)}
                                            className="flex-1 p-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                                        />
                                        <button
                                            onClick={() => { if (newModuleTitle) addModuleMutation.mutate(newModuleTitle); }}
                                            className="px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                                        >
                                            <Plus className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InstructorCourseEditor;

