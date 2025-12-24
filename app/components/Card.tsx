/**
 * Card Component
 * 
 * Glassmorphic card for displaying deployed repositories.
 * Features:
 * - Glass panel background with blur
 * - Hover animation (translateY + brightness)
 * - Status badge for deployment state
 * - Repository info and actions
 * 
 * Used in the landing page grid and dashboard
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Deployment, getStatusColor, formatRelativeTime } from '../lib/mockData';

// ============================================
// Types
// ============================================

interface CardProps {
    deployment: Deployment;
}

// ============================================
// Status Icons
// ============================================

const statusIcons: Record<string, JSX.Element> = {
    success: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    pending: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
    ),
    building: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
    ),
    deploying: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    ),
    failed: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
};

// ============================================
// Component
// ============================================

/**
 * Card displays a deployed repository with status and actions
 */
export default function Card({ deployment }: CardProps) {
    const { repo_name, status, url, created_at, build_time, commit_sha, commit_message } = deployment;

    return (
        <article className="glass-panel-hover p-6 flex flex-col gap-4 overflow-hidden">
            {/* ================================================
          Header: Repo Name + Status
          ================================================ */}
            <div className="flex items-start justify-between gap-3">
                {/* Repository name with icon */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Folder icon */}
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                    </div>
                    {/* Repo name */}
                    <div className="min-w-0">
                        <h3 className="font-semibold text-textPrimary truncate">
                            {repo_name}
                        </h3>
                        <p className="text-xs text-textMuted">
                            {formatRelativeTime(created_at)}
                        </p>
                    </div>
                </div>

                {/* Status badge */}
                <span className={`status-badge flex-shrink-0 ${getStatusColor(status)}`}>
                    {statusIcons[status]}
                    <span className="capitalize">{status}</span>
                </span>
            </div>

            {/* ================================================
          Commit Info
          ================================================ */}
            <div className="flex items-center gap-2 text-sm text-textMuted">
                {/* Git icon */}
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <code className="font-mono text-xs bg-glass-light px-1.5 py-0.5 rounded">
                    {commit_sha}
                </code>
                <span className="truncate">{commit_message}</span>
            </div>

            {/* ================================================
          Build Time (if completed)
          ================================================ */}
            {build_time > 0 && (
                <div className="flex items-center gap-2 text-sm text-textMuted">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Built in {build_time}s</span>
                </div>
            )}

            {/* ================================================
          URL / Actions
          ================================================ */}
            <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                {/* Deployment URL */}
                {status === 'success' && url ? (
                    <Link
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-white hover:text-textSecondary transition-colors duration-300 truncate"
                    >
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="truncate">{url.replace('https://', '')}</span>
                    </Link>
                ) : (
                    <span className="text-sm text-textMuted">
                        {status === 'failed' ? 'Build failed' : 'Deploying...'}
                    </span>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* View logs button */}
                    <button
                        className="p-2 rounded-lg bg-glass-light hover:bg-glass-medium transition-colors duration-300"
                        title="View logs"
                        aria-label="View deployment logs"
                    >
                        <svg className="w-4 h-4 text-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Redeploy button */}
                    <button
                        className="p-2 rounded-lg bg-glass-light hover:bg-glass-medium transition-colors duration-300"
                        title="Redeploy"
                        aria-label="Redeploy project"
                    >
                        <svg className="w-4 h-4 text-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
}
