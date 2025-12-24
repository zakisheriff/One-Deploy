/**
 * AmbientOrb Component
 * 
 * Creates floating, glowing orbs for ambient background effects.
 * Uses CSS animations for smooth drifting motion.
 * 
 * Props:
 * - color: Gradient color scheme (purple, blue, pink, cyan)
 * - size: Size of the orb in pixels
 * - position: Initial position (top, left percentages)
 * - delay: Animation delay for staggered effects
 * - opacity: Orb opacity (0-1)
 */

'use client';

import React from 'react';

// ============================================
// Types
// ============================================

interface AmbientOrbProps {
    /** Color scheme for the orb gradient */
    color?: 'purple' | 'blue' | 'pink' | 'cyan' | 'mixed';
    /** Size of the orb in pixels */
    size?: number;
    /** Position as percentage from top and left */
    position?: { top: string; left: string };
    /** Animation delay in milliseconds */
    delay?: number;
    /** Opacity of the orb (0-1) */
    opacity?: number;
    /** Custom animation class */
    animationClass?: string;
    /** Z-index for layering */
    zIndex?: number;
}

// ============================================
// Color Gradients
// ============================================

const colorGradients: Record<string, string> = {
    purple: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)',
    blue: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 70%)',
    pink: 'radial-gradient(circle, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 70%)',
    cyan: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
    mixed: 'radial-gradient(circle, rgba(255, 255, 255, 0.06) 0%, rgba(200, 200, 200, 0.04) 40%, rgba(255, 255, 255, 0) 70%)',
};

// ============================================
// Component
// ============================================

/**
 * AmbientOrb creates a glowing, floating orb for atmospheric effects
 * 
 * @example
 * <AmbientOrb 
 *   color="purple" 
 *   size={400} 
 *   position={{ top: '20%', left: '10%' }} 
 *   delay={0}
 * />
 */
export default function AmbientOrb({
    color = 'purple',
    size = 300,
    position = { top: '50%', left: '50%' },
    delay = 0,
    opacity = 1,
    animationClass = '',
    zIndex = 0,
}: AmbientOrbProps) {
    // Get the gradient for the selected color
    const gradient = colorGradients[color] || colorGradients.purple;

    return (
        <div
            className="absolute pointer-events-none"
            style={{
                // Positioning
                top: position.top,
                left: position.left,
                // Transform to center the orb on its position
                transform: 'translate(-50%, -50%)',
                // Size
                width: `${size}px`,
                height: `${size}px`,
                // Appearance
                background: gradient,
                borderRadius: '50%',
                opacity: opacity,
                // Blur for soft glow effect
                filter: 'blur(40px)',
                // Animation delay for staggered effects
                animationDelay: `${delay}ms`,
                // Layering
                zIndex: zIndex,
            }}
            aria-hidden="true" // Decorative element
        />
    );
}

// ============================================
// Preset Configurations
// ============================================

/**
 * Preset orb configurations for common use cases
 * Use these to maintain visual consistency across pages
 */
export const orbPresets = {
    /** Large background orb - top left */
    heroTopLeft: {
        color: 'purple' as const,
        size: 500,
        position: { top: '15%', left: '10%' },
        delay: 0,
        opacity: 0.6,
        animationClass: 'animate-drift-1',
    },
    /** Large background orb - top right */
    heroTopRight: {
        color: 'blue' as const,
        size: 450,
        position: { top: '20%', left: '85%' },
        delay: 1000,
        opacity: 0.5,
        animationClass: 'animate-drift-2',
    },
    /** Medium orb - center left */
    heroCenterLeft: {
        color: 'pink' as const,
        size: 350,
        position: { top: '60%', left: '5%' },
        delay: 2000,
        opacity: 0.4,
        animationClass: 'animate-drift-3',
    },
    /** Small accent orb - bottom right */
    heroBottomRight: {
        color: 'cyan' as const,
        size: 300,
        position: { top: '75%', left: '90%' },
        delay: 500,
        opacity: 0.5,
        animationClass: 'animate-drift-1',
    },
    /** Mixed gradient orb - center */
    heroCenter: {
        color: 'mixed' as const,
        size: 600,
        position: { top: '50%', left: '50%' },
        delay: 0,
        opacity: 0.3,
        animationClass: 'animate-drift-2',
    },
};
