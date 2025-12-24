import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../../lib/auth";
import { NextResponse } from "next/server";

const VERCEL_API_URL = "https://api.vercel.com";

interface RouteParams {
    params: { name: string };
}

/**
 * POST /api/projects/[name]/domain
 * Add a custom domain to a Vercel project
 */
export async function POST(request: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { domain } = await request.json();
        const projectName = params.name;

        if (!domain) {
            return NextResponse.json({ error: "Domain is required" }, { status: 400 });
        }

        // Add domain to Vercel project
        const res = await fetch(`${VERCEL_API_URL}/v10/projects/${projectName}/domains`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: domain }),
        });

        if (!res.ok) {
            const error = await res.json();
            console.error("Vercel Domain Error:", error);
            return NextResponse.json({
                error: error.error?.message || "Failed to add domain"
            }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json({ success: true, domain: data });

    } catch (error: any) {
        console.error("Add Domain Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET /api/projects/[name]/domain
 * Get domains for a Vercel project
 */
export async function GET(request: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const projectName = params.name;

        // Get domains from Vercel project
        const res = await fetch(`${VERCEL_API_URL}/v9/projects/${projectName}/domains`, {
            headers: {
                "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json({ domains: [] });
        }

        const data = await res.json();
        return NextResponse.json({ domains: data.domains || [] });

    } catch (error: any) {
        console.error("Get Domains Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE /api/projects/[name]/domain
 * Remove a custom domain from a Vercel project
 */
export async function DELETE(request: Request, { params }: RouteParams) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { domain } = await request.json();
        const projectName = params.name;

        // Remove domain from Vercel project
        const res = await fetch(`${VERCEL_API_URL}/v9/projects/${projectName}/domains/${domain}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
            },
        });

        if (!res.ok) {
            const error = await res.json();
            return NextResponse.json({
                error: error.error?.message || "Failed to remove domain"
            }, { status: res.status });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Remove Domain Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
