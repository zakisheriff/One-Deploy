/**
 * RepoList Component
 * 
 * Displays a list of connected GitHub repositories.
 * Features:
 * - Repository info (name, language, last update)
 * - Deploy button for each repo
 * - Private/public badge
 * - Hover animations
 * 
 * Uses mocked data for MVP
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Repository, formatRelativeTime } from '../lib/mockData';

// ============================================
// Types
// ============================================

interface RepoListProps {
    /** List of repositories to display */
    repositories: Repository[];
}

// ============================================
// Language Colors
// ============================================

/** Colors for different programming languages */
const languageColors: Record<string, string> = {
    TypeScript: 'bg-blue-500',
    JavaScript: 'bg-yellow-400',
    Python: 'bg-green-500',
    Rust: 'bg-orange-500',
    Go: 'bg-cyan-400',
    HTML: 'bg-red-500',
    CSS: 'bg-purple-500',
    default: 'bg-gray-400',
};

// ============================================
// Component
// ============================================

/**
 * RepoList displays connected GitHub repositories with deploy options
 */
export default function RepoList({ repositories }: RepoListProps) {
    if (repositories.length === 0) {
        // Empty state
        return (
            <div className="glass-panel p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-glass-medium flex items-center justify-center">
                    <svg className="w-8 h-8 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-textPrimary mb-2">
                    No repositories connected
                </h3>
                <p className="text-textMuted mb-6">
                    Connect your GitHub account to start deploying your projects.
                </p>
                <button className="accent-button">
                    Connect GitHub
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {repositories.map((repo) => (
                <article
                    key={repo.id}
                    className="glass-panel-hover p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                    {/* ================================================
              Repository Info - Clickable to open project
              ================================================ */}
                    <Link
                        href={`/project/${repo.name}`}
                        className="flex items-center gap-4 flex-1 min-w-0 group cursor-pointer"
                    >
                        {/* Folder icon */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/20 transition-colors">
                            <svg className="w-6 h-6 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                        </div>

                        {/* Repo details */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {/* Repository name */}
                                <h3 className="font-semibold text-textPrimary truncate group-hover:text-white transition-colors">
                                    {repo.name}
                                </h3>

                                {/* Private badge */}
                                {repo.private && (
                                    <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/30">
                                        Private
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            <p className="text-sm text-textMuted truncate mb-2">
                                {repo.description || 'No description'}
                            </p>

                            {/* Meta info row */}
                            <div className="flex items-center gap-4 text-xs text-textMuted">
                                {/* Language */}
                                <span className="flex items-center gap-1.5">
                                    <span className={`w-2.5 h-2.5 rounded-full ${languageColors[repo.language] || languageColors.default}`} />
                                    {repo.language}
                                </span>

                                {/* Last updated */}
                                <span className="flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Updated {formatRelativeTime(repo.updated_at)}
                                </span>

                                {/* Branch */}
                                <span className="flex items-center gap-1 hidden sm:flex">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    {repo.default_branch}
                                </span>
                            </div>
                        </div>
                    </Link>

                    {/* ================================================
              Actions
              ================================================ */}
                    <div className="flex items-center gap-3 sm:flex-shrink-0">
                        {/* GitHub link */}
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-lg bg-glass-light hover:bg-glass-medium transition-colors duration-300"
                            title="View on GitHub"
                            aria-label="View repository on GitHub"
                        >
                            <svg className="w-5 h-5 text-textSecondary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        {/* View Project Arrow */}
                        <Link
                            href={`/project/${repo.name}`}
                            className="p-2.5 rounded-lg bg-accent-purple/20 hover:bg-accent-purple/30 border border-accent-purple/30 transition-colors duration-300"
                            title="View Project"
                        >
                            <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );
}
