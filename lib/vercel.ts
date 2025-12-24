
const VERCEL_API_URL = "https://api.vercel.com";

/**
 * Get custom domain base from env (e.g., "theoneatom.com")
 * Deployed sites will be accessible at: projectname.theoneatom.com
 */
const CUSTOM_DOMAIN_BASE = process.env.CUSTOM_DOMAIN_BASE || "";

/**
 * Add custom subdomain to a Vercel project
 * e.g., projectname.theoneatom.com
 */
export async function addCustomDomain(projectName: string): Promise<string | null> {
    if (!CUSTOM_DOMAIN_BASE) {
        console.log("No CUSTOM_DOMAIN_BASE set, skipping custom domain");
        return null;
    }

    const customDomain = `${projectName}.${CUSTOM_DOMAIN_BASE}`;
    console.log(`Adding custom domain: ${customDomain} to project: ${projectName}`);

    try {
        const res = await fetch(`${VERCEL_API_URL}/v10/projects/${projectName}/domains`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: customDomain }),
        });

        if (!res.ok) {
            const error = await res.json();
            // Domain might already exist, that's fine
            if (error.error?.code === 'domain_already_exists' || error.error?.code === 'domain_already_in_use') {
                console.log(`Domain ${customDomain} already exists`);
                return customDomain;
            }
            console.error("Error adding custom domain:", error);
            return null;
        }

        console.log(`Custom domain added: ${customDomain}`);
        return customDomain;
    } catch (error) {
        console.error("Error adding custom domain:", error);
        return null;
    }
}

/**
 * Creates a new project in Vercel.
 * Idempotent: If it exists, it might return error or success depending on API, 
 * but for this logic we primarily depend on the deployment step.
 */
export async function createProject(name: string, repo: string) {
    // repo format: "owner/repo"
    console.log(`Creating Vercel project: ${name} for repo ${repo}`);

    // We try to create the project. If it exists, we catch the error (or check response).
    // Vercel /v9/projects
    const res = await fetch(`${VERCEL_API_URL}/v9/projects`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            gitRepository: {
                type: "github",
                repo: repo,
            },
            framework: "nextjs", // Defaulting to Next.js for now, can be passed dynamically
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        // If error is "Project already exists", that's fine.
        if (error.code === 'project_already_exists') {
            console.log("Project already exists.");
            return { id: null, name }; // Return existing name
        }
        console.error("Error creating project:", error);
        throw new Error(error.message || "Failed to create Vercel project");
    }

    return await res.json();
}

/**
 * Triggers a new deployment for the project.
 */
export async function triggerDeployment(name: string, repoId: number, branch: string = "main") {
    console.log(`Triggering deployment for project: ${name}, repoId: ${repoId}`);

    const res = await fetch(`${VERCEL_API_URL}/v13/deployments?skipAutoDetectionConfirmation=1`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name,
            gitSource: {
                type: "github",
                repoId: repoId.toString(), // Must be string? API docs say repoId (string | number)
                ref: branch,
            },
            // Force new deployment even if no changes?
            // forceNew: true 
        })
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("Deployment failed:", errorData);
        // Vercel errors are usually { error: { code: ..., message: ... } }
        const errorMessage = errorData.error?.message || errorData.message || "Failed to trigger deployment";
        throw new Error(errorMessage);
    }

    return await res.json();
}

export async function deleteProject(name: string) {
    const res = await fetch(`${VERCEL_API_URL}/v9/projects/${name}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 404) return; // Already deleted
        const error = await res.json();
        throw new Error(error.message || "Failed to delete project");
    }

    return true;
}

export async function getDeployment(id: string) {
    const res = await fetch(`${VERCEL_API_URL}/v13/deployments/${id}`, {
        headers: {
            "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
        }
    });
    return await res.json();
}

/**
 * Creates a deployment using repo name (for webhook-triggered deploys)
 */
export async function createDeployment(
    projectName: string,
    repoFullName: string,
    branch: string = "main",
    framework?: string
) {
    console.log(`Creating deployment for project: ${projectName}, repo: ${repoFullName}`);

    const res = await fetch(`${VERCEL_API_URL}/v13/deployments?skipAutoDetectionConfirmation=1`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.VERCEL_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: projectName,
            gitSource: {
                type: "github",
                repo: repoFullName,
                ref: branch,
            },
            projectSettings: framework ? { framework } : undefined,
        })
    });

    if (!res.ok) {
        const errorData = await res.json();
        console.error("Deployment failed:", errorData);
        const errorMessage = errorData.error?.message || errorData.message || "Failed to create deployment";
        throw new Error(errorMessage);
    }

    return await res.json();
}
