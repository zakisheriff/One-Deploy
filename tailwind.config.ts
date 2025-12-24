/**
 * Tailwind CSS Configuration for One Deploy
 * 
 * Implements "The One Atom" design system:
 * - Dark, glassmorphic theme
 * - Custom colors for dark UI
 * - Backdrop blur utilities for glass effects
 * - Custom box shadows for depth
 * - Extended animations for ambient effects
 */

import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            // Custom color palette for dark glassmorphic theme
            colors: {
                bgBlack: '#000000',        // Pure black background
                textPrimary: '#FFFFFF',    // Primary white text
                textSecondary: '#E0E0E0',  // Slightly muted text
                textMuted: '#A0A0A0',      // Muted/inactive text
                glass: {
                    light: 'rgba(255, 255, 255, 0.1)',   // Light glass overlay
                    medium: 'rgba(255, 255, 255, 0.15)', // Medium glass overlay
                    dark: 'rgba(0, 0, 0, 0.4)',          // Dark glass overlay
                },
                accent: {
                    purple: '#8B5CF6',   // Primary accent
                    blue: '#3B82F6',     // Secondary accent
                    pink: '#EC4899',     // Tertiary accent
                    cyan: '#06B6D4',     // Quaternary accent
                },
            },
            // Custom backdrop blur for glass effects
            backdropBlur: {
                glass: '12px',
                'glass-lg': '20px',
            },
            // Custom box shadows for depth and glow effects
            boxShadow: {
                soft: '0 10px 40px rgba(0, 0, 0, 0.4)',
                glow: '0 0 20px rgba(255, 255, 255, 0.2)',
                'glow-purple': '0 0 30px rgba(139, 92, 246, 0.3)',
                'glow-blue': '0 0 30px rgba(59, 130, 246, 0.3)',
                'glow-pink': '0 0 30px rgba(236, 72, 153, 0.3)',
            },
            // Font family configuration
            fontFamily: {
                sans: [
                    'SF Pro Display',
                    'Inter',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif',
                ],
            },
            // Custom animations for ambient effects
            animation: {
                'drift': 'drift 20s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            // Keyframe definitions for custom animations
            keyframes: {
                drift: {
                    '0%, 100%': {
                        transform: 'translate(0, 0) rotate(0deg)',
                    },
                    '25%': {
                        transform: 'translate(50px, -30px) rotate(5deg)',
                    },
                    '50%': {
                        transform: 'translate(-20px, 50px) rotate(-5deg)',
                    },
                    '75%': {
                        transform: 'translate(-50px, -20px) rotate(3deg)',
                    },
                },
                float: {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                    },
                    '50%': {
                        transform: 'translateY(-20px)',
                    },
                },
                fadeIn: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(10px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                slideUp: {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                glow: {
                    '0%': {
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.2)',
                    },
                    '100%': {
                        boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)',
                    },
                },
            },
            // Transition timing functions
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            // Extended transition durations
            transitionDuration: {
                '2000': '2000ms',
                '3000': '3000ms',
            },
        },
    },
    plugins: [],
};

export default config;
