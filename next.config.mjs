/**
 * Next.js Configuration for One Deploy
 * 
 * Configured for:
 * - Static export support (for Cloudflare Pages / S3)
 * - Image optimization disabled for static export
 * - Strict mode enabled for better React practices
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development practices
    reactStrictMode: true,

    // Configure for static export (deployable to Cloudflare Pages, S3, etc.)
    output: 'export',

    // Disable image optimization for static export
    // (Cloudflare Images or external CDN can be used instead)
    images: {
        unoptimized: true,
    },

    // Trailing slashes for better static hosting compatibility
    trailingSlash: true,
};

export default nextConfig;
