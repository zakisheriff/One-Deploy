import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/deployed-projects
 * Fetch all deployed projects for the current user
 */
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
        return NextResponse.json({ error: "User ID not found" }, { status: 401 });
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                userId: userId,
            },
            include: {
                deployments: {
                    orderBy: { createdAt: 'desc' },
                    take: 1, // Just the latest deployment
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json({
            projects: projects.map(p => ({
                id: p.id,
                name: p.name,
                githubRepo: p.githubRepo,
                framework: p.framework,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
                latestDeployment: p.deployments[0] ? {
                    id: p.deployments[0].id,
                    status: p.deployments[0].status,
                    url: p.deployments[0].url,
                    createdAt: p.deployments[0].createdAt,
                } : null,
            })),
        });

    } catch (error: any) {
        console.error("Fetch Deployed Projects Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
