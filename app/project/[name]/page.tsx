/**
 * Project Detail Page - One Deploy
 * 
 * Detailed view for a single project with:
 * - Overview tab with deployment info
 * - Deployments tab with history
 * - Settings tab with project configuration
 * 
 * Similar to Vercel's project view
 */

'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import AmbientOrb from '../../components/AmbientOrb';
import DeploymentLogs from '../../components/DeploymentLogs';
import {
    mockRepositories,
    mockDeployments,
    mockDeploymentLogs,
    DeploymentLog,
    generateDeploymentUrl,
    formatRelativeTime,
    getStatusColor,
} from '../../lib/mockData';

// Generate static params for all projects
export function generateStaticParams() {
    return mockRepositories.map((repo) => ({
        name: repo.name,
    }));
}

// Tab types
type TabType = 'overview' | 'deployments' | 'settings';

export default function ProjectPage() {
    const params = useParams();
    const projectName = params.name as string;

    // Find the repository
    const repo = mockRepositories.find(r => r.name === projectName);
    const deployment = mockDeployments.find(d => d.repo_name === projectName);

    // State
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState<DeploymentLog[]>([]);

    // Handle redeploy
    const handleDeploy = () => {
        setIsDeploying(true);
        setLogs([]);
        setActiveTab('overview');

        let index = 0;
        const interval = setInterval(() => {
            if (index < mockDeploymentLogs.length) {
                setLogs((prev) => [...prev, mockDeploymentLogs[index]]);
                index++;
            } else {
                clearInterval(interval);
                setIsDeploying(false);
            }
        }, 300);
    };

    if (!repo) {
        return (
            <div className="relative min-h-screen pb-24 md:pb-8">
                <Navigation />
                <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-textPrimary mb-4">Project Not Found</h1>
                        <p className="text-textMuted mb-6">The project &quot;{projectName}&quot; doesn&apos;t exist.</p>
                        <Link href="/dashboard" className="accent-button">
                            Back to Dashboard
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const deploymentUrl = deployment?.url || generateDeploymentUrl(repo.name);

    return (
        <div className="relative min-h-screen pb-24 md:pb-8">
            {/* Navigation */}
            <Navigation />

            {/* Background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <AmbientOrb
                    color="purple"
                    size={400}
                    position={{ top: '10%', left: '5%' }}
                    opacity={0.2}
                />
                <AmbientOrb
                    color="blue"
                    size={350}
                    position={{ top: '60%', left: '85%' }}
                    opacity={0.15}
                />
            </div>

            {/* Main content */}
            <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <header className="mb-8">
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 text-sm text-textMuted mb-4">
                            <Link href="/dashboard" className="hover:text-textPrimary">
                                Projects
                            </Link>
                            <span>/</span>
                            <span className="text-textPrimary">{repo.name}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Project name with icon */}
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 border border-white/10 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
                                        {repo.name}
                                    </h1>
                                    <p className="text-textMuted">{repo.description}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <a
                                    href={deploymentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass-button flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    Visit Site
                                </a>
                                <button
                                    onClick={handleDeploy}
                                    disabled={isDeploying}
                                    className="accent-button flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    {isDeploying ? 'Deploying...' : 'Redeploy'}
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Tabs */}
                    <div className="border-b border-white/10 mb-6">
                        <nav className="flex gap-6">
                            {(['overview', 'deployments', 'settings'] as TabType[]).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                                        ? 'border-white text-textPrimary'
                                        : 'border-transparent text-textMuted hover:text-textSecondary'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Production Deployment */}
                            <div className="glass-panel p-6">
                                <h2 className="text-lg font-semibold text-textPrimary mb-4">Production Deployment</h2>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`status-badge ${deployment ? getStatusColor(deployment.status) : 'status-success'}`}>
                                                {deployment?.status || 'success'}
                                            </span>
                                            <span className="text-textMuted text-sm">
                                                {deployment ? formatRelativeTime(deployment.created_at) : 'Never deployed'}
                                            </span>
                                        </div>
                                        <a
                                            href={deploymentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white hover:text-textSecondary transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {deploymentUrl.replace('https://', '')}
                                        </a>
                                    </div>
                                    {deployment && (
                                        <div className="text-sm text-textMuted">
                                            <div className="flex items-center gap-2">
                                                <code className="px-2 py-1 bg-glass-light rounded text-xs">
                                                    {deployment.commit_sha}
                                                </code>
                                                <span>{deployment.commit_message}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Build Logs */}
                            <div>
                                <h2 className="text-lg font-semibold text-textPrimary mb-4">Build Output</h2>
                                <DeploymentLogs logs={logs} isDeploying={isDeploying} />
                            </div>

                            {/* Project Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass-panel p-6">
                                    <h3 className="text-sm font-medium text-textMuted uppercase tracking-wider mb-4">Repository</h3>
                                    <a
                                        href={repo.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-white hover:text-textSecondary transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        <span>{repo.full_name}</span>
                                    </a>
                                    <div className="mt-3 flex items-center gap-4 text-sm text-textMuted">
                                        <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-blue-500" />
                                            {repo.language}
                                        </span>
                                        <span>Branch: {repo.default_branch}</span>
                                    </div>
                                </div>

                                <div className="glass-panel p-6">
                                    <h3 className="text-sm font-medium text-textMuted uppercase tracking-wider mb-4">Deployment Info</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-textMuted">Build Time</span>
                                            <span className="text-textPrimary">{deployment?.build_time || 0}s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-textMuted">Framework</span>
                                            <span className="text-textPrimary">Next.js</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-textMuted">Node Version</span>
                                            <span className="text-textPrimary">20.x</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'deployments' && (
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-textPrimary">Deployment History</h2>
                            {mockDeployments.filter(d => d.repo_name === projectName).length > 0 ? (
                                mockDeployments
                                    .filter(d => d.repo_name === projectName)
                                    .map((deploy) => (
                                        <div key={deploy.id} className="glass-panel p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <span className={`status-badge ${getStatusColor(deploy.status)}`}>
                                                    {deploy.status}
                                                </span>
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <code className="px-2 py-0.5 bg-glass-light rounded text-xs text-textSecondary">
                                                            {deploy.commit_sha}
                                                        </code>
                                                        <span className="text-textPrimary">{deploy.commit_message}</span>
                                                    </div>
                                                    <p className="text-xs text-textMuted mt-1">
                                                        {formatRelativeTime(deploy.created_at)}
                                                        {deploy.build_time > 0 && ` • Built in ${deploy.build_time}s`}
                                                    </p>
                                                </div>
                                            </div>
                                            {deploy.url && (
                                                <a
                                                    href={deploy.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-textMuted hover:text-textPrimary transition-colors flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Visit
                                                </a>
                                            )}
                                        </div>
                                    ))
                            ) : (
                                <div className="glass-panel p-8 text-center">
                                    <p className="text-textMuted">No deployments yet. Click &quot;Redeploy&quot; to start your first deployment.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            <div className="glass-panel p-6">
                                <h2 className="text-lg font-semibold text-textPrimary mb-4">General Settings</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-textSecondary mb-2">Project Name</label>
                                        <input
                                            type="text"
                                            defaultValue={repo.name}
                                            className="w-full px-4 py-3 rounded-lg bg-glass-light border border-white/10 text-textPrimary focus:outline-none focus:border-white/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-textSecondary mb-2">Build Command</label>
                                        <input
                                            type="text"
                                            defaultValue="npm run build"
                                            className="w-full px-4 py-3 rounded-lg bg-glass-light border border-white/10 text-textPrimary focus:outline-none focus:border-white/30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-textSecondary mb-2">Output Directory</label>
                                        <input
                                            type="text"
                                            defaultValue="out"
                                            className="w-full px-4 py-3 rounded-lg bg-glass-light border border-white/10 text-textPrimary focus:outline-none focus:border-white/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="glass-panel p-6">
                                <h2 className="text-lg font-semibold text-textPrimary mb-4">Environment Variables</h2>
                                <p className="text-textMuted text-sm mb-4">Add environment variables for your build process.</p>
                                <button className="glass-button">
                                    + Add Variable
                                </button>
                            </div>

                            <div className="glass-panel p-6 border border-red-500/30">
                                <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
                                <p className="text-textMuted text-sm mb-4">
                                    Permanently delete this project and all of its deployments.
                                </p>
                                <button className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors">
                                    Delete Project
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
