import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforjosephinehotel';

async function verifyAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return false;

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
        return decoded.role === 'admin';
    } catch {
        return false;
    }
}

export async function GET() {
    try {
        const items = await prisma.amenity.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch amenities' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await req.json();
        const amenity = await prisma.amenity.create({
            data: {
                iconName: data.iconName,
                title: data.title,
                description: data.description,
                image: data.image || '',
                isActive: data.isActive ?? true,
                order: parseInt(data.order) || 0,
            }
        });
        return NextResponse.json(amenity);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create amenity' }, { status: 500 });
    }
}
