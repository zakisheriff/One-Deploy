/**
 * Mock Data for One Deploy MVP
 * 
 * This file contains all mocked data for the MVP:
 * - Simulated GitHub user
 * - Mock repositories
 * - Deployment logs
 * - OAuth state
 * 
 * In production, these would be replaced with actual API calls
 */

// ============================================
// Types
// ============================================

/** GitHub User type */
export interface GitHubUser {
    id: string;
    login: string;
    name: string;
    avatar_url: string;
    email: string;
}

/** Repository type */
export interface Repository {
    id: string;
    name: string;
    full_name: string;
    description: string;
    html_url: string;
    language: string;
    updated_at: string;
    default_branch: string;
    private: boolean;
}

/** Deployment status enum */
export type DeploymentStatus = 'pending' | 'building' | 'deploying' | 'success' | 'failed';

/** Deployment type */
export interface Deployment {
    id: string;
    repo_name: string;
    status: DeploymentStatus;
    url: string;
    created_at: string;
    build_time: number; // in seconds
    commit_sha: string;
    commit_message: string;
}

/** Deployment log entry */
export interface DeploymentLog {
    timestamp: string;
    level: 'info' | 'success' | 'warning' | 'error';
    message: string;
}

// ============================================
// Mock User Data
// ============================================

/**
 * Simulated authenticated GitHub user
 * In production, this would come from OAuth flow
 */
export const mockUser: GitHubUser = {
    id: 'user_123456',
    login: 'atomdev',
    name: 'Atom Developer',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=atomdev',
    email: 'dev@theoneatom.com',
};

// ============================================
// Mock Repositories
// ============================================

/**
 * Simulated list of user's GitHub repositories
 * These represent frontend projects that can be deployed
 */
export const mockRepositories: Repository[] = [
    {
        id: 'repo_001',
        name: 'portfolio-site',
        full_name: 'atomdev/portfolio-site',
        description: 'My personal portfolio website built with Next.js and Tailwind CSS',
        html_url: 'https://github.com/atomdev/portfolio-site',
        language: 'TypeScript',
        updated_at: '2024-12-24T10:30:00Z',
        default_branch: 'main',
        private: false,
    },
    {
        id: 'repo_002',
        name: 'landing-page-template',
        full_name: 'atomdev/landing-page-template',
        description: 'Beautiful landing page template with dark theme and animations',
        html_url: 'https://github.com/atomdev/landing-page-template',
        language: 'TypeScript',
        updated_at: '2024-12-23T15:45:00Z',
        default_branch: 'main',
        private: false,
    },
    {
        id: 'repo_003',
        name: 'blog-starter',
        full_name: 'atomdev/blog-starter',
        description: 'Minimal blog starter with MDX support',
        html_url: 'https://github.com/atomdev/blog-starter',
        language: 'JavaScript',
        updated_at: '2024-12-22T09:15:00Z',
        default_branch: 'main',
        private: false,
    },
    {
        id: 'repo_004',
        name: 'saas-dashboard',
        full_name: 'atomdev/saas-dashboard',
        description: 'SaaS dashboard UI kit with charts and analytics',
        html_url: 'https://github.com/atomdev/saas-dashboard',
        language: 'TypeScript',
        updated_at: '2024-12-21T18:20:00Z',
        default_branch: 'main',
        private: true,
    },
    {
        id: 'repo_005',
        name: 'docs-theme',
        full_name: 'atomdev/docs-theme',
        description: 'Documentation theme with search and dark mode',
        html_url: 'https://github.com/atomdev/docs-theme',
        language: 'TypeScript',
        updated_at: '2024-12-20T12:00:00Z',
        default_branch: 'main',
        private: false,
    },
];

// ============================================
// Mock Deployments
// ============================================

/**
 * Simulated deployments
 * Shows both successful and various status deployments
 */
export const mockDeployments: Deployment[] = [
    {
        id: 'deploy_001',
        repo_name: 'portfolio-site',
        status: 'success',
        url: 'https://portfolio-site.onedeploy.dev',
        created_at: '2024-12-24T10:35:00Z',
        build_time: 45,
        commit_sha: 'a1b2c3d',
        commit_message: 'Update hero section',
    },
    {
        id: 'deploy_002',
        repo_name: 'landing-page-template',
        status: 'success',
        url: 'https://landing-page-template.onedeploy.dev',
        created_at: '2024-12-23T16:00:00Z',
        build_time: 38,
        commit_sha: 'e4f5g6h',
        commit_message: 'Add new testimonials',
    },
    {
        id: 'deploy_003',
        repo_name: 'blog-starter',
        status: 'building',
        url: 'https://blog-starter.onedeploy.dev',
        created_at: '2024-12-24T11:00:00Z',
        build_time: 0,
        commit_sha: 'i7j8k9l',
        commit_message: 'Add RSS feed',
    },
    {
        id: 'deploy_004',
        repo_name: 'saas-dashboard',
        status: 'failed',
        url: '',
        created_at: '2024-12-21T18:30:00Z',
        build_time: 12,
        commit_sha: 'm0n1o2p',
        commit_message: 'Fix chart rendering',
    },
];

// ============================================
// Mock Deployment Logs
// ============================================

/**
 * Simulated build and deployment logs
 * Shows a realistic deployment workflow
 */
export const mockDeploymentLogs: DeploymentLog[] = [];

// ============================================
// Mock OAuth State
// ============================================

/**
 * Simulated OAuth state
 * Used to track authentication flow
 */
export const mockOAuthState = {
    isAuthenticated: true,
    accessToken: 'mock_access_token_xyz',
    expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
};

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a deployment URL from repository name
 * @param repoName - Name of the repository
 * @returns Public URL for the deployment
 */
export const generateDeploymentUrl = (repoName: string): string => {
    const sanitized = repoName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `https://${sanitized}.onedeploy.dev`;
};

/**
 * Format timestamp to relative time
 * @param isoString - ISO timestamp string
 * @returns Relative time string (e.g., "2 hours ago")
 */
export const formatRelativeTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
};

/**
 * Get status color class based on deployment status
 * @param status - Deployment status
 * @returns Tailwind class for status color
 */
export const getStatusColor = (status: DeploymentStatus): string => {
    const colors: Record<DeploymentStatus, string> = {
        pending: 'status-pending',
        building: 'status-pending',
        deploying: 'status-pending',
        success: 'status-success',
        failed: 'status-error',
    };
    return colors[status];
};
