import { useState } from 'react';
import { Save, Bell, Shield, Globe } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import { toast } from 'sonner';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        systemName: 'iSooKO LMS',
        supportEmail: 'support@isookoo.com',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        twoFactorAuth: false
    });

    const handleChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // In real app, call settingsService.update(settings)
        toast.success('System settings saved successfully');
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />

            <div className="flex-1 lg:ml-64 transition-all duration-300">
                <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-black text-slate-900">System Settings</h1>
                            <p className="text-slate-500 font-medium mt-1">Configure platform parameters</p>
                        </div>
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                        >
                            <Save className="h-4 w-4" />
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="p-4 lg:p-8 max-w-4xl">
                    <div className="space-y-6">
                        {/* General Settings */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Globe className="h-5 w-5 text-blue-600" />
                                General Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">System Name</label>
                                    <input
                                        type="text"
                                        value={settings.systemName}
                                        onChange={(e) => handleChange('systemName', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg font-medium focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Support Email</label>
                                    <input
                                        type="email"
                                        value={settings.supportEmail}
                                        onChange={(e) => handleChange('supportEmail', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg font-medium focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security & Access */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Shield className="h-5 w-5 text-green-600" />
                                Security & Access
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <div className="font-bold text-slate-900">Maintenance Mode</div>
                                        <div className="text-xs text-slate-500">Temporarily disable access for all users</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.maintenanceMode}
                                            onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <div className="font-bold text-slate-900">Allow Registration</div>
                                        <div className="text-xs text-slate-500">Enable new user signups</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.allowRegistration}
                                            onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <div className="font-bold text-slate-900">Two-Factor Authentication</div>
                                        <div className="text-xs text-slate-500">Force 2FA for all admin accounts</div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.twoFactorAuth}
                                            onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-2xl border border-slate-100 p-6">
                            <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Bell className="h-5 w-5 text-orange-600" />
                                Notifications
                            </h2>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <div className="font-bold text-slate-900">Email Notifications</div>
                                    <div className="text-xs text-slate-500">Send system alerts via email</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={settings.emailNotifications}
                                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
