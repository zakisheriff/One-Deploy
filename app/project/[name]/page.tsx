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

    try {
        // Get GitHub Token
        const account = await prisma.account.findFirst({
            where: {
                userId: (session.user as any).id,
                provider: "github",
            },
        });

        if (account?.access_token) {
            // Fetch user's repos to find the specific one
            // Ideally we'd fetch /repos/{owner}/{repo}, but we need owner login. 
            // Fetching list is safer for now if we don't know the exact owner (could be org).
            const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
                headers: {
                    Authorization: `Bearer ${account.access_token}`,
                    Accept: "application/vnd.github.v3+json",
                },
                next: { revalidate: 60 } // Cache for 60s
            });

            if (res.ok) {
                const repos = await res.json();
                console.log(`[ProjectPage] Fetched ${repos.length} repos from GitHub`);

                const foundRepo = repos.find((r: any) => r.name === projectName || r.name.toLowerCase() === projectName.toLowerCase());

                if (foundRepo) {
                    console.log(`[ProjectPage] Found match: ${foundRepo.full_name}`);
                    repoData = {
                        ...foundRepo,
                        deployments: [], // Still empty until we link deployments
                    };
                } else {
                    console.log(`[ProjectPage] No match found for: ${projectName}`);
                    // Debug: print first 3 repo names
                    if (repos.length > 0) console.log("Sample repos:", repos.slice(0, 3).map((r: any) => r.name));
                }
            } else {
                console.error(`[ProjectPage] GitHub API Error: ${res.status}`);
            }
        }
    } catch (error) {
        console.error("Error fetching repo details:", error);
    }

    return <ProjectContent repo={repoData as any} projectName={projectName} />;
}
