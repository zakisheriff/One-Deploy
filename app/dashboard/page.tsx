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

import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import RepoList from '../components/RepoList';
import DeploymentLogs from '../components/DeploymentLogs';
import AmbientOrb from '../components/AmbientOrb';
import {
    mockUser,
    mockRepositories,
    mockDeploymentLogs,
    mockOAuthState,
    DeploymentLog
} from '../lib/mockData';

// ============================================
// Page Component
// ============================================

/**
 * Dashboard page for managing deployments
 */
export default function DashboardPage() {
    // State for deployment simulation
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState<DeploymentLog[]>([]);
    const [isConnected] = useState(mockOAuthState.isAuthenticated);

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

    /**
     * Simulate GitHub OAuth connection
     */
    const handleConnectGitHub = () => {
        // In production, this would redirect to GitHub OAuth
        alert('This would redirect to GitHub OAuth in production');
    };

    return (
        <div className="relative min-h-screen pb-24 md:pb-8">
            {/* ================================================
          Navigation
          ================================================ */}
            <Navigation />

            {/* ================================================
          Background Ambient Orbs
          ================================================ */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <AmbientOrb
                    color="purple"
                    size={400}
                    position={{ top: '10%', left: '5%' }}
                    opacity={0.25}
                />
                <AmbientOrb
                    color="blue"
                    size={350}
                    position={{ top: '60%', left: '85%' }}
                    opacity={0.2}
                />
                <AmbientOrb
                    color="cyan"
                    size={250}
                    position={{ top: '80%', left: '20%' }}
                    opacity={0.2}
                />
            </div>

            {/* ================================================
          Main Content
          ================================================ */}
            <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* ============================================
              Header Section
              ============================================ */}
                    <header className="mb-10">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Welcome message */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue p-0.5">
                                    <div className="w-full h-full rounded-full bg-bgBlack flex items-center justify-center overflow-hidden">
                                        {mockUser.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={mockUser.avatar_url}
                                                alt={mockUser.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl font-bold text-textPrimary">
                                                {mockUser.name.charAt(0)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Greeting */}
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
                                        Welcome back, {mockUser.name.split(' ')[0]}
                                    </h1>
                                    <p className="text-textMuted">
                                        @{mockUser.login} • {mockRepositories.length} repositories connected
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-3">
                                {!isConnected && (
                                    <button
                                        onClick={handleConnectGitHub}
                                        className="glass-button flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        Connect GitHub
                                    </button>
                                )}
                                <button
                                    className="accent-button flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    New Project
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* ============================================
              Main Grid Layout
              ============================================ */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* ========================================
                Left Column: Repositories
                ======================================== */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Section header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-textPrimary flex items-center gap-2">
                                    <svg className="w-5 h-5 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                    </svg>
                                    Your Repositories
                                </h2>

                                {/* Filter/search placeholder */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search repos..."
                                        className="w-48 px-4 py-2 pl-9 rounded-lg bg-glass-light backdrop-blur-glass border border-white/10 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-accent-purple/50 transition-colors"
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Repository list */}
                            <RepoList
                                repositories={mockRepositories}
                                onDeploy={handleDeploy}
                            />
                        </div>

                        {/* ========================================
                Right Column: Deployment Logs & Stats
                ======================================== */}
                        <div className="space-y-6">
                            {/* Deployment logs */}
                            <div>
                                <h2 className="text-xl font-semibold text-textPrimary mb-4 flex items-center gap-2">
                                    <svg className="w-5 h-5 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Build Output
                                </h2>
                                <DeploymentLogs logs={logs} isDeploying={isDeploying} />
                            </div>

                            {/* Quick stats */}
                            <div className="glass-panel p-6">
                                <h3 className="text-sm font-medium text-textMuted uppercase tracking-wider mb-6">
                                    Quick Stats
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Total deployments */}
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-textPrimary">147</p>
                                        <p className="text-sm text-textMuted mt-2">Total Deploys</p>
                                    </div>

                                    {/* Success rate */}
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-green-400">98%</p>
                                        <p className="text-sm text-textMuted mt-2">Success Rate</p>
                                    </div>

                                    {/* Avg build time */}
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-blue-400">32s</p>
                                        <p className="text-sm text-textMuted mt-2">Avg. Build</p>
                                    </div>

                                    {/* Bandwidth */}
                                    <div className="text-center p-5 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-4xl font-bold text-purple-400">2.4TB</p>
                                        <p className="text-sm text-textMuted mt-2">Bandwidth</p>
                                    </div>
                                </div>
                            </div>

                            {/* GitHub Actions template */}
                            <div className="glass-panel p-5">
                                <h3 className="text-sm font-medium text-textMuted uppercase tracking-wider mb-3">
                                    GitHub Actions
                                </h3>
                                <p className="text-sm text-textSecondary mb-4">
                                    Add this workflow to your repo to enable automatic deployments.
                                </p>
                                <a
                                    href="#workflow"
                                    className="inline-flex items-center gap-2 text-sm text-accent-purple hover:text-accent-blue transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Workflow Template
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
