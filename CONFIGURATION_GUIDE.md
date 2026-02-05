# RNS Job Analyzer - Complete Configuration Guide

## 📋 Overview

This guide lists ALL environment variables and configuration needed for EVERY platform in the RNS Job Analyzer system.

---

## 🏗️ Architecture Summary

| Platform | Service | Purpose |
|----------|---------|---------|
| **Vercel** | Frontend (Next.js) | User Dashboard |
| **Vercel** | Admin Portal | API Key Management |
| **AWS Lambda** | Authentication Service | User auth handling |
| **AWS Lambda** | GitHub Service | GitHub OAuth & Skill Extraction |
| **AWS Lambda** | Trend Skill Service | Job & Discussion Collection |
| **AWS Lambda** | Skill Gap Service | AI Analysis & PDF Reports |
| **AWS EventBridge** | CRON Scheduler | Weekly automation |
| **Supabase** | Database & Auth | Data storage |

---

# 1️⃣ VERCEL - Frontend (Main App)

## Environment Variables

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rokptxcawrmhqcmrsjca.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva3B0eGNhd3JtaHFjbXJzamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTUzNTUsImV4cCI6MjA4NTc3MTM1NX0.h-RQaxCQHahK4RgsROIF2nHe7LxN1Nd2YhXFn4o2IGc` | Supabase anon key |
| `NEXT_PUBLIC_GITHUB_SERVICE_URL` | `https://12dbzw94lh.execute-api.us-east-1.amazonaws.com/Prod` | GitHub Service API |
| `NEXT_PUBLIC_SKILLGAP_SERVICE_URL` | `https://tku29qrthd.execute-api.us-east-1.amazonaws.com/Prod` | Skill Gap Service API |
| `NEXT_PUBLIC_AUTH_SERVICE_URL` | *(your auth service URL)* | Auth Service API |

---

# 2️⃣ VERCEL - Admin Portal

## Environment Variables

Go to: **Vercel Dashboard → Admin Project → Settings → Environment Variables**

| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rokptxcawrmhqcmrsjca.supabase.co` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJva3B0eGNhd3JtaHFjbXJzamNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxOTUzNTUsImV4cCI6MjA4NTc3MTM1NX0.h-RQaxCQHahK4RgsROIF2nHe7LxN1Nd2YhXFn4o2IGc` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Get from Supabase Dashboard → Settings → API)* | Service role key |
| `NEXT_PUBLIC_ADMIN_EMAIL` | `vighneshbhat14@gmail.com` | Admin email |

### How to Get Service Role Key:
1. Go to: https://supabase.com/dashboard/project/rokptxcawrmhqcmrsjca/settings/api
2. Copy the `service_role` key (keep secret!)

---

# 3️⃣ AWS LAMBDA - Skill Gap Service

## Lambda Function Name
`skillgap-service-SkillGapServiceFunction-KkD7d1XD8KMI`

## Environment Variables

Go to: **AWS Console → Lambda → Functions → skillgap-service... → Configuration → Environment Variables**

| Variable | Value | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://rokptxcawrmhqcmrsjca.supabase.co` | Supabase URL |
| `SUPABASE_KEY` | *(anon key)* | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | *(service role key)* | For database operations |
| `GEMINI_API_KEY` | *(your Gemini key)* | Fallback AI key |
| `GEMINI_MODEL` | `gemini-2.5-pro` | AI model to use |
| `AWS_S3_BUCKET` | `skillgap-reports-497927597469` | S3 bucket for PDFs |

**Note:** Service also fetches dynamic keys from `admin_api_keys` table.

---

# 4️⃣ AWS LAMBDA - GitHub Service

## Lambda Function Name
`github-service-GithubServiceFunction-wGtVkNqGeSDL`

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://rokptxcawrmhqcmrsjca.supabase.co` | Supabase URL |
| `SUPABASE_KEY` | *(anon key)* | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | *(service role key)* | For database operations |
| `GITHUB_CLIENT_ID` | *(from GitHub OAuth App)* | GitHub OAuth Client ID |
| `GITHUB_CLIENT_SECRET` | *(from GitHub OAuth App)* | GitHub OAuth Secret |
| `GROQ_API_KEY` | *(your Groq key)* | For skill extraction |
| `CALLBACK_URL` | `https://12dbzw94lh.execute-api.us-east-1.amazonaws.com/Prod/api/github/callback` | OAuth callback |
| `FRONTEND_URL` | *(your Vercel frontend URL)* | Redirect after OAuth |

### How to Get GitHub OAuth Credentials:
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: `RNS Job Analyzer`
   - Homepage URL: Your frontend URL
   - Callback URL: `https://12dbzw94lh.execute-api.us-east-1.amazonaws.com/Prod/api/github/callback`

---

# 5️⃣ AWS LAMBDA - Trend Skill Service

## Lambda Function Name
`trend-skill-service-TrendSkillServiceFunction-8tuTaNa43elV`

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `SUPABASE_URL` | `https://rokptxcawrmhqcmrsjca.supabase.co` | Supabase URL |
| `SUPABASE_KEY` | *(anon key)* | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | *(service role key)* | For database operations |
| `SERP_API_KEY` | *(your SERP API key)* | For Google Jobs data |

### How to Get SERP API Key:
1. Go to: https://serpapi.com/
2. Sign up and get your API key

---

# 6️⃣ AWS EVENTBRIDGE - CRON Schedules

## Direct Link to Schedules
https://us-east-1.console.aws.amazon.com/scheduler/home?region=us-east-1#schedules

## Schedule 1: Trend Skill Collection
| Setting | Value |
|---------|-------|
| Name | `trend-skill-weekly-collection` |
| CRON | `0 0 ? * SUN *` |
| Target | Lambda: `trend-skill-service-TrendSkillServiceFunction-8tuTaNa43elV` |

**Input JSON:**
```json
{
    "resource": "/api/cron/run-full",
    "path": "/api/cron/run-full",
    "httpMethod": "POST",
    "headers": {"Content-Type": "application/json"},
    "queryStringParameters": null,
    "body": null,
    "isBase64Encoded": false,
    "requestContext": {"resourcePath": "/api/cron/run-full", "httpMethod": "POST"}
}
```

## Schedule 2: GitHub Sync
| Setting | Value |
|---------|-------|
| Name | `github-skill-weekly-sync` |
| CRON | `0 2 ? * SUN *` |
| Target | Lambda: `github-service-GithubServiceFunction-wGtVkNqGeSDL` |

**Input JSON:**
```json
{
    "resource": "/api/github/sync/cron/run",
    "path": "/api/github/sync/cron/run",
    "httpMethod": "POST",
    "headers": {"Content-Type": "application/json"},
    "queryStringParameters": null,
    "body": null,
    "isBase64Encoded": false,
    "requestContext": {"resourcePath": "/api/github/sync/cron/run", "httpMethod": "POST"}
}
```

## Schedule 3: Skill Gap Analysis
| Setting | Value |
|---------|-------|
| Name | `skillgap-weekly-analysis` |
| CRON | `0 4 ? * SUN *` |
| Target | Lambda: `skillgap-service-SkillGapServiceFunction-KkD7d1XD8KMI` |

**Input JSON:**
```json
{
    "resource": "/api/cron/run",
    "path": "/api/cron/run",
    "httpMethod": "POST",
    "headers": {"Content-Type": "application/json"},
    "queryStringParameters": null,
    "body": null,
    "isBase64Encoded": false,
    "requestContext": {"resourcePath": "/api/cron/run", "httpMethod": "POST"}
}
```

---

# 7️⃣ SUPABASE - Database Configuration

## Dashboard URL
https://supabase.com/dashboard/project/rokptxcawrmhqcmrsjca

## API Keys Location
Settings → API → Project API Keys

## Dynamic API Keys (admin_api_keys table)

These keys are managed via the Admin Portal and used by all backend services:

| Service | Key Name | Used By | Get From |
|---------|----------|---------|----------|
| `gemini` | `GEMINI_API_KEY` | Skill Gap Service | https://aistudio.google.com/app/apikey |
| `serp` | `SERP_API_KEY` | Trend Service | https://serpapi.com/ |
| `groq` | `GROQ_API_KEY` | GitHub Service | https://console.groq.com/ |
| `github` | `GITHUB_CLIENT_ID` | GitHub Service | GitHub Developer Settings |
| `github` | `GITHUB_CLIENT_SECRET` | GitHub Service | GitHub Developer Settings |
| `aws` | `AWS_ACCESS_KEY_ID` | S3 Storage | AWS IAM Console |
| `aws` | `AWS_SECRET_ACCESS_KEY` | S3 Storage | AWS IAM Console |
| `email` | `SMTP_HOST` | Notifications | Your email provider |
| `email` | `SMTP_PORT` | Notifications | Usually 587 |
| `email` | `SMTP_USER` | Notifications | Your email |
| `email` | `SMTP_PASSWORD` | Notifications | App password |
| `email` | `FROM_EMAIL` | Notifications | Sender email |

---

# 8️⃣ ADMIN USER SETUP

## First-Time Setup

1. Deploy Admin Portal to Vercel
2. Go to your deployed Admin URL
3. Login with:
   - Email: `vighneshbhat14@gmail.com`
   - Password: `Viggubhat@1234`
4. On first login, the user will be created automatically

**Note:** If signup is disabled in Supabase, enable it temporarily:
1. Go to: https://supabase.com/dashboard/project/rokptxcawrmhqcmrsjca/auth/providers
2. Enable Email provider
3. Disable email confirmations for testing

---

# 📊 Summary Table

## All API URLs

| Service | API URL |
|---------|---------|
| **GitHub Service** | `https://12dbzw94lh.execute-api.us-east-1.amazonaws.com/Prod` |
| **Skill Gap Service** | `https://tku29qrthd.execute-api.us-east-1.amazonaws.com/Prod` |
| **Trend Skill Service** | `https://mi9j34716l.execute-api.us-east-1.amazonaws.com/Prod` |

## All GitHub Repositories

| Service | Repository |
|---------|------------|
| Admin Portal | https://github.com/VighneshMBhat/rns-job-analyzer-admin-services |
| Skill Gap Service | https://github.com/VighneshMBhat/rns-job-analyzer-skillgap-services |
| Trend Skill Service | https://github.com/VighneshMBhat/rns-job-analyzer-trend-skill-service |

---

# 🔐 Security Notes

1. **Never commit** `.env.local` or any file with real API keys
2. **Use environment variables** in Vercel and AWS Lambda
3. **Rotate keys** periodically using the Admin Portal
4. **Service Role Key** should only be used server-side, never expose in frontend

---

# ✅ Quick Setup Checklist

## Vercel (Frontend)
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `NEXT_PUBLIC_GITHUB_SERVICE_URL`
- [ ] Add `NEXT_PUBLIC_SKILLGAP_SERVICE_URL`

## Vercel (Admin Portal)
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Add `NEXT_PUBLIC_ADMIN_EMAIL`

## AWS Lambda (Each Service)
- [ ] Add Supabase credentials
- [ ] Add service-specific API keys

## AWS EventBridge
- [ ] Create trend-skill-weekly-collection
- [ ] Create github-skill-weekly-sync
- [ ] Create skillgap-weekly-analysis

## Admin Portal
- [ ] Login and add all API keys to the database

---

**Last Updated:** 2026-02-05
