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
    { href: '/dashboard', label: 'Deploy' },
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
                className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50"
                aria-label="Main navigation"
            >
                <div className="nav-pill">
                    {/* Logo / Brand */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 mr-4 group"
                    >
                        {/* Logo icon - stylized "O" for One Deploy */}
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                            <span className="text-black font-bold text-sm">O</span>
                        </div>
                        <span className="text-textPrimary font-semibold hidden lg:block">
                            One Deploy
                        </span>
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
                    </ul>

                    {/* CTA Button */}
                    <Link
                        href="/dashboard"
                        className="ml-6 accent-button text-sm py-2 px-4"
                    >
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* ================================================
          Mobile Navigation - Bottom Center
          ================================================ */}
            <nav
                className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
                aria-label="Mobile navigation"
            >
                {/* Outer container with vignette effect */}
                <div className="relative">
                    {/* Vignette edges - soft fade effect */}
                    <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.6) 100%)',
                            transform: 'scale(1.3)',
                        }}
                        aria-hidden="true"
                    />

                    {/* Navigation pill */}
                    <div className="glass-panel px-6 py-4 rounded-full flex items-center gap-6 relative">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive(link.href)
                                    ? 'text-textPrimary scale-110'
                                    : 'text-textMuted'
                                    }`}
                            >
                                {/* Proper SVG icons */}
                                <span className="w-5 h-5">
                                    {link.label === 'Home' && (
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    )}
                                    {link.label === 'Deploy' && (
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    )}
                                    {link.label === 'Docs' && (
                                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    )}
                                </span>
                                {/* Label */}
                                <span className="text-xs font-medium">
                                    {link.label}
                                </span>
                                {/* Active indicator dot */}
                                {isActive(link.href) && (
                                    <span
                                        className="absolute -bottom-1 w-1 h-1 rounded-full bg-white"
                                    />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
        </>
    );
}
