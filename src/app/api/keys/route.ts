import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// GET - Fetch all API keys
export async function GET() {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('admin_api_keys')
            .select('*')
            .order('service_name', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ keys: data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch keys' }, { status: 500 });
    }
}

// PUT - Update an API key
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, key_value, is_active } = body;

        if (!id) {
            return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
        }

        const supabase = createServerClient();

        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
            last_updated_by: 'admin'
        };

        if (key_value !== undefined) {
            updateData.key_value = key_value;
        }

        if (is_active !== undefined) {
            updateData.is_active = is_active;
        }

        const { data, error } = await supabase
            .from('admin_api_keys')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ key: data, message: 'Key updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update key' }, { status: 500 });
    }
}

// POST - Add a new API key
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { service_name, key_name, key_value, description } = body;

        if (!service_name || !key_name) {
            return NextResponse.json({ error: 'Service name and key name are required' }, { status: 400 });
        }

        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('admin_api_keys')
            .insert({
                service_name,
                key_name,
                key_value: key_value || '',
                description,
                last_updated_by: 'admin'
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ key: data, message: 'Key created successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create key' }, { status: 500 });
    }
}

// DELETE - Delete an API key
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
        }

        const supabase = createServerClient();

        const { error } = await supabase
            .from('admin_api_keys')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Key deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete key' }, { status: 500 });
    }
}
