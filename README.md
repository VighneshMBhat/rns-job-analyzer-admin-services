# Admin Service - API Key Management

Minimal admin frontend for managing API keys across all RNS Job Analyzer services.

## 🔐 Access

- **Admin Email**: `vighneshbhat14@gmail.com`
- **Password**: Set during first login

## 🚀 Deployment to Vercel

### 1. Connect Repository

1. Go to [Vercel](https://vercel.com)
2. Import from Git: `https://github.com/VighneshMBhat/rns-job-analyzer-admin-services`

### 2. Configure Environment Variables

Add these in Vercel → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rokptxcawrmhqcmrsjca.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `vighneshbhat14@gmail.com` |

### 3. Deploy

Click Deploy and wait for it to complete.

## 📋 API Keys Managed

| Service | Key Name | Used By |
|---------|----------|---------|
| Gemini | `GEMINI_API_KEY` | Skill Gap Analysis |
| SERP | `SERP_API_KEY` | Trend Collection |
| Groq | `GROQ_API_KEY` | GitHub Skill Extraction |
| GitHub | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth |
| AWS | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | S3 Reports |
| Email | `SMTP_*` | Notification Emails |

## 🔧 Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000
