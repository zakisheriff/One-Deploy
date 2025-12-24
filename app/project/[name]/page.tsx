/**
 * Project Detail Page - One Deploy
 * 
 * Dynamic project page that handles both mock and real repositories.
 */

import Link from 'next/link';
import Navigation from '../../components/Navigation';
import ProjectContent from './ProjectContent';

interface PageProps {
    params: {
        name: string;
    };
}

export default function ProjectPage({ params }: PageProps) {
    const projectName = params.name;

    // For Phase 2, we want to allow ANY repo name to load the project page.
    // Eventually we will fetch the real repo details here.
    // For now, we mock the repo object based on the name so the UI renders.

    const mockRepo = {
        id: 0, // Placeholder ID
        name: projectName,
        full_name: `user/${projectName}`,
        private: false,
        html_url: `https://github.com/user/${projectName}`,
        description: "Repository description loading...",
        language: "TypeScript", // Placeholder
        updated_at: new Date().toISOString(),
        default_branch: "main",
        // Add any other required fields for ProjectContent
        deployments: [], // Empty deployments initially
    };

    return <ProjectContent repo={mockRepo as any} projectName={projectName} />;
}
