'use client';

/**
 * Global Loading Component
 * 
 * Shows a beautiful splash screen with the One Deploy branding
 * while pages are loading.
 */

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-bgBlack flex flex-col items-center justify-center z-[9999]">
            {/* Animated Logo */}
            <div className="relative">
                {/* Glow ring */}
                <div className="absolute inset-0 w-20 h-20 rounded-full bg-white/20 blur-xl opacity-50 animate-pulse" />

                {/* Logo circle */}
                <div className="relative w-20 h-20 rounded-full bg-white flex items-center justify-center animate-pulse">
                    <span className="text-black font-black text-3xl">O</span>
                </div>
            </div>

            {/* Brand name */}
            <h1 className="mt-6 text-2xl font-bold text-white">
                One Deploy
            </h1>

            {/* Loading indicator */}
            <div className="mt-4 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>

            {/* Subtle tagline */}
            <p className="mt-4 text-sm text-textMuted">
                Deploy in Seconds
            </p>
        </div>
    );
}
