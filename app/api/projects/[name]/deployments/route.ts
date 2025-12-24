import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/projects/[name]/deployments
 * Fetch all deployments for a project
 */
export async function GET(
    request: Request,
    { params }: { params: { name: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const projectName = params.name;
        const userId = (session.user as any).id;

        // Find the project
        const project = await prisma.project.findFirst({
            where: {
                name: projectName.toLowerCase(),
                userId: userId,
            },
            include: {
                deployments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10, // Limit to last 10 deployments
                },
            },
        });

        if (!project) {
            return NextResponse.json({
                project: null,
                deployments: []
            });
        }

        return NextResponse.json({
            project: {
                id: project.id,
                name: project.name,
                githubRepo: project.githubRepo,
                framework: project.framework,
                createdAt: project.createdAt,
            },
            deployments: project.deployments.map(d => ({
                id: d.id,
                vercelId: d.vercelId,
                url: d.url,
                status: d.status,
                createdAt: d.createdAt,
            })),
        });

    } catch (error: any) {
        console.error("Fetch Deployments Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
