
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { createProject, triggerDeployment } from "../../../../lib/vercel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { repoName, repoId, framework } = await request.json();

        // One-Deploy: Use valid Vercel project name (lowercase)
        const projectName = repoName.toLowerCase();

        // 1. Create or Find Project in DB
        // Check if project exists for this user
        let project = await prisma.project.findFirst({
            where: {
                userId: session.user.id,
                name: projectName,
            }
        });

        // If not, create it
        if (!project) {
            // Also create in Vercel if newly tracking
            try {
                // Use sanitized projectName
                await createProject(projectName, session.user.name + "/" + repoName);
            } catch (e) {
                console.error("Vercel project creation error", e);
                // Continue? If project exists in Vercel, we can still deploy.
            }

            project = await prisma.project.create({
                data: {
                    name: projectName,
                    githubRepo: repoName,
                    framework: framework || "nextjs",
                    userId: session.user.id,
                }
            });
        }

        // 2. Trigger Vercel Deployment
        // We need the numeric repoId for gitSource
        const deploymentData = await triggerDeployment(project.name, repoId);

        // 3. Save Deployment to DB
        const deployment = await prisma.deployment.create({
            data: {
                vercelId: deploymentData.id,
                status: deploymentData.id ? "QUEUED" : "ERROR",
                url: deploymentData.url,
                projectId: project.id,
            }
        });

        return NextResponse.json({
            success: true,
            deploymentId: deployment.id,
            vercelDeploymentId: deploymentData.id
        });

    } catch (error: any) {
        console.error("Deploy API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
