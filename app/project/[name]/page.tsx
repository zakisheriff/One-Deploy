/**
 * Project Detail Page - One Deploy
 * 
 * Server component wrapper that handles static generation.
 * The interactive content is delegated to a client component.
 */

import Link from 'next/link';
import { mockRepositories } from '../../lib/mockData';
import ProjectContent from './ProjectContent';
import Navigation from '../../components/Navigation';

// Generate static params for all projects (required for static export)
export function generateStaticParams() {
    return mockRepositories.map((repo) => ({
        name: repo.name,
    }));
}

interface PageProps {
    params: {
        name: string;
    };
}

export default function ProjectPage({ params }: PageProps) {
    const projectName = params.name;

    // Find the repository
    const repo = mockRepositories.find(r => r.name === projectName);

    if (!repo) {
        return (
            <div className="relative min-h-screen pb-24 md:pb-8">
                <Navigation />
                <main className="relative z-10 pt-24 md:pt-32 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-3xl font-bold text-textPrimary mb-4">Project Not Found</h1>
                        <p className="text-textMuted mb-6">The project &quot;{projectName}&quot; doesn&apos;t exist.</p>
                        <Link href="/dashboard" className="accent-button">
                            Back to Dashboard
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return <ProjectContent repo={repo} projectName={projectName} />;
}
