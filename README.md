# <div align="center">One Deploy</div>

<div align="center">
<strong>Deploy frontend websites in seconds — powered by Vercel</strong>
</div>

<br />

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-API-black?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

<br />

> **"Deploy in seconds, scale globally."**
>
> One Deploy is a mini Vercel-style platform for deploying frontend websites.
> Push your code, we handle the rest — automatic builds, global CDN, instant SSL, and real-time status.

---

## 🚀 Features

- **Instant Deployments**  
  Deploy any GitHub repository to Vercel in seconds.

- **Real-time Status**  
  Watch your deployment progress with live terminal-style logs.

- **Auto-Redeploy on Push**  
  GitHub webhook triggers automatic redeployment on every push.

- **Deployment History**  
  View all past deployments with status badges and visit links.

- **GitHub OAuth**  
  Securely connect your GitHub account and access your repositories.

- **Project Management**  
  Deploy, redeploy, and delete projects with ease.

---

## 🛠️ Quick Start

### Prerequisites

- **Node.js** (v20+)
- **PostgreSQL** database (Supabase, Railway, or local)
- **Vercel Account** with API token
- **GitHub OAuth App**

### 1. Clone the Repository

```bash
git clone https://github.com/zakisheriff/One-Deploy.git
cd One-Deploy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create `.env` and add your credentials:

```env
# Database
DATABASE_POSTGRES_PRISMA_URL="postgresql://..."
DATABASE_POSTGRES_URL_NON_POOLING="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Vercel API
VERCEL_API_TOKEN="your-vercel-api-token"

# Optional: GitHub Webhook Secret
GITHUB_WEBHOOK_SECRET="your-webhook-secret"
```

### 4. Set up Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Application

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## 🔧 Tech Stack

### Core
- **Next.js 14+** — React Framework with App Router
- **React 18** — Library for building user interfaces
- **TypeScript** — Type-safe JavaScript

### Backend
- **Prisma** — Type-safe database ORM
- **PostgreSQL** — Relational database
- **NextAuth.js** — Authentication with GitHub OAuth

### Deployment
- **Vercel API** — Programmatic deployments
- **GitHub Webhooks** — Auto-redeploy on push

### Styling
- **Tailwind CSS** — Utility-first CSS framework
- **Glassmorphic UI** — Translucent panels with blur effects

---

## 📁 Project Structure

```
one-deploy/
├── app/
│   ├── api/
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── github/repos/         # Fetch user repositories
│   │   ├── projects/             # Project management
│   │   │   ├── deploy/           # Trigger deployments
│   │   │   └── [name]/           # Project CRUD
│   │   ├── deployments/[id]/     # Deployment status
│   │   └── webhooks/github/      # GitHub push webhooks
│   ├── components/           
│   │   ├── Navigation.tsx        # Floating nav with profile
│   │   ├── Hero.tsx              # Landing page hero
│   │   ├── RepoList.tsx          # Repository list
│   │   └── DeploymentLogs.tsx    # Build logs viewer
│   ├── dashboard/                # User dashboard
│   ├── docs/                     # Documentation
│   └── project/[name]/           # Project detail page
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Database client
│   └── vercel.ts                 # Vercel API functions
├── prisma/
│   └── schema.prisma             # Database schema
└── package.json
```

---

## 🔌 GitHub Webhook Setup (Optional)

For auto-redeploy on push:

1. Go to your **GitHub Repo Settings → Webhooks**
2. Add webhook:
   - **URL**: `https://your-domain.com/api/webhooks/github`
   - **Content type**: `application/json`
   - **Secret**: Same as `GITHUB_WEBHOOK_SECRET` in .env
   - **Events**: Just the push event
3. Save and push to test!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License — 100% Free and Open Source

---

<p align="center">
Made by <strong>Zaki Sheriff</strong>

<p align="center">
<em>Deploy in seconds, scale globally.</em>
</p>
