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
import AmbientOrb from '../components/AmbientOrb';

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
    const [searchQuery, setSearchQuery] = useState('');

    // Filter repos based on search query
    const filteredRepos = repos.filter(repo => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            repo.name.toLowerCase().includes(query) ||
            (repo.description && repo.description.toLowerCase().includes(query)) ||
            (repo.language && repo.language.toLowerCase().includes(query))
        );
    });

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
                    </header>

                    <div className="space-y-6">
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                repositories={filteredRepos as any[]}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
