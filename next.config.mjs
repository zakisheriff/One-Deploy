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

    // Trailing slashes for better compatibility
    trailingSlash: true,
};

export default nextConfig;
