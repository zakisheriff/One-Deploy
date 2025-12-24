/**
 * Dashboard Page - One Deploy
 * 
 * User dashboard for managing deployments featuring:
 * - Welcome message with user info
 * - Connected GitHub repositories list
 * - Deploy buttons for each repo
 * - Deployment logs viewer
 * - Connect GitHub CTA
 * 
 * Uses mocked data for MVP demonstration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navigation from '../components/Navigation';
import RepoList from '../components/RepoList';
import DeploymentLogs from '../components/DeploymentLogs';
import AmbientOrb from '../components/AmbientOrb';
import {
    mockDeploymentLogs,
    mockOAuthState,
    DeploymentLog
} from '../lib/mockData';

// ============================================
// Types
// ============================================

interface Repository {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    description: string;
    language: string;
    updated_at: string;
    default_branch: string;
}

// ============================================
// Page Component
// ============================================

/**
 * Dashboard page for managing deployments
 */
export default function DashboardPage() {
    const { data: session, status } = useSession();

    // State for real data
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const [repoError, setRepoError] = useState<string | null>(null);

    // State for deployment simulation
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState<DeploymentLog[]>([]);

    // Fetch Repositories
    useEffect(() => {
        async function fetchRepos() {
            if (status === 'authenticated') {
                try {
                    setLoadingRepos(true);
                    const res = await fetch('/api/github/repos');
                    const data = await res.json();

                    if (!res.ok) {
                        throw new Error(data.error || 'Failed to fetch repositories');
                    }

                    setRepos(data.repos || []);
                } catch (err: any) {
                    console.error("Repo fetch error:", err);
                    setRepoError(err.message);
                } finally {
                    setLoadingRepos(false);
                }
            } else if (status === 'unauthenticated') {
                setLoadingRepos(false);
                // Optionally redirect
            }
        }

        fetchRepos();
    }, [status]);

    /**
     * Handle deploy action
     * Simulates deployment by streaming logs
     */
    const handleDeploy = (repoName: string) => {
        setIsDeploying(true);
        setLogs([]);

        // Simulate log streaming
        let index = 0;
        const interval = setInterval(() => {
            if (index < mockDeploymentLogs.length) {
                setLogs((prev) => [...prev, mockDeploymentLogs[index]]);
                index++;
            } else {
                clearInterval(interval);
                setIsDeploying(false);
            }
        }, 300); // Add a new log every 300ms
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    const user = session?.user;

    return (
        <div className="relative min-h-screen pb-24 md:pb-8">
            <Navigation />

            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <AmbientOrb color="purple" size={400} position={{ top: '10%', left: '5%' }} opacity={0.25} />
                <AmbientOrb color="blue" size={350} position={{ top: '60%', left: '85%' }} opacity={0.2} />
                <AmbientOrb color="cyan" size={250} position={{ top: '80%', left: '20%' }} opacity={0.2} />
            </div>

            <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue p-0.5">
                                    <div className="w-full h-full rounded-full bg-bgBlack flex items-center justify-center overflow-hidden">
                                        {user?.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={user.image}
                                                alt={user.name || 'User'}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-textPrimary">
                                                {user?.name?.charAt(0) || 'U'}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
                                        Welcome back, {user?.name?.split(' ')[0] || 'Atom'}
                                    </h1>
                                    <p className="text-textMuted">
                                        {user?.email} • {repos.length} repositories connected
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="accent-button flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Project
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-textPrimary flex items-center gap-2">
                                    <svg className="w-5 h-5 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    Your Repositories
                                </h2>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search repos..."
                                        className="w-48 px-4 py-2 pl-9 rounded-lg bg-glass-light backdrop-blur-glass border border-white/10 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-accent-purple/50 transition-colors"
                                    />
                                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {loadingRepos ? (
                                <div className="text-center py-10 text-textMuted animate-pulse">Loading repositories...</div>
                            ) : repoError ? (
                                <div className="text-center py-10 text-red-400">Error: {repoError}. Try re-logging in.</div>
                            ) : (
                                <RepoList
                                    repositories={repos as any[]}
                                    onDeploy={handleDeploy}
                                />
                            )}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Build Output
                                </h2>
                                <DeploymentLogs logs={logs} isDeploying={isDeploying} />
                            </div>

                            <div className="glass-panel p-6">
                                <h3 className="text-sm font-medium text-textMuted uppercase tracking-wider mb-6">Quick Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-textPrimary">0</p>
                                        <p className="text-sm text-textMuted mt-2">Total Deploys</p>
                                    </div>
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-green-400">100%</p>
                                        <p className="text-sm text-textMuted mt-2">Success Rate</p>
                                    </div>
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-blue-400">0s</p>
                                        <p className="text-sm text-textMuted mt-2">Avg. Build</p>
                                    </div>
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-purple-400">0B</p>
                                        <p className="text-sm text-textMuted mt-2">Bandwidth</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
