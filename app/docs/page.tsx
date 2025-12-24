/**
 * Docs Page - One Deploy
 * 
 * Documentation page with getting started guide,
 * feature explanations, and API reference.
 * 
 * For MVP, this is a placeholder with basic structure.
 */

import React from 'react';
import Navigation from '../components/Navigation';
import AmbientOrb from '../components/AmbientOrb';

// ============================================
// Page Component
// ============================================

export default function DocsPage() {
    return (
        <div className="relative min-h-screen pb-24 md:pb-8">
            {/* Navigation */}
            <Navigation />

            {/* Background orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <AmbientOrb
                    color="purple"
                    size={350}
                    position={{ top: '15%', left: '8%' }}
                    opacity={0.2}
                />
                <AmbientOrb
                    color="blue"
                    size={300}
                    position={{ top: '70%', left: '85%' }}
                    opacity={0.15}
                />
            </div>

            {/* Main content */}
            <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <header className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
                            Documentation
                        </h1>
                        <p className="text-xl text-textMuted">
                            Everything you need to deploy your frontend projects with One Deploy.
                        </p>
                    </header>

                    {/* Quick start section */}
                    <section className="glass-panel p-8 mb-8">
                        <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center text-sm">
                                1
                            </span>
                            Quick Start
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-textSecondary mb-2">
                                    Connect Your Repository
                                </h3>
                                <p className="text-textMuted mb-4">
                                    Click the &quot;Connect GitHub&quot; button on your dashboard to authorize One Deploy
                                    to access your repositories.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-textSecondary mb-2">
                                    Select a Project
                                </h3>
                                <p className="text-textMuted mb-4">
                                    Choose the repository you want to deploy. We support any static frontend
                                    project including Next.js, React, Vue, and plain HTML/CSS.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-textSecondary mb-2">
                                    Deploy
                                </h3>
                                <p className="text-textMuted">
                                    Click &quot;Deploy Now&quot; and watch the magic happen. Your site will be live
                                    at <code className="px-2 py-1 rounded bg-glass-light text-accent-purple">your-repo.onedeploy.dev</code> in seconds.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Configuration section */}
                    <section className="glass-panel p-8 mb-8">
                        <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-sm">
                                2
                            </span>
                            Configuration
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-textSecondary mb-2">
                                    Build Settings
                                </h3>
                                <p className="text-textMuted mb-4">
                                    One Deploy automatically detects your project type and configures build settings.
                                    You can override these in your project settings.
                                </p>

                                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-textSecondary overflow-x-auto">
                                    <pre>{`{
  "buildCommand": "npm run build",
  "outputDirectory": "out",
  "nodeVersion": "20"
}`}</pre>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-textSecondary mb-2">
                                    Environment Variables
                                </h3>
                                <p className="text-textMuted">
                                    Add environment variables in your project settings. They&apos;ll be available
                                    during the build process.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Auto-deploy section */}
                    <section className="glass-panel p-8 mb-8">
                        <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center text-sm">
                                3
                            </span>
                            Auto-Deploy on Push
                        </h2>

                        <p className="text-textMuted mb-6">
                            Once you&apos;ve deployed a project, One Deploy automatically redeploys
                            whenever you push to your main branch. No configuration needed!
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-textSecondary">Push to GitHub</h3>
                                    <p className="text-textMuted text-sm">Commit your changes and push to main</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-textSecondary">Automatic Build</h3>
                                    <p className="text-textMuted text-sm">We detect the push and trigger a new build</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-textSecondary">Live in Seconds</h3>
                                    <p className="text-textMuted text-sm">Your site is updated with the latest changes</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Custom domains section */}
                    <section className="glass-panel p-8">
                        <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-sm">
                                4
                            </span>
                            Custom Domains
                        </h2>

                        <p className="text-textMuted mb-4">
                            Add a custom domain to your project by adding a CNAME record pointing to your
                            One Deploy URL:
                        </p>

                        <div className="bg-black/30 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-textMuted text-left">
                                        <th className="pb-2">Type</th>
                                        <th className="pb-2">Name</th>
                                        <th className="pb-2">Value</th>
                                    </tr>
                                </thead>
                                <tbody className="text-textSecondary">
                                    <tr>
                                        <td className="py-1">CNAME</td>
                                        <td className="py-1">www</td>
                                        <td className="py-1 text-accent-purple">your-project.onedeploy.dev</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <p className="text-textMuted mt-4">
                            SSL certificates are automatically provisioned for all custom domains.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
