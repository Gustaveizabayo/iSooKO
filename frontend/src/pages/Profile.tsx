import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    User,
    Mail,
    MapPin,
    Globe,
    Twitter,
    Linkedin,
    Github,
    Camera,
    Save,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { userService, type UserProfile } from '../services/userService';

const Profile = () => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    // Fetch real profile data
    const { data: profile, isLoading } = useQuery({
        queryKey: ['user-profile'],
        queryFn: () => userService.getProfile(),
    });

    const [formData, setFormData] = useState<Partial<UserProfile>>({});

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: (data: Partial<UserProfile>) => userService.updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-profile'] });
            setUpdateSuccess(true);
            setIsEditing(false);
            setTimeout(() => setUpdateSuccess(false), 3000);
        },
    });

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    const handleSave = () => {
        updateMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />

            <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                        <p className="text-slate-500 font-medium">Manage your professional identity and account preferences.</p>
                    </div>
                    {updateSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-2 text-sm font-bold text-green-600 border border-green-100"
                        >
                            <CheckCircle2 className="h-4 w-4" />
                            Profile Updated
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                            <div className="relative mx-auto mb-6 h-32 w-32 group">
                                <div className="h-full w-full overflow-hidden rounded-full border-4 border-slate-50 bg-slate-100">
                                    <img
                                        src={profile?.avatarUrl || `https://ui-avatars.com/api/?name=${profile?.name}&background=0D8ABC&color=fff&size=128`}
                                        alt={profile?.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95">
                                    <Camera className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-slate-900">{profile?.name}</h2>
                                <p className="text-sm font-medium text-slate-500">{profile?.headline || 'Learner at iSooKO Academy'}</p>
                                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-600">
                                    {profile?.role}
                                </div>
                            </div>

                            <div className="mt-8 space-y-1">
                                {[
                                    { icon: User, label: 'Public Profile', active: true },
                                    { icon: ShieldCheck, label: 'Security' },
                                    { icon: CreditCard, label: 'Billing' },
                                ].map((item, i) => (
                                    <button
                                        key={i}
                                        className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${item.active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                            <div className="mb-8 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => {
                                            setFormData(profile || {});
                                            setIsEditing(true);
                                        }}
                                        className="text-sm font-bold text-blue-600 hover:underline"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="text-sm font-bold text-slate-400 hover:text-slate-600"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={updateMutation.isPending}
                                            className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline disabled:opacity-50"
                                        >
                                            {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={isEditing ? formData.name : profile?.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none disabled:opacity-60"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            disabled={true}
                                            value={profile?.email}
                                            className="w-full rounded-2xl border border-slate-100 bg-slate-100 py-3 pl-12 pr-4 font-bold text-slate-500 focus:outline-none opacity-60"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Headline</label>
                                    <input
                                        type="text"
                                        disabled={!isEditing}
                                        placeholder="e.g. Senior Full Stack Developer"
                                        value={isEditing ? formData.headline : profile?.headline}
                                        onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 px-4 font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none disabled:opacity-60"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio</label>
                                    <textarea
                                        rows={4}
                                        disabled={!isEditing}
                                        value={isEditing ? formData.bio : profile?.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Tell us a bit about yourself..."
                                        className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none disabled:opacity-60 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                            <h3 className="mb-8 text-lg font-bold text-slate-900">Social Presence</h3>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {[
                                    { icon: MapPin, label: 'Location', key: 'location', placeholder: 'New York, USA' },
                                    { icon: Globe, label: 'Website', key: 'website', placeholder: 'https://johndoe.com' },
                                    { icon: Twitter, label: 'Twitter', key: 'twitter', placeholder: '@johndoe' },
                                    { icon: Linkedin, label: 'LinkedIn', key: 'linkedin', placeholder: 'linkedin.com/in/johndoe' },
                                    { icon: Github, label: 'GitHub', key: 'github', placeholder: 'github.com/johndoe' },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</label>
                                        <div className="relative">
                                            <item.icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                disabled={!isEditing}
                                                value={isEditing ? (formData[item.key as keyof UserProfile] as string) : (profile?.[item.key as keyof UserProfile] as string)}
                                                onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                                                placeholder={item.placeholder}
                                                className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-12 pr-4 font-bold text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none disabled:opacity-60"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
