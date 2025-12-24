import React from 'react';
import Navigation from '../components/Navigation';

export default function SupportPage() {
    return (
        <div className="relative min-h-screen pb-24 md:pb-8">
            <Navigation />
            <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-3xl font-bold text-textPrimary mb-4">Support</h1>
                    <p className="text-textMuted mb-6">Need help? We're here for you.</p>
                </div>
            </main>
        </div>
    );
}
