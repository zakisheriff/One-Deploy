/**
 * Dashboard Page - One Deploy
 * 
 * User dashboard for managing deployments featuring:
 * - Deployed Projects section (from database)
 * - Connected GitHub repositories list
 * - Search functionality
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import RepoList from '../components/RepoList';

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

interface DeployedProject {
    id: string;
    name: string;
    githubRepo: string;
    framework: string | null;
    createdAt: string;
    updatedAt: string;
    latestDeployment: {
        id: string;
        status: string;
        url: string | null;
        createdAt: string;
    } | null;
}

// ============================================
// Page Component
// ============================================

export default function DashboardPage() {
    const { data: session, status } = useSession();

    // State for repositories
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loadingRepos, setLoadingRepos] = useState(true);
    const [repoError, setRepoError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // State for deployed projects
    const [deployedProjects, setDeployedProjects] = useState<DeployedProject[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

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
            if (status !== 'authenticated') return;
            try {
                const res = await fetch('/api/github/repos');
                if (!res.ok) throw new Error('Failed to fetch repos');
                const data = await res.json();
                // API returns { repos: [...] }
                setRepos(data.repos || []);
            } catch (err: any) {
                setRepoError(err.message);
            } finally {
                setLoadingRepos(false);
            }
        }
        fetchRepos();
    }, [status]);

    // Fetch Deployed Projects
    useEffect(() => {
        async function fetchDeployedProjects() {
            if (status !== 'authenticated') return;
            try {
                const res = await fetch('/api/deployed-projects');
                if (!res.ok) throw new Error('Failed to fetch projects');
                const data = await res.json();
                setDeployedProjects(data.projects || []);
            } catch (err) {
                console.error('Error fetching deployed projects:', err);
            } finally {
                setLoadingProjects(false);
            }
        }
        fetchDeployedProjects();
    }, [status]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-textMuted">Loading...</div>
            </div>
        );
    }

    const user = session?.user;

    return (
        <div className="relative min-h-screen pb-24 md:pb-8 bg-bgBlack">
            <Navigation />

            <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 p-0.5">
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
                                    {user?.email} • {repos.length} repositories
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Deployed Projects Section */}
                    {!loadingProjects && deployedProjects.length > 0 && (
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-textPrimary flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Deployed Projects
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {deployedProjects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/project/${project.name}`}
                                        className="glass-panel p-5 hover:bg-glass-medium transition-colors group"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-textPrimary group-hover:text-white transition-colors">
                                                {project.name}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${project.latestDeployment?.status === 'READY'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : project.latestDeployment?.status === 'ERROR'
                                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                }`}>
                                                {project.latestDeployment?.status || 'Unknown'}
                                            </span>
                                        </div>

                                        <p className="text-sm text-textMuted mb-3">
                                            {project.githubRepo}
                                        </p>

                                        {project.latestDeployment?.url && project.latestDeployment.status === 'READY' && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                                <span className="text-textMuted truncate">
                                                    {project.latestDeployment.url.replace('https://', '')}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Repositories Section */}
                    <section className="space-y-6">
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
                                    className="w-48 px-4 py-2 pl-9 rounded-lg bg-white/5 border border-white/10 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-white/30 transition-colors"
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
                    </section>
                </div>
            </main>
        </div>
    );
}
