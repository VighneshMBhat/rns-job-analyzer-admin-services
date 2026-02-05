'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ApiKey, SERVICE_DISPLAY_NAMES } from '@/lib/types';

export default function DashboardPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState<string | null>(null);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showValues, setShowValues] = useState<Set<string>>(new Set());

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
                setKeys(data.keys);
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

    const startEditing = (key: ApiKey) => {
        setEditingKey(key.id);
        setEditValue(key.key_value);
    };

    const cancelEditing = () => {
        setEditingKey(null);
        setEditValue('');
    };

    const saveKey = async (keyId: string) => {
        setIsSaving(keyId);
        try {
            const response = await fetch('/api/keys', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: keyId, key_value: editValue }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Key updated successfully!' });
                setEditingKey(null);
                fetchKeys();
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update key' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update key' });
        } finally {
            setIsSaving(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const toggleShowValue = (keyId: string) => {
        setShowValues(prev => {
            const newSet = new Set(prev);
            if (newSet.has(keyId)) {
                newSet.delete(keyId);
            } else {
                newSet.add(keyId);
            }
            return newSet;
        });
    };

    // Group keys by service
    const groupedKeys = keys.reduce((acc, key) => {
        if (!acc[key.service_name]) {
            acc[key.service_name] = [];
        }
        acc[key.service_name].push(key);
        return acc;
    }, {} as Record<string, ApiKey[]>);

    const maskValue = (value: string) => {
        if (!value) return '(not set)';
        if (value.length <= 8) return '••••••••';
        return value.slice(0, 4) + '••••••••' + value.slice(-4);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Alert Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
                            ? 'bg-green-500/10 border border-green-500/50 text-green-400'
                            : 'bg-red-500/10 border border-red-500/50 text-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                {/* Info Banner */}
                <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-200">
                            <p className="font-medium">API keys stored here are used by all backend services.</p>
                            <p className="mt-1 text-blue-300/70">Changes take effect immediately. Services will fetch the latest keys on each request.</p>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedKeys).map(([serviceName, serviceKeys]) => {
                            const serviceInfo = SERVICE_DISPLAY_NAMES[serviceName] || { name: serviceName, description: '' };

                            return (
                                <div key={serviceName} className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-xl overflow-hidden">
                                    {/* Service Header */}
                                    <div className="px-6 py-4 bg-slate-700/30 border-b border-slate-700/50">
                                        <h2 className="text-lg font-semibold text-white">{serviceInfo.name}</h2>
                                        <p className="text-sm text-gray-400">{serviceInfo.description}</p>
                                    </div>

                                    {/* Keys List */}
                                    <div className="divide-y divide-slate-700/50">
                                        {serviceKeys.map((key) => (
                                            <div key={key.id} className="px-6 py-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-sm font-mono text-purple-400">{key.key_name}</span>
                                                            {!key.key_value && (
                                                                <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded">Not Set</span>
                                                            )}
                                                            {key.key_value && (
                                                                <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded">Active</span>
                                                            )}
                                                        </div>
                                                        {key.description && (
                                                            <p className="mt-1 text-xs text-gray-500">{key.description}</p>
                                                        )}
                                                    </div>

                                                    {editingKey === key.id ? (
                                                        <div className="flex items-center space-x-2 ml-4">
                                                            <input
                                                                type="text"
                                                                value={editValue}
                                                                onChange={(e) => setEditValue(e.target.value)}
                                                                className="w-64 px-3 py-2 text-sm bg-slate-900/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                                placeholder="Enter API key..."
                                                            />
                                                            <button
                                                                onClick={() => saveKey(key.id)}
                                                                disabled={isSaving === key.id}
                                                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
                                                            >
                                                                {isSaving === key.id ? 'Saving...' : 'Save'}
                                                            </button>
                                                            <button
                                                                onClick={cancelEditing}
                                                                className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-3 ml-4">
                                                            <div className="flex items-center space-x-2">
                                                                <code className="text-sm text-gray-400 font-mono">
                                                                    {showValues.has(key.id) ? key.key_value || '(empty)' : maskValue(key.key_value)}
                                                                </code>
                                                                {key.key_value && (
                                                                    <button
                                                                        onClick={() => toggleShowValue(key.id)}
                                                                        className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                                                                        title={showValues.has(key.id) ? 'Hide' : 'Show'}
                                                                    >
                                                                        {showValues.has(key.id) ? (
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                                            </svg>
                                                                        ) : (
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        )}
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => startEditing(key)}
                                                                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Footer Info */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Last updated keys will be reflected in all services immediately.</p>
                    <p className="mt-1">Services: Skill Gap Analysis • Trend Collection • GitHub Sync • Reports</p>
                </div>
            </main>
        </div>
    );
}
