'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Define all the API keys we need with proper labels
const API_KEY_CONFIG = {
    gemini: {
        name: 'Google Gemini AI',
        description: 'AI model for skill gap analysis',
        icon: '🤖',
        keys: [
            { key_name: 'GEMINI_API_KEY', label: 'Gemini API Key', placeholder: 'AIzaSy...', helpUrl: 'https://aistudio.google.com/app/apikey' }
        ]
    },
    serp: {
        name: 'SERP API',
        description: 'Google Jobs data fetching',
        icon: '🔍',
        keys: [
            { key_name: 'SERP_API_KEY', label: 'SERP API Key', placeholder: 'Enter your SERP API key', helpUrl: 'https://serpapi.com/' }
        ]
    },
    groq: {
        name: 'Groq Cloud',
        description: 'GitHub skill extraction using LLama',
        icon: '⚡',
        keys: [
            { key_name: 'GROQ_API_KEY', label: 'Groq API Key', placeholder: 'gsk_...', helpUrl: 'https://console.groq.com/keys' }
        ]
    },
    github: {
        name: 'GitHub OAuth',
        description: 'GitHub authentication for repository access',
        icon: '🐙',
        keys: [
            { key_name: 'GITHUB_CLIENT_ID', label: 'Client ID', placeholder: 'Ov23li...', helpUrl: 'https://github.com/settings/developers' },
            { key_name: 'GITHUB_CLIENT_SECRET', label: 'Client Secret', placeholder: 'dc27cad7...', helpUrl: null }
        ]
    },
    apify: {
        name: 'Apify',
        description: 'Reddit discussion scraping',
        icon: '🕷️',
        keys: [
            { key_name: 'APIFY_API_TOKEN', label: 'Apify API Token', placeholder: 'apify_api_...', helpUrl: 'https://apify.com/' }
        ]
    },
    aws: {
        name: 'AWS S3',
        description: 'Storage for PDF reports',
        icon: '☁️',
        keys: [
            { key_name: 'AWS_ACCESS_KEY_ID', label: 'Access Key ID', placeholder: 'AKIA...', helpUrl: 'https://console.aws.amazon.com/iam/' },
            { key_name: 'AWS_SECRET_ACCESS_KEY', label: 'Secret Access Key', placeholder: 'wJalrXUt...', helpUrl: null }
        ]
    },
    email: {
        name: 'Email / SMTP',
        description: 'Notification emails',
        icon: '📧',
        keys: [
            { key_name: 'SMTP_HOST', label: 'SMTP Host', placeholder: 'smtp.gmail.com', helpUrl: null },
            { key_name: 'SMTP_PORT', label: 'SMTP Port', placeholder: '587', helpUrl: null },
            { key_name: 'SMTP_USER', label: 'SMTP Username', placeholder: 'your@email.com', helpUrl: null },
            { key_name: 'SMTP_PASSWORD', label: 'SMTP Password', placeholder: 'App password', helpUrl: null },
            { key_name: 'FROM_EMAIL', label: 'From Email', placeholder: 'noreply@yourapp.com', helpUrl: null }
        ]
    }
};

interface DbKey {
    id: string;
    service_name: string;
    key_name: string;
    key_value: string;
    description: string | null;
    is_active: boolean;
}

export default function DashboardPage() {
    const [dbKeys, setDbKeys] = useState<DbKey[]>([]);
    const [editValues, setEditValues] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showPassword, setShowPassword] = useState<Set<string>>(new Set());

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        checkAuth();
        fetchKeys();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/');
            return;
        }
    };

    const fetchKeys = async () => {
        try {
            const response = await fetch('/api/keys');
            const data = await response.json();
            if (data.keys) {
                setDbKeys(data.keys);
                // Initialize edit values with current values
                const values: Record<string, string> = {};
                data.keys.forEach((key: DbKey) => {
                    values[`${key.service_name}_${key.key_name}`] = key.key_value || '';
                });
                setEditValues(values);
            }
        } catch (error) {
            console.error('Failed to fetch keys:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const handleValueChange = (serviceName: string, keyName: string, value: string) => {
        setEditValues(prev => ({
            ...prev,
            [`${serviceName}_${keyName}`]: value
        }));
    };

    const getKeyFromDb = (serviceName: string, keyName: string): DbKey | undefined => {
        return dbKeys.find(k => k.service_name === serviceName && k.key_name === keyName);
    };

    const saveKey = async (serviceName: string, keyName: string) => {
        const dbKey = getKeyFromDb(serviceName, keyName);
        if (!dbKey) return;

        const newValue = editValues[`${serviceName}_${keyName}`] || '';

        setSavingKey(`${serviceName}_${keyName}`);
        try {
            const response = await fetch('/api/keys', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbKey.id, key_value: newValue }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `${keyName} saved successfully!` });
                fetchKeys();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save key' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save key' });
        } finally {
            setSavingKey(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const toggleShowPassword = (key: string) => {
        setShowPassword(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const isSecretField = (keyName: string): boolean => {
        return keyName.includes('SECRET') || keyName.includes('PASSWORD') || keyName.includes('API_KEY') || keyName.includes('TOKEN');
    };

    const hasValueChanged = (serviceName: string, keyName: string): boolean => {
        const dbKey = getKeyFromDb(serviceName, keyName);
        const currentValue = editValues[`${serviceName}_${keyName}`] || '';
        return dbKey ? dbKey.key_value !== currentValue : false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">API Key Management</h1>
                                <p className="text-xs text-gray-400">RNS Job Analyzer Admin</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alert Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg fixed top-20 right-4 z-50 shadow-lg ${message.type === 'success'
                            ? 'bg-green-500/90 border border-green-400 text-white'
                            : 'bg-red-500/90 border border-red-400 text-white'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Info Banner */}
                <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-200">
                            <p className="font-medium">Enter your API keys below to enable all services.</p>
                            <p className="mt-1 text-blue-300/70">Changes take effect immediately. Click the link icons for help getting keys.</p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(API_KEY_CONFIG).map(([serviceName, serviceConfig]) => (
                            <div key={serviceName} className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden">
                                {/* Service Header */}
                                <div className="px-6 py-4 bg-slate-700/30 border-b border-slate-700/50">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{serviceConfig.icon}</span>
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">{serviceConfig.name}</h2>
                                            <p className="text-sm text-gray-400">{serviceConfig.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Keys Form */}
                                <div className="p-6 space-y-4">
                                    {serviceConfig.keys.map((keyConfig) => {
                                        const fullKey = `${serviceName}_${keyConfig.key_name}`;
                                        const currentValue = editValues[fullKey] || '';
                                        const dbKey = getKeyFromDb(serviceName, keyConfig.key_name);
                                        const hasChanged = hasValueChanged(serviceName, keyConfig.key_name);
                                        const isSecret = isSecretField(keyConfig.key_name);
                                        const showValue = showPassword.has(fullKey);

                                        return (
                                            <div key={keyConfig.key_name} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
                                                        <span>{keyConfig.label}</span>
                                                        {keyConfig.helpUrl && (
                                                            <a
                                                                href={keyConfig.helpUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-purple-400 hover:text-purple-300 transition-colors"
                                                                title="Get this key"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                        )}
                                                    </label>
                                                    {dbKey && !dbKey.key_value && (
                                                        <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">Not Set</span>
                                                    )}
                                                    {dbKey && dbKey.key_value && (
                                                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">Configured</span>
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <div className="relative flex-1">
                                                        <input
                                                            type={isSecret && !showValue ? 'password' : 'text'}
                                                            value={currentValue}
                                                            onChange={(e) => handleValueChange(serviceName, keyConfig.key_name, e.target.value)}
                                                            placeholder={keyConfig.placeholder}
                                                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm"
                                                        />
                                                        {isSecret && currentValue && (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleShowPassword(fullKey)}
                                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                                            >
                                                                {showValue ? (
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                    </svg>
                                                                ) : (
                                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => saveKey(serviceName, keyConfig.key_name)}
                                                        disabled={savingKey === fullKey || !hasChanged}
                                                        className={`px-4 py-3 rounded-lg font-medium text-sm transition-all ${hasChanged
                                                                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                                                : 'bg-slate-700/50 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        {savingKey === fullKey ? (
                                                            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        ) : (
                                                            'Save'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-8 p-4 bg-slate-800/30 rounded-lg text-center text-gray-400 text-sm">
                    <p className="font-medium text-gray-300">Services using these keys:</p>
                    <p className="mt-1">Skill Gap Analysis • Trend Collection • GitHub Sync • Reports & Notifications</p>
                </div>
            </main>
        </div>
    );
}
