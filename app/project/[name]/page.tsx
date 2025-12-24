/**
 * Project Detail Page - One Deploy
 * 
 * Dynamic project page that handles both mock and real repositories.
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import ProjectContent from './ProjectContent';
import { redirect } from 'next/navigation';

interface PageProps {
    params: {
        name: string;
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const projectName = params.name;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect('/');
    }

    const userId = (session.user as any).id;

    // Default mock fallback in case of API failure
    let repoData = {
        id: 0,
        name: projectName,
        full_name: `user/${projectName}`,
        private: false,
        html_url: `https://github.com/user/${projectName}`,
        description: "Repository description not found.",
        language: "JavaScript",
        updated_at: new Date().toISOString(),
        default_branch: "main",
        deployments: [],
    };

    // Fetch existing project and deployments from database
    let existingProject = null;
    let existingDeployments: any[] = [];

    try {
        const project = await prisma.project.findFirst({
            where: {
                name: projectName.toLowerCase(),
                userId: userId,
            },
            include: {
                deployments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (project) {
            existingProject = {
                id: project.id,
                name: project.name,
                githubRepo: project.githubRepo,
                framework: project.framework,
                createdAt: project.createdAt,
            };
            existingDeployments = project.deployments.map(d => ({
                id: d.id,
                vercelId: d.vercelId,
                url: d.url,
                status: d.status,
                createdAt: d.createdAt,
            }));
        }
    } catch (error) {
        console.error("Error fetching existing project:", error);
    }

    try {
        // Get GitHub Token
        const account = await prisma.account.findFirst({
            where: {
                userId: userId,
                provider: "github",
            },
        });

        if (account?.access_token) {
            // Fetch user's repos to find the specific one
            const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
                headers: {
                    Authorization: `Bearer ${account.access_token}`,
                    Accept: "application/vnd.github.v3+json",
                },
                next: { revalidate: 60 } // Cache for 60s
            });

            if (res.ok) {
                const repos = await res.json();
                const foundRepo = repos.find((r: any) => r.name === projectName || r.name.toLowerCase() === projectName.toLowerCase());

                if (foundRepo) {
                    repoData = {
                        ...foundRepo,
                        deployments: existingDeployments,
                    };
                }
            } else {
                console.error(`[ProjectPage] GitHub API Error: ${res.status}`);
            }
        }
    } catch (error) {
        console.error("Error fetching repo details:", error);
    }

    return (
        <ProjectContent
            repo={repoData as any}
            projectName={projectName}
            initialProject={existingProject}
            initialDeployments={existingDeployments}
        />
    );
}

