import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

interface RouteParams {
    params: { id: string };
}

/**
 * PATCH /api/deployments/[id]/status
 * Update deployment status in database
 */
export async function PATCH(request: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { status, url } = await request.json();
        const vercelDeploymentId = params.id;

        // Find deployment by vercelId
        const existingDeployment = await prisma.deployment.findFirst({
            where: { vercelId: vercelDeploymentId },
        });

        if (!existingDeployment) {
            return NextResponse.json({ error: "Deployment not found" }, { status: 404 });
        }

        // Update deployment
        const deployment = await prisma.deployment.update({
            where: { id: existingDeployment.id },
            data: {
                status: status,
                ...(url && { url: url }),
            },
        });

        return NextResponse.json({ success: true, deployment });

    } catch (error: any) {
        console.error("Update Deployment Status Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
