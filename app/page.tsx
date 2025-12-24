/**
 * Landing Page - One Deploy
 * 
 * The main entry point of the application featuring:
 * - Immersive hero section with ambient orbs
 * - Floating navigation pill
 * - Grid of deployed project cards
 * - Dark, glassmorphic aesthetic
 * 
 * This page showcases the platform's capabilities and
 * encourages users to start deploying their projects.
 */

import React from 'react';
import Link from 'next/link';
import Hero from './components/Hero';
import Navigation from './components/Navigation';
import Card from './components/Card';
import AmbientOrb from './components/AmbientOrb';
import { mockDeployments } from './lib/mockData';

// ============================================
// Page Component
// ============================================

/**
 * Home page with hero section and deployment showcase
 */
export default function HomePage() {
    return (
        <div className="relative min-h-screen pb-32 md:pb-0">
            {/* ================================================
          Navigation
          ================================================ */}
            <Navigation />

            {/* ================================================
          Hero Section
          ================================================ */}
            <Hero />

            {/* ================================================
          Deployments Showcase Section
          ================================================ */}
            {/* ================================================
          Deployments Showcase Section - HIDDEN UNTIL PHASE 3
          ================================================ */}
            {/* 
            <section
                className="relative py-20 px-4 sm:px-6 lg:px-8"
                aria-labelledby="deployments-heading"
            >
               ... (hidden)
            </section> 
            */}

            {/* ================================================
          Features Section
          ================================================ */}
            <section
                className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5"
                aria-labelledby="features-heading"
            >
                <div className="max-w-7xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <h2
                            id="features-heading"
                            className="text-3xl md:text-4xl font-bold text-textPrimary mb-4"
                        >
                            Why One Deploy?
                        </h2>
                        <p className="text-lg text-textMuted max-w-2xl mx-auto">
                            Everything you need to deploy frontend sites, nothing you don&apos;t.
                        </p>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1: Git Integration */}
                        <div className="glass-panel-hover p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-textPrimary mb-2">
                                Git-Connected
                            </h3>
                            <p className="text-textMuted">
                                Connect your GitHub repositories and deploy with every push.
                                Zero configuration required.
                            </p>
                        </div>

                        {/* Feature 2: Global CDN */}
                        <div className="glass-panel-hover p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-textPrimary mb-2">
                                Edge Network
                            </h3>
                            <p className="text-textMuted">
                                Your sites are deployed to Cloudflare&apos;s global edge network.
                                Lightning fast everywhere.
                            </p>
                        </div>

                        {/* Feature 3: Automatic SSL */}
                        <div className="glass-panel-hover p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-textPrimary mb-2">
                                Automatic SSL
                            </h3>
                            <p className="text-textMuted">
                                Every deployment gets automatic HTTPS.
                                No certificate management needed.
                            </p>
                        </div>

                        {/* Feature 4: Custom Domains */}
                        <div className="glass-panel-hover p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-textPrimary mb-2">
                                Custom Domains
                            </h3>
                            <p className="text-textMuted">
                                Bring your own domain or use our free *.onedeploy.dev subdomains.
                            </p>
                        </div>

                        {/* Feature 5: Instant Rollbacks */}
                        <div className="glass-panel-hover p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-textPrimary mb-2">
                                Instant Rollbacks
                            </h3>
                            <p className="text-textMuted">
                                Something went wrong? Roll back to any previous deployment instantly.
                            </p>
                        </div>

                        {/* Feature 6: Preview Deployments */}
                        <div className="glass-panel-hover p-6">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-textPrimary mb-2">
                                PR Previews
                            </h3>
                            <p className="text-textMuted">
                                Every pull request gets its own preview URL.
                                Review changes before merging.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================
          Footer
          ================================================ */}
            <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo and tagline */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                <span className="text-black font-bold text-sm">O</span>
                            </div>
                            <div>
                                <span className="font-semibold text-textPrimary">One Deploy</span>
                                <p className="text-xs text-textMuted">Deploy in seconds</p>
                            </div>
                        </div>

                        {/* Links */}
                        <nav className="flex items-center gap-6 text-sm text-textMuted">
                            <Link href="/docs" className="hover:text-textPrimary transition-colors">Docs</Link>
                            <Link href="/pricing" className="hover:text-textPrimary transition-colors">Pricing</Link>
                            <Link href="/blog" className="hover:text-textPrimary transition-colors">Blog</Link>
                            <Link href="/support" className="hover:text-textPrimary transition-colors">Support</Link>
                        </nav>

                        {/* Copyright */}
                        <p className="text-xs text-textMuted">
                            © 2024 One Deploy. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
