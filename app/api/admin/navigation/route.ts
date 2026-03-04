import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

async function verifyAuth() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token')?.value;
        if (!token) return false;
        jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-for-dev');
        return true;
    } catch {
        return false;
    }
}

export async function GET() {
    try {
        const links = await prisma.navigationLink.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(links || []);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!await verifyAuth()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();

        // Auto-assign order to put it at the end
        const count = await prisma.navigationLink.count();

        const link = await prisma.navigationLink.create({
            data: {
                label: data.label,
                href: data.href,
                isHeader: data.isHeader !== undefined ? data.isHeader : true,
                isActive: data.isActive !== undefined ? data.isActive : true,
                order: data.order !== undefined ? data.order : count,
            },
        });
        return NextResponse.json(link);
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
    }
}
