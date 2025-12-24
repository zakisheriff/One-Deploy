import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { createDeployment, createProject } from "../../../../lib/vercel";
import crypto from "crypto";

/**
 * POST /api/webhooks/github
 * 
 * GitHub Webhook handler for push events.
 * Triggers auto-redeploy when code is pushed to a repo that has been deployed.
 */
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-hub-signature-256");
        const event = request.headers.get("x-github-event");

        // Verify webhook signature if secret is configured
        const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
        if (webhookSecret && signature) {
            const hmac = crypto.createHmac("sha256", webhookSecret);
            hmac.update(body);
            const expectedSignature = `sha256=${hmac.digest("hex")}`;

            if (signature !== expectedSignature) {
                console.log("[Webhook] Invalid signature");
                return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            }
        }

        const payload = JSON.parse(body);

        // Only handle push events
        if (event !== "push") {
            return NextResponse.json({ message: `Ignoring ${event} event` });
        }

        // Get repo info from payload
        const repoFullName = payload.repository?.full_name; // "owner/repo"
        const repoName = payload.repository?.name;
        const defaultBranch = payload.repository?.default_branch || "main";
        const ref = payload.ref; // "refs/heads/main"

        // Only deploy on push to default branch
        if (ref !== `refs/heads/${defaultBranch}`) {
            console.log(`[Webhook] Ignoring push to ${ref}, only deploying ${defaultBranch}`);
            return NextResponse.json({ message: "Ignoring non-default branch push" });
        }

        console.log(`[Webhook] Push to ${repoFullName} (${defaultBranch})`);

        // Find project in our database by githubRepo
        const project = await prisma.project.findFirst({
            where: {
                githubRepo: repoFullName,
            },
            include: {
                user: {
                    include: {
                        accounts: {
                            where: { provider: "github" },
                        },
                    },
                },
            },
        });

        if (!project) {
            console.log(`[Webhook] No project found for ${repoFullName}`);
            return NextResponse.json({ message: "No matching project found" });
        }

        const githubToken = project.user.accounts[0]?.access_token;
        if (!githubToken) {
            console.log(`[Webhook] No GitHub token for user`);
            return NextResponse.json({ error: "No GitHub token" }, { status: 400 });
        }

        console.log(`[Webhook] Triggering redeploy for project: ${project.name}`);

        // Create new deployment on Vercel
        const vercelDeployment = await createDeployment(
            project.name,
            repoFullName,
            defaultBranch,
            project.framework || undefined
        );

        // Save deployment to database
        const deployment = await prisma.deployment.create({
            data: {
                vercelId: vercelDeployment.id,
                url: vercelDeployment.url,
                status: "QUEUED",
                projectId: project.id,
            },
        });

        console.log(`[Webhook] Deployment created: ${deployment.id}`);

        return NextResponse.json({
            message: "Deployment triggered",
            deploymentId: deployment.id,
            vercelDeploymentId: vercelDeployment.id,
        });

    } catch (error: any) {
        console.error("[Webhook] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
