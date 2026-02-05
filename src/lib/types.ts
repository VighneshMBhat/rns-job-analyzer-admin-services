export interface ApiKey {
    id: string;
    service_name: string;
    key_name: string;
    key_value: string;
    description: string | null;
    is_active: boolean;
    last_updated_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface ServiceGroup {
    name: string;
    displayName: string;
    description: string;
    keys: ApiKey[];
}

// Only API keys that have rate limits/quotas (need Admin Portal management)
export const SERVICE_DISPLAY_NAMES: Record<string, { name: string; description: string }> = {
    gemini: {
        name: 'Google Gemini AI',
        description: 'AI model for skill gap analysis'
    },
    serp: {
        name: 'SERP API',
        description: 'Google Jobs data fetching'
    },
    groq: {
        name: 'Groq Cloud',
        description: 'GitHub skill extraction'
    },
    apify: {
        name: 'Apify',
        description: 'Reddit scraping for discussions'
    }
};

// Note: The following credentials are permanent and managed via Lambda env vars only:
// - GitHub OAuth (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
// - AWS S3 (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
// - Email/SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, FROM_EMAIL)
