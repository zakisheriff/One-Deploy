
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../lib/auth";
import { getDeployment } from "../../../../lib/vercel";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const deploymentId = params.id;
        const deployment = await getDeployment(deploymentId);

        // Check for Vercel errors passed through
        if (deployment.error) {
            return NextResponse.json(deployment, { status: 400 });
        }

        return NextResponse.json(deployment);

    } catch (error: any) {
        console.error("Deployment Status API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
