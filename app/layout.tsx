/**
 * Root Layout for One Deploy
 * 
 * Sets up:
 * - Global styles import
 * - Dark theme meta tags
 * - SEO metadata
 * - Font configuration
 */

import type { Metadata, Viewport } from 'next';
import './styles/globals.css';
import { Providers } from './components/Providers';

// ============================================
// Metadata Configuration
// ============================================

export const metadata: Metadata = {
    title: 'One Deploy - Deploy Frontend Sites Instantly',
    description: 'One Deploy is a mini Vercel platform. Deploy frontend-only websites from Git repositories instantly with automatic SSL and global CDN.',
    keywords: ['deploy', 'frontend', 'hosting', 'vercel', 'cloudflare', 'static sites', 'github'],
    authors: [{ name: 'The One Atom' }],
    openGraph: {
        title: 'One Deploy - Deploy Frontend Sites Instantly',
        description: 'Deploy frontend-only websites from Git repositories instantly with automatic SSL and global CDN.',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'One Deploy - Deploy Frontend Sites Instantly',
        description: 'Deploy frontend-only websites from Git repositories instantly.',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// ============================================
// Viewport Configuration
// ============================================

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#000000', // Pure black for dark theme
};

// ============================================
// Root Layout Component
// ============================================

/**
 * RootLayout wraps all pages with consistent structure
 * - Sets HTML lang attribute
 * - Applies dark theme class
 * - Provides consistent body styling
 */
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                {/* Preconnect to external font services */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" sizes="any" />
            </head>
            <body className="bg-bgBlack text-textPrimary antialiased min-h-screen overflow-x-hidden">
                {/* Main content wrapper */}
                <main className="relative min-h-screen">
                    <Providers>
                        {children}
                    </Providers>
                </main>
            </body>
        </html>
    );
}
