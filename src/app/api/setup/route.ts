import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// This endpoint creates the admin user on first access
// Called only once to set up the admin account
export async function POST() {
    try {
        const supabase = createServerClient();
        const adminEmail = process.env.ADMIN_EMAIL || 'vighneshbhat14@gmail.com';

        // Check if admin already exists
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const adminExists = existingUsers?.users?.some(u => u.email === adminEmail);

        if (adminExists) {
            return NextResponse.json({ message: 'Admin user already exists' });
        }

        // Create admin user
        const { data, error } = await supabase.auth.admin.createUser({
            email: adminEmail,
            password: 'Viggubhat@1234',
            email_confirm: true
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Add to admin_users table
        if (data.user) {
            await supabase.from('admin_users').insert({
                id: data.user.id,
                email: adminEmail,
                is_active: true
            });
        }

        return NextResponse.json({
            message: 'Admin user created successfully',
            email: adminEmail
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
    }
}
