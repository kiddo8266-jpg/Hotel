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

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await req.json();
        const updated = await prisma.amenity.update({
            where: { id: params.id },
            data: {
                iconName: data.iconName !== undefined ? data.iconName : undefined,
                title: data.title !== undefined ? data.title : undefined,
                description: data.description !== undefined ? data.description : undefined,
                image: data.image !== undefined ? data.image : undefined,
                isActive: data.isActive !== undefined ? data.isActive : undefined,
                order: data.order !== undefined ? parseInt(data.order) : undefined,
            } as any
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update amenity' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    if (!(await verifyAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.amenity.delete({
            where: { id: params.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete amenity' }, { status: 500 });
    }
}
