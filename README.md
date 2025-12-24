# <div align="center">One Deploy</div>

<div align="center">
<strong>Deploy frontend websites in seconds — powered by The One Atom</strong>
</div>

<br />

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

<br />

> **"Deploy in seconds, scale globally."**
>
> One Deploy is a mini Vercel-style platform for deploying frontend websites.
> Push your code, we handle the rest — automatic builds, global CDN, instant SSL, and custom domains.

---

## 🚀 Features

- **Instant Deployments**  
  Push to deploy in under 30 seconds with zero configuration.

- **Global Edge Network**  
  Powered by Cloudflare's edge network for lightning-fast performance worldwide.

- **Automatic SSL**  
  HTTPS enabled for all deployments — no certificate management needed.

- **Custom Domains**  
  Bring your own domain or use `*.onedeploy.dev` subdomains for free.

- **GitHub Integration**  
  Connect your repositories and deploy automatically on every push.

- **Real-time Build Logs**  
  Watch your deployment progress with live terminal-style logs.

---

## 🎨 Design

One Deploy features **The One Atom** design system:

- **Pure Black Theme** — `#000000` background for an immersive experience
- **Glassmorphic UI** — Translucent panels with `backdrop-filter: blur()`
- **Ambient Orbs** — Floating gradient effects for visual depth
- **Premium Typography** — Inter font with precise spacing

---

## 📁 Project Structure

```
one-deploy/
├── app/
│   ├── components/           # Reusable UI Components
│   │   ├── AmbientOrb.tsx       # Floating background orbs
│   │   ├── Card.tsx             # Deployment card
│   │   ├── DeployButton.tsx     # Deploy trigger button
│   │   ├── DeploymentLogs.tsx   # Build logs viewer
│   │   ├── Hero.tsx             # Hero section
│   │   ├── Navigation.tsx       # Floating nav pill
│   │   └── RepoList.tsx         # Repository list
│   ├── dashboard/
│   │   └── page.tsx          # User dashboard
│   ├── docs/
│   │   └── page.tsx          # Documentation page
│   ├── project/
│   │   └── [name]/
│   │       └── page.tsx      # Project detail page
│   ├── lib/
│   │   └── mockData.ts       # Mock data for MVP
│   ├── styles/
│   │   └── globals.css       # Global styles & design tokens
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Landing page
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow
├── tailwind.config.ts        # Tailwind configuration
├── next.config.mjs           # Next.js configuration
└── package.json              # Dependencies
```

---

## 🛠️ Quick Start

### Prerequisites

- **Node.js** (v20+)
- **npm** or **yarn**

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

Create `.env.local` and add your API keys:

```env
CF_API_TOKEN=your_cloudflare_api_token
CF_ACCOUNT_ID=your_cloudflare_account_id
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

### 4. Run the Application

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

### Styling
- **Tailwind CSS** — Utility-first CSS framework
- **CSS Variables** — Design tokens for theming
- **Backdrop Filters** — Glassmorphic effects

### Deployment
- **Cloudflare Pages** — Edge-first hosting
- **GitHub Actions** — CI/CD automation

---

## 🚀 Deployment

### Cloudflare Pages

1. Create a new project on Cloudflare Pages
2. Connect your GitHub repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `out`
4. Deploy!

### GitHub Actions

The workflow template (`.github/workflows/deploy.yml`) handles automatic deployments:

```yaml
name: Build & Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          accountId: ${{ secrets.CF_ACCOUNT_ID }}
          projectName: one-deploy
          directory: ./out
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

MIT License — 100% Free and Open Source

---

<p align="center">
Made with ❤️ by <strong>Zaki Sheriff</strong> at <strong>The One Atom</strong>
</p>

<p align="center">
<em>Deploy in seconds, scale globally.</em>
</p>
