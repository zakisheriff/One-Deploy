/**
 * ProjectContent Client Component
 * 
 * Client component for the project detail page with interactive tabs
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import AmbientOrb from '../../components/AmbientOrb';
import DeploymentLogs from '../../components/DeploymentLogs';
import {
    Repository,
    Deployment,
    // mockDeployments, // Disabled
    // mockDeploymentLogs, // Disabled
    DeploymentLog,
    generateDeploymentUrl,
    formatRelativeTime,
    getStatusColor,
} from '../../lib/mockData';

// Tab types
type TabType = 'overview' | 'deployments' | 'settings';

// Deployment type from database
interface DeploymentData {
    id: string;
    vercelId: string | null;
    url: string | null;
    status: string;
    createdAt: Date | string;
}

// Project type from database
interface ProjectData {
    id: string;
    name: string;
    githubRepo: string;
    framework: string | null;
    createdAt: Date | string;
}

interface ProjectContentProps {
    repo: Repository;
    projectName: string;
    initialProject?: ProjectData | null;
    initialDeployments?: DeploymentData[];
}

export default function ProjectContent({
    repo,
    projectName,
    initialProject,
    initialDeployments = []
}: ProjectContentProps) {
    // Get the most recent deployment as the current one
    const latestDeployment = initialDeployments.length > 0 ? initialDeployments[0] : null;

    // Initialize logs from latest deployment
    const initialLogs: DeploymentLog[] = latestDeployment ? [
        {
            id: 'history-1',
            timestamp: new Date(latestDeployment.createdAt).toLocaleTimeString(),
            message: `Previous deployment: ${latestDeployment.status}`,
            type: latestDeployment.status === 'READY' ? 'success' : 'info',
            level: latestDeployment.status === 'READY' ? 'success' : 'info'
        },
        ...(latestDeployment.url && latestDeployment.status === 'READY' ? [{
            id: 'history-2',
            timestamp: new Date(latestDeployment.createdAt).toLocaleTimeString(),
            message: `Live at: ${latestDeployment.url}`,
            type: 'success' as const,
            level: 'success' as const
        }] : [])
    ] : [];

    // State
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState<DeploymentLog[]>(initialLogs);
    const [pollingDeploymentId, setPollingDeploymentId] = useState<string | null>(null);
    const [deployment, setDeployment] = useState<any | null>(latestDeployment);
    const [deploymentHistory, setDeploymentHistory] = useState<DeploymentData[]>(initialDeployments);

    // Polling Effect
    React.useEffect(() => {
        if (!pollingDeploymentId) return;

        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/deployments/${pollingDeploymentId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || 'Failed to fetch status');

                const status = data.readyState; // QUEUED, BUILDING, ERROR, READY, CANCELED

                // Update Logs based on status
                setLogs(prev => {
                    // Avoid duplicate logs for same status if possible, or just append progress
                    const lastLog = prev[prev.length - 1];
                    if (lastLog && lastLog.message.includes(status)) return prev; // Simple de-dupe

                    if (status === 'BUILDING') {
                        if (prev.some(l => l.message === 'Building...')) return prev;
                        return [...prev, {
                            id: 'building',
                            timestamp: new Date().toLocaleTimeString(),
                            message: 'Building...',
                            type: 'info',
                            level: 'info'
                        }];
                    }

                    return prev;
                });

                if (status === 'READY') {
                    setLogs(prev => [...prev, {
                        id: 'ready',
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Deployment Complete!`,
                        type: 'success',
                        level: 'success'
                    }, {
                        id: 'visit',
                        timestamp: new Date().toLocaleTimeString(),
                        message: `Your site is live at: https://${data.url}`,
                        type: 'success',
                        level: 'success'
                    }]);

                    const newDeployment = {
                        id: data.id || pollingDeploymentId,
                        vercelId: pollingDeploymentId,
                        url: `https://${data.url}`,
                        status: 'READY',
                        createdAt: new Date().toISOString(),
                    };

                    setDeployment(newDeployment);

                    // Add to history
                    setDeploymentHistory(prev => [newDeployment, ...prev]);

                    // UPDATE DATABASE with final status
                    try {
                        await fetch(`/api/deployments/${pollingDeploymentId}/status`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                status: 'READY',
                                url: `https://${data.url}`,
                            }),
                        });
                    } catch (e) {
                        console.error('Failed to update deployment status in DB:', e);
                    }

                    setPollingDeploymentId(null);
                    setIsDeploying(false);
                } else if (status === 'ERROR' || status === 'CANCELED') {
                    throw new Error(`Deployment ${status.toLowerCase()}`);
                }

            } catch (error: any) {
                console.error("Polling Error:", error);
                setLogs(prev => [...prev, {
                    id: 'error-poll',
                    timestamp: new Date().toLocaleTimeString(),
                    message: `Error: ${error.message}`,
                    type: 'error',
                    level: 'error'
                }]);
                setPollingDeploymentId(null);
                setIsDeploying(false);
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [pollingDeploymentId]);

    // Handle redeploy
    const handleDeploy = async () => {
        setIsDeploying(true);
        setLogs([]);
        setDeployment(null);
        setActiveTab('overview');

        // Add initial log
        setLogs(prev => [...prev, {
            id: 'init',
            timestamp: new Date().toLocaleTimeString(),
            message: `Initiating deployment for ${projectName}...`,
            type: 'info',
            level: 'info'
        }]);

        try {
            const res = await fetch('/api/projects/deploy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repoName: repo.name,
                    repoId: repo.id,
                    framework: repo.language
                })
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Deployment failed');
            }

            const data = await res.json();

            setLogs(prev => [...prev, {
                id: 'queued',
                timestamp: new Date().toLocaleTimeString(),
                message: `Deployment queued! ID: ${data.vercelDeploymentId}`,
                type: 'success',
                level: 'success'
            }]);

            // Start Polling
            setPollingDeploymentId(data.vercelDeploymentId);

        } catch (error: any) {
            console.error("Deploy Error:", error);
            setLogs(prev => [...prev, {
                id: 'error',
                timestamp: new Date().toLocaleTimeString(),
                message: `Error: ${error.message}`,
                type: 'error',
                level: 'error'
            }]);
            setIsDeploying(false);
        }
    };

    const deploymentUrl = deployment?.url || generateDeploymentUrl(repo.name);

    // Handle delete
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${projectName}? This cannot be undone.`)) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/projects/${projectName}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete project');

            // Redirect to dashboard
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Delete Error:", error);
            alert("Failed to delete project. Please try again.");
            setIsDeleting(false);
        }
    };

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
                                {/* Visit Site - Only enabled if deployed and READY */}
                                {deployment?.url && deployment?.status === 'READY' ? (
                                    <a
                                        href={deployment.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-button flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Visit Site
                                    </a>
                                ) : (
                                    <span
                                        className="glass-button flex items-center gap-2 opacity-50 cursor-not-allowed"
                                        title="Deploy first to visit site"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Visit Site
                                    </span>
                                )}
                                <button
                                    onClick={handleDeploy}
                                    disabled={isDeploying}
                                    className="accent-button flex items-center gap-2"
                                >
                                    <svg className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {isDeploying ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        )}
                                    </svg>
                                    {isDeploying ? 'Deploying...' : (deployment ? 'Redeploy' : 'Deploy')}
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
                            {/* Production Deployment - Hidden until connected to API */}
                            {false && (
                                <div className="glass-panel p-6">
                                    <h2 className="text-lg font-semibold text-textPrimary mb-4">Production Deployment</h2>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        {/* ... content ... */}
                                    </div>
                                </div>
                            )}

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

                            {deploymentHistory.length === 0 ? (
                                <div className="glass-panel p-8 text-center">
                                    <svg className="w-12 h-12 mx-auto text-textMuted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    <p className="text-textMuted">No deployments yet.</p>
                                    <p className="text-textMuted text-sm mt-1">Deploy your project to see history here.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {deploymentHistory.map((d, index) => (
                                        <div
                                            key={d.id}
                                            className={`glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${index === 0 ? 'border border-white/20' : ''}`}
                                        >
                                            {/* Status Badge */}
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${d.status === 'READY'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                    : d.status === 'ERROR' || d.status === 'CANCELED'
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                    }`}>
                                                    {d.status}
                                                </span>
                                                {index === 0 && (
                                                    <span className="text-xs text-textMuted">Latest</span>
                                                )}
                                            </div>

                                            {/* Deployment Info */}
                                            <div className="flex-1">
                                                <p className="text-sm text-textPrimary font-mono">
                                                    {d.vercelId || d.id}
                                                </p>
                                                <p className="text-xs text-textMuted">
                                                    {new Date(d.createdAt).toLocaleString()}
                                                </p>
                                            </div>

                                            {/* URL Link */}
                                            {d.url && d.status === 'READY' && (
                                                <a
                                                    href={d.url.startsWith('http') ? d.url : `https://${d.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-glass-light hover:bg-glass-medium text-sm text-textSecondary hover:text-textPrimary transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    Visit
                                                </a>
                                            )}
                                        </div>
                                    ))}
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
                                <div className="mt-6 pt-4 border-t border-white/10">
                                    <button
                                        onClick={() => alert('Settings saved successfully!')}
                                        className="accent-button"
                                    >
                                        Save Settings
                                    </button>
                                </div>
                            </div>

                            <div className="glass-panel p-6">
                                <h2 className="text-lg font-semibold text-textPrimary mb-4">Environment Variables</h2>
                                <p className="text-textMuted text-sm mb-4">Add environment variables for your build process.</p>
                                <button className="glass-button">
                                    + Add Variable
                                </button>
                            </div>

                            {/* Custom Domain Section */}
                            <div className="glass-panel p-6">
                                <h2 className="text-lg font-semibold text-textPrimary mb-4">Custom Domain</h2>
                                <p className="text-textMuted text-sm mb-4">
                                    Add your own domain instead of using vercel.app URLs.
                                </p>

                                <div className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        id="customDomainInput"
                                        placeholder="e.g., myproject.theoneatom.com"
                                        className="flex-1 px-4 py-3 rounded-lg bg-glass-light border border-white/10 text-textPrimary focus:outline-none focus:border-white/30"
                                    />
                                    <button
                                        onClick={async () => {
                                            const input = document.getElementById('customDomainInput') as HTMLInputElement;
                                            const domain = input?.value?.trim();
                                            if (!domain) {
                                                alert('Please enter a domain');
                                                return;
                                            }
                                            try {
                                                const res = await fetch(`/api/projects/${projectName}/domain`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ domain }),
                                                });
                                                const data = await res.json();
                                                if (res.ok) {
                                                    alert(`Domain ${domain} added successfully! Set up your DNS now.`);
                                                    input.value = '';
                                                } else {
                                                    alert(`Error: ${data.error}`);
                                                }
                                            } catch (e: any) {
                                                alert(`Error: ${e.message}`);
                                            }
                                        }}
                                        className="accent-button"
                                    >
                                        Add Domain
                                    </button>
                                </div>

                                <div className="text-xs text-textMuted bg-white/5 p-3 rounded-lg">
                                    <p className="font-medium mb-1">DNS Setup Required:</p>
                                    <p>Add a CNAME record pointing your domain to <code className="text-white">cname.vercel-dns.com</code></p>
                                </div>
                            </div>

                            {/* Danger Zone - Only show if project has been deployed */}
                            {deployment ? (
                                <div className="glass-panel p-6 border border-red-500/30">
                                    <h2 className="text-lg font-semibold text-red-400 mb-4">Danger Zone</h2>
                                    <p className="text-textMuted text-sm mb-4">
                                        Permanently delete this project and all of its deployments from Vercel.
                                    </p>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete Project'}
                                    </button>
                                </div>
                            ) : (
                                <div className="glass-panel p-6 border border-white/10">
                                    <h2 className="text-lg font-semibold text-textMuted mb-2">No Deployment Yet</h2>
                                    <p className="text-textMuted text-sm">
                                        Deploy your project first to access project management options.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
