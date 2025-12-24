/**
 * Navigation Component
 * 
 * Floating pill-style navigation bar that adapts between desktop and mobile:
 * - Desktop: Top-center floating pill with horizontal links
 * - Mobile: Bottom-center floating pill with vignette edges
 * 
 * Features:
 * - Glassmorphic styling
 * - Active link underline animation
 * - Responsive layout
 * - Smooth hover transitions
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

// ============================================
// Types
// ============================================

interface NavLink {
    href: string;
    label: string;
}

// ============================================
// Navigation Links Configuration
// ============================================

const navLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/docs', label: 'Docs' },
];

// ============================================
// Component
// ============================================

/**
 * Navigation displays a floating pill-style nav bar
 * Automatically highlights the active route
 */
export default function Navigation() {
    // Get current pathname for active link detection
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mounted, setMounted] = React.useState(false);
    const [profileOpen, setProfileOpen] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.profile-dropdown')) {
                setProfileOpen(false);
            }
        };
        if (profileOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [profileOpen]);

    /**
     * Check if a link is currently active
     * @param href - Link href to check
     * @returns boolean - true if link is active
     */
    const isActive = (href: string): boolean => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    const user = session?.user;

    return (
        <>
            {/* ================================================
          Desktop Navigation - Top Center
          ================================================ */}
            <nav
                className="hidden md:flex fixed top-6 left-12 right-12 justify-center z-50"
                aria-label="Main navigation"
            >
                <div className="nav-pill flex items-center">
                    {/* Left spacer for balance when profile is shown */}
                    {mounted && session && user && (
                        <div className="w-9 opacity-0 pointer-events-none" aria-hidden="true" />
                    )}

                    {/* Navigation Links - always centered */}
                    <ul className="flex items-center gap-6 mx-6">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`nav-link ${isActive(link.href) ? 'active text-textPrimary' : 'text-textSecondary'}`}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Profile Dropdown (Only if logged in AND mounted) */}
                    {mounted && session && user && (
                        <div className="relative ml-6 profile-dropdown">
                            {/* Avatar Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setProfileOpen(!profileOpen);
                                }}
                                className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors"
                            >
                                {user.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={user.image}
                                        alt={user.name || 'Profile'}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white flex items-center justify-center text-black font-bold text-sm">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {profileOpen && (
                                <div className="absolute right-0 mt-3 w-56 glass-panel p-2 rounded-xl shadow-2xl">
                                    {/* User Info */}
                                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                                        <p className="text-sm font-semibold text-textPrimary truncate">{user.name}</p>
                                        <p className="text-xs text-textMuted truncate">{user.email}</p>
                                    </div>

                                    {/* GitHub Profile Link */}
                                    <a
                                        href={`https://github.com/${user.name?.replace(/\s+/g, '') || ''}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-textSecondary hover:text-textPrimary"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        View GitHub Profile
                                    </a>

                                    {/* Log Out */}
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-sm text-red-400"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* ================================================
          Mobile Navigation - Bottom Center
          ================================================ */}
            <nav
                className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                aria-label="Mobile navigation"
            >
                {/* Outer container */}
                <div className="relative">
                    {/* Navigation pill */}
                    <div className="glass-panel px-6 py-4 rounded-full flex items-center gap-8 relative">
                        {/* Home icon for mobile */}
                        <Link
                            href="/"
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname === '/'
                                ? 'text-textPrimary'
                                : 'text-textMuted'
                                }`}
                        >
                            <span className="w-5 h-5">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </span>
                            <span className="text-xs font-medium">Home</span>
                        </Link>

                        {/* Dashboard */}
                        <Link
                            href="/dashboard/"
                            className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname.startsWith('/dashboard') || pathname.startsWith('/project')
                                ? 'text-textPrimary'
                                : 'text-textMuted'
                                }`}
                        >
                            <span className="w-5 h-5">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </span>
                            <span className="text-xs font-medium">Dashboard</span>
                        </Link>

                        {/* Docs or Logout for Mobile? 
                            Space is limited. Let's keep Docs and maybe add Logout as a 4th icon or replace Docs?
                            Actually, 4 icons fits fine.
                        */}

                        {mounted && session ? (
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex flex-col items-center gap-1 transition-all duration-300 text-textMuted hover:text-red-400"
                            >
                                <span className="w-5 h-5">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </span>
                                <span className="text-xs font-medium">Log Out</span>
                            </button>
                        ) : (
                            <Link
                                href="/docs/"
                                className={`flex flex-col items-center gap-1 transition-all duration-300 ${pathname.startsWith('/docs')
                                    ? 'text-textPrimary'
                                    : 'text-textMuted'
                                    }`}
                            >
                                <span className="w-5 h-5">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </span>
                                <span className="text-xs font-medium">Docs</span>
                            </Link>
                        )}

                    </div>
                </div>
            </nav>
        </>
    );
}
