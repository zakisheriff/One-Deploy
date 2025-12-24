
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { deleteProject } from "../../../../lib/vercel";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: { name: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectName = params.name;

    try {
        // 1. Delete from Vercel
        // We use the sanitized name if possible, but params.name is what we have.
        // If the project name in DB is lowercase, ensure we match that.
        // Actually, Vercel projects are lowercase.
        await deleteProject(projectName.toLowerCase());

        // 2. Delete from Database
        // We delete the project, cascading deletes to deployments usually works if schema supports it,
        // or we manually delete deployments first.
        // Prisma schema usually doesn't have cascade on relationunless defined.
        // Let's check schema or just delete project and let Prisma handle it if configured, 
        // or query first.

        // Safer to find first to get ID
        const project = await prisma.project.findFirst({
            where: {
                name: projectName.toLowerCase(),
                userId: (session.user as any).id
            }
        });

        if (project) {
            // Delete deployments first to satisfy foreign keys if no cascade
            await prisma.deployment.deleteMany({
                where: { projectId: project.id }
            });

            await prisma.project.delete({
                where: { id: project.id }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Delete Project Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
