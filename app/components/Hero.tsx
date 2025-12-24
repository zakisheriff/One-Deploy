/**
 * Hero Component
 * 
 * Immersive hero section with:
 * - Massive centered headline with glow effect
 * - Ambient floating orbs in background
 * - Subtle keyword highlights
 * - Call-to-action buttons
 * 
 * This is the main visual impact area of the landing page
 */

'use client';

import React from 'react';
import Link from 'next/link';
import AmbientOrb, { orbPresets } from './AmbientOrb';

// ============================================
// Component
// ============================================

/**
 * Hero section with atmospheric design and call-to-action
 */
export default function Hero() {
    return (
        <section
            className="relative min-h-screen flex flex-col items-center pt-20 pb-32 md:pt-40 md:pb-0 overflow-hidden px-4"
            aria-label="Hero section"
        >
            {/* ================================================
          Background Ambient Orbs
          ================================================ */}
            <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                aria-hidden="true"
            >
                {/* Top left purple orb */}
                <AmbientOrb {...orbPresets.heroTopLeft} />

                {/* Top right blue orb */}
                <AmbientOrb {...orbPresets.heroTopRight} />

                {/* Center left pink orb */}
                <AmbientOrb {...orbPresets.heroCenterLeft} />

                {/* Bottom right cyan orb */}
                <AmbientOrb {...orbPresets.heroBottomRight} />

                {/* Center mixed gradient orb - subtle and large */}
                <AmbientOrb {...orbPresets.heroCenter} />

                {/* Additional smaller accent orbs */}
                <AmbientOrb
                    color="purple"
                    size={200}
                    position={{ top: '30%', left: '70%' }}
                    delay={3000}
                    opacity={0.3}
                    animationClass="animate-drift-3"
                />
                <AmbientOrb
                    color="cyan"
                    size={150}
                    position={{ top: '80%', left: '20%' }}
                    delay={1500}
                    opacity={0.35}
                    animationClass="animate-drift-2"
                />
            </div>

            {/* ================================================
          Hero Content
          ================================================ */}
            <div className="relative z-10 text-center max-w-5xl mx-auto">
                {/* Badge / Tag - visible on all screens */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-glass-light backdrop-blur-glass border border-white/10 mb-6 md:mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    <span className="text-textSecondary text-xs font-medium">
                        Powered by Cloudflare Edge
                    </span>
                </div>

                {/* Main Headline */}
                <h1>
                    {/* Line 1: "One Deploy" - bigger as requested */}
                    <span className="block text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-2 md:mb-4 glow-text">
                        One Deploy
                    </span>
                    {/* Line 2: Descriptive tagline */}
                    <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl font-medium text-textSecondary">
                        Deploy in{' '}
                        <span className="text-white font-bold">Seconds</span>
                    </span>
                </h1>

                {/* Subheadline / Description */}
                <p className="mt-4 md:mt-8 text-base md:text-xl text-textMuted max-w-xl md:max-w-2xl mx-auto leading-relaxed px-4">
                    Push your code. We handle the rest.{' '}
                    <span className="text-textSecondary">
                        Automatic builds, global CDN, instant SSL, and custom domains.
                    </span>
                </p>

                {/* Keywords / Features Row */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-6 md:mt-8 px-2">
                    {['GitHub Integration', 'Zero Config', 'Edge Deployed', 'SSL Included'].map((keyword, index) => (
                        <span
                            key={keyword}
                            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-glass-light/50 backdrop-blur-sm border border-white/5 text-textSecondary text-xs md:text-sm font-medium subtle-glow"
                            style={{ animationDelay: `${(index + 3) * 100}ms` }}
                        >
                            {keyword}
                        </span>
                    ))}
                </div>

                {/* CTA Buttons - Row on mobile, smaller buttons */}
                <div className="flex flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-12 px-2">
                    {/* Primary CTA */}
                    <Link
                        href="/dashboard"
                        className="accent-button w-auto text-sm md:text-lg px-5 py-2.5 md:px-8 md:py-4 flex items-center justify-center gap-2 md:gap-3 group"
                    >
                        <span>Start Deploying</span>
                        <svg
                            className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>

                    {/* Secondary CTA */}
                    <Link
                        href="/docs"
                        className="glass-button w-auto text-sm md:text-lg px-5 py-2.5 md:px-8 md:py-4 flex items-center justify-center gap-2 md:gap-3"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Read Docs</span>
                    </Link>
                </div>

                {/* Trust indicator */}
                <p className="mt-6 md:mt-12 text-textMuted text-sm">
                    Trusted by developers worldwide • Deploys in under 30 seconds
                </p>
            </div>

        </section>
    );
}
