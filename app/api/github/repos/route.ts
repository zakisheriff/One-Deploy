import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // 1. Verify Session
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Get the User's GitHub Access Token from DB
        // The account is linked to the user.id
        const account = await prisma.account.findFirst({
            where: {
                userId: (session.user as any).id,
                provider: "github",
            },
        });

        if (!account || !account.access_token) {
            return NextResponse.json({ error: "GitHub account not linked or token missing" }, { status: 400 });
        }

        // 3. Fetch Repositories from GitHub
        // We want 'all' repos the user has access to, sorted by updated
        const githubRes = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100&visibility=all", {
            headers: {
                Authorization: `Bearer ${account.access_token}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        if (!githubRes.ok) {
            console.error("GitHub API Error:", await githubRes.text());
            return NextResponse.json({ error: "Failed to fetch repositories from GitHub" }, { status: githubRes.status });
        }

        const repos = await githubRes.json();

        // 4. Return formatted list
        // We verify the data structure briefly
        const formattedRepos = repos.map((repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            private: repo.private,
            html_url: repo.html_url,
            description: repo.description,
            language: repo.language,
            updated_at: repo.updated_at,
            default_branch: repo.default_branch,
        }));

        return NextResponse.json({ repos: formattedRepos });

    } catch (error) {
        console.error("Repo Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
