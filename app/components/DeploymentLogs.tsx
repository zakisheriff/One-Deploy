/**
 * DeploymentLogs Component
 * 
 * Displays live deployment logs with status indicators.
 * Features:
 * - Colored log levels (info, success, warning, error)
 * - Auto-scroll to latest log
 * - Terminal-like appearance
 * - Timestamps
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { DeploymentLog } from '../lib/mockData';

// ============================================
// Types
// ============================================

interface DeploymentLogsProps {
    /** Array of log entries to display */
    logs: DeploymentLog[];
    /** Whether deployment is in progress */
    isDeploying?: boolean;
}

// ============================================
// Log Level Colors
// ============================================

const logLevelColors: Record<string, string> = {
    info: 'text-blue-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    error: 'text-red-400',
};

const logLevelBadge: Record<string, string> = {
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    success: 'bg-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// ============================================
// Helpers
// ============================================

/**
 * Render message with clickable URLs
 */
const renderMessageWithLinks = (message: string, colorClass: string) => {
    // Regex to find URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.split(urlRegex);

    return parts.map((part, index) => {
        if (urlRegex.test(part)) {
            // Reset regex lastIndex since test() advances it
            urlRegex.lastIndex = 0;
            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300 underline underline-offset-2"
                >
                    {part}
                </a>
            );
        }
        return <span key={index}>{part}</span>;
    });
};

// ============================================
// Component
// ============================================

/**
 * DeploymentLogs displays terminal-style deployment output
 */
export default function DeploymentLogs({ logs, isDeploying = false }: DeploymentLogsProps) {
    // Ref for auto-scrolling within the container
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new logs arrive (scroll container only, not page)
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [logs]);

    if (logs.length === 0 && !isDeploying) {
        // Empty state
        return (
            <div className="glass-panel p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-glass-medium flex items-center justify-center">
                    <svg className="w-6 h-6 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-textMuted text-sm">
                    No deployment logs yet. Start a deployment to see logs here.
                </p>
            </div>
        );
    }

    return (
        <div className="glass-panel overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                    {/* Terminal icon */}
                    <svg className="w-4 h-4 text-textMuted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-textSecondary">
                        Deployment Logs
                    </span>
                </div>

                {/* Status indicator */}
                {isDeploying && (
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-400" />
                        <span className="text-xs text-yellow-400">Deploying...</span>
                    </div>
                )}
            </div>

            {/* Logs container */}
            <div ref={containerRef} className="p-4 max-h-80 overflow-y-auto font-mono text-sm hide-scrollbar bg-black/30">
                {logs.filter(Boolean).map((log, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-3 py-1.5"
                    >
                        {/* Timestamp */}
                        <span className="text-textMuted text-xs flex-shrink-0 w-16">
                            {log.timestamp}
                        </span>

                        {/* Level badge */}
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium uppercase flex-shrink-0 border ${logLevelBadge[log.level]}`}>
                            {log.level.slice(0, 4)}
                        </span>

                        {/* Message with clickable links */}
                        <span className={logLevelColors[log.level]}>
                            {renderMessageWithLinks(log.message, logLevelColors[log.level])}
                        </span>
                    </div>
                ))}

                {/* Cursor when deploying */}
                {isDeploying && (
                    <div className="flex items-center gap-3 py-1.5">
                        <span className="text-textMuted text-xs w-16">--:--:--</span>
                        <span className="w-2 h-4 bg-textPrimary animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    );
}
