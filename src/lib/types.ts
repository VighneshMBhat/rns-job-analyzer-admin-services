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
    github: {
        name: 'GitHub OAuth',
        description: 'GitHub authentication'
    },
    apify: {
        name: 'Apify',
        description: 'Reddit scraping for discussions'
    },
    aws: {
        name: 'AWS',
        description: 'S3 storage for reports'
    },
    email: {
        name: 'Email/SMTP',
        description: 'Notification emails'
    }
};
