/**
 * DeployButton Component
 * 
 * Trigger button for deploying a repository.
 * Features:
 * - Loading state with spinner
 * - Success/error states
 * - Glow animation on hover
 * - Micro-interactions (scale on click)
 * 
 * Mocked for MVP - simulates deployment trigger
 */

'use client';

import React, { useState } from 'react';

// ============================================
// Types
// ============================================

interface DeployButtonProps {
    /** Repository name to deploy */
    repoName: string;
    /** Optional callback when deployment starts */
    onDeploy?: (repoName: string) => void;
    /** Button size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Full width button */
    fullWidth?: boolean;
}

type DeployState = 'idle' | 'deploying' | 'success' | 'error';

// ============================================
// Component
// ============================================

/**
 * DeployButton triggers a deployment for a repository
 * Simulates the deployment process for MVP
 */
export default function DeployButton({
    repoName,
    onDeploy,
    size = 'md',
    fullWidth = false,
}: DeployButtonProps) {
    // Track deployment state
    const [deployState, setDeployState] = useState<DeployState>('idle');

    // Size variants
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-5 py-2.5 text-base gap-2',
        lg: 'px-6 py-3 text-lg gap-2.5',
    };

    /**
     * Handle deploy button click
     * Simulates deployment process with state transitions
     */
    const handleDeploy = async () => {
        // Don't allow multiple clicks during deployment
        if (deployState === 'deploying') return;

        // Start deployment
        setDeployState('deploying');
        onDeploy?.(repoName);

        // Simulate deployment process (3 seconds)
        try {
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                setDeployState('success');
            } else {
                setDeployState('error');
            }

            // Reset to idle after 2 seconds
            setTimeout(() => setDeployState('idle'), 2000);
        } catch {
            setDeployState('error');
            setTimeout(() => setDeployState('idle'), 2000);
        }
    };

    // Button content based on state
    const renderContent = () => {
        switch (deployState) {
            case 'deploying':
                return (
                    <>
                        {/* Spinner */}
                        <svg
                            className="animate-spin"
                            style={{ width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16, height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16 }}
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Deploying...</span>
                    </>
                );

            case 'success':
                return (
                    <>
                        {/* Checkmark */}
                        <svg
                            style={{ width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16, height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16 }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Deployed!</span>
                    </>
                );

            case 'error':
                return (
                    <>
                        {/* X icon */}
                        <svg
                            style={{ width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16, height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16 }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Failed</span>
                    </>
                );

            default:
                return (
                    <>
                        {/* Rocket icon */}
                        <svg
                            style={{ width: size === 'sm' ? 14 : size === 'lg' ? 20 : 16, height: size === 'sm' ? 14 : size === 'lg' ? 20 : 16 }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Deploy Now</span>
                    </>
                );
        }
    };

    // Dynamic button styles based on state
    const getButtonClasses = () => {
        const baseClasses = `
      inline-flex items-center justify-center font-semibold rounded-xl
      transition-all duration-300 ease-out
      ${sizeClasses[size]}
      ${fullWidth ? 'w-full' : ''}
    `;

        switch (deployState) {
            case 'deploying':
                return `${baseClasses} bg-white/80 text-black opacity-80 cursor-wait`;
            case 'success':
                return `${baseClasses} bg-white text-black`;
            case 'error':
                return `${baseClasses} bg-gray-500 text-white`;
            default:
                return `${baseClasses} accent-button hover:scale-[1.02] active:scale-[0.98]`;
        }
    };

    return (
        <button
            onClick={handleDeploy}
            disabled={deployState === 'deploying'}
            className={getButtonClasses()}
            aria-label={`Deploy ${repoName}`}
        >
            {renderContent()}
        </button>
    );
}
