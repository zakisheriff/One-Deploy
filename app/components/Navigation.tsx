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

    React.useEffect(() => {
        setMounted(true);
    }, []);

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

    return (
        <>
            {/* ================================================
          Desktop Navigation - Top Center
          ================================================ */}
            <nav
                className="hidden md:flex fixed top-6 left-12 right-12 justify-center z-50"
                aria-label="Main navigation"
            >
                <div className="nav-pill">
                    {/* Logo / Brand - icon only */}
                    <Link
                        href="/"
                        className="flex items-center mr-4 group"
                    >
                        {/* Logo icon - stylized "O" for One Deploy */}
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <span className="text-black font-extrabold text-base">O</span>
                        </div>
                    </Link>

                    {/* Divider */}
                    <div className="w-px h-6 bg-white/20 mr-4" />

                    {/* Navigation Links */}
                    <ul className="flex items-center gap-6">
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

                        {/* Logout Link (Only if logged in AND mounted) */}
                        {mounted && session && (
                            <li>
                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="nav-link text-textSecondary hover:text-red-400 transition-colors"
                                >
                                    Log Out
                                </button>
                            </li>
                        )}
                    </ul>
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
