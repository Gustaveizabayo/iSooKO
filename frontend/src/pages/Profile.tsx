import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
    User as UserIcon,
    Mail,
    Camera,
    Save,
    Loader2,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    MapPin,
    Link as LinkIcon,
    Github,
    Linkedin,
    Twitter,
    Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { toast } from 'sonner';

const Profile = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial user from local storage (fallback)
    const localUser = authService.getCurrentUser();

    // Fetch real profile data
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: userService.getProfile,
    });

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        headline: '',
        location: '',
        website: '',
        twitter: '',
        linkedin: '',
        github: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Update form data when profile builds
    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                name: profile.name || '',
                email: profile.email || '',
                bio: profile.bio || '',
                headline: profile.headline || '',
                location: profile.location || '',
                website: profile.website || '',
                twitter: profile.twitter || '',
                linkedin: profile.linkedin || '',
                github: profile.github || '',
            }));
        }
    }, [profile]);

    const [avatarPreview, setAvatarPreview] = useState(profile?.avatarUrl || localUser?.avatarUrl || '');

    // Update avatar preview when profile loads
    useEffect(() => {
        if (profile?.avatarUrl) {
            setAvatarPreview(profile.avatarUrl);
        }
    }, [profile?.avatarUrl]);

    // Handle avatar upload
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Upload
            try {
                const toastId = toast.loading('Uploading avatar...');
                const result = await userService.uploadAvatar(file);

                // Update profile with new avatar URL immediately
                await userService.updateProfile({ avatarUrl: result.url });
                queryClient.invalidateQueries({ queryKey: ['profile'] });

                toast.dismiss(toastId);
                toast.success('Avatar updated successfully');
            } catch (error) {
                console.error(error);
                toast.error('Failed to upload avatar');
                // Revert preview on error
                setAvatarPreview(profile?.avatarUrl || '');
            }
        }
    };

    // Update Profile Mutation
    const updateProfileMutation = useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    });

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate password change if attempted
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                toast.error('Please enter your current password to change it');
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                toast.error('New passwords do not match');
                return;
            }
            if (formData.newPassword.length < 6) {
                toast.error('Password must be at least 6 characters');
                return;
            }
        }

        // Prepare update data
        const updateData: any = {
            name: formData.name,
            bio: formData.bio,
            headline: formData.headline,
            location: formData.location,
            website: formData.website,
            twitter: formData.twitter,
            linkedin: formData.linkedin,
            github: formData.github,
        };

        // Only include password if changing
        if (formData.newPassword) {
            updateData.currentPassword = formData.currentPassword;
            updateData.newPassword = formData.newPassword;
        }

        updateProfileMutation.mutate(updateData);
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                {/* Header with Back Button */}
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors font-bold"
                        >
                            <ArrowLeft className="h-5 w-5" />
                            Back
                        </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">Profile Settings</h1>
                            <p className="text-slate-500 font-medium mt-1">Manage your account information and preferences</p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Pencil Profile
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 lg:p-8">
                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                        {/* Avatar Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-8 border border-slate-100"
                        >
                            <h2 className="text-xl font-black text-slate-900 mb-6">Profile Picture</h2>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative group">
                                    <div className="h-32 w-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-4 ring-white shadow-lg">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <UserIcon className="h-16 w-16 text-white" />
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg hover:scale-110 active:scale-95"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>
                                <div className="flex-1 text-center sm:text-left space-y-2">
                                    <h3 className="text-2xl font-black text-slate-900">{profile?.name || 'User'}</h3>
                                    <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2">
                                        <Mail className="h-4 w-4" />
                                        {profile?.email || 'email@example.com'}
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider">
                                            {profile?.role || 'STUDENT'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Personal Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-8 border border-slate-100"
                        >
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <UserIcon className="h-5 w-5 text-blue-600" />
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            disabled={!isEditing}
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled={true} // Email usually cannot be changed easily
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium bg-slate-50 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        Headline / Title
                                    </label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.headline}
                                            onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="e.g. Senior Software Engineer"
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        disabled={!isEditing}
                                        rows={4}
                                        placeholder="Tell us about yourself..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 resize-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="City, Country"
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        Website
                                    </label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="url"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="https://yourwebsite.com"
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 border border-slate-100"
                        >
                            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                <LinkIcon className="h-5 w-5 text-blue-600" />
                                Social Profiles
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        Twitter
                                    </label>
                                    <div className="relative">
                                        <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.twitter}
                                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="@username"
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        LinkedIn
                                    </label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.linkedin}
                                            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="Profile URL"
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                        GitHub
                                    </label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.github}
                                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                            disabled={!isEditing}
                                            placeholder="Username"
                                            className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Change Password */}
                        {isEditing && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-8 border border-slate-100"
                            >
                                <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Lock className="h-5 w-5 text-blue-600" />
                                    Change Password
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.currentPassword}
                                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                                placeholder="Enter current password"
                                                className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                <input
                                                    type={showNewPassword ? 'text' : 'password'}
                                                    value={formData.newPassword}
                                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                                    placeholder="Enter new password"
                                                    className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                                >
                                                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                <input
                                                    type="password"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    placeholder="Confirm new password"
                                                    className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <div className="sticky bottom-4 z-10">
                            {isEditing && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/90 backdrop-blur-lg border border-slate-200 p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4"
                                >
                                    <p className="hidden sm:block text-slate-500 font-medium text-sm">
                                        You have unsaved changes
                                    </p>
                                    <div className="flex items-center gap-3 ml-auto">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                // Reset form
                                                if (profile) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        name: profile.name || '',
                                                        email: profile.email || '',
                                                        bio: profile.bio || '',
                                                        headline: profile.headline || '',
                                                        location: profile.location || '',
                                                        website: profile.website || '',
                                                        twitter: profile.twitter || '',
                                                        linkedin: profile.linkedin || '',
                                                        github: profile.github || '',
                                                        currentPassword: '',
                                                        newPassword: '',
                                                        confirmPassword: ''
                                                    }));
                                                }
                                            }}
                                            className="px-6 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updateProfileMutation.isPending}
                                            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                                        >
                                            {updateProfileMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

