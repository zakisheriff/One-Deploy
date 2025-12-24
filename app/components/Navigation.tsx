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
                                {/* Icon placeholder - using emoji for MVP */}
                                <span className="text-lg">
                                    {link.label === 'Home' && '🏠'}
                                    {link.label === 'Deploy' && '🚀'}
                                    {link.label === 'Docs' && '📄'}
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
