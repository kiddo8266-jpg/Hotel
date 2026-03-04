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

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!await verifyAuth()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await request.json();
        const { id } = await params;

        const link = await prisma.navigationLink.update({
            where: { id },
            data: {
                label: data.label,
                href: data.href,
                isHeader: data.isHeader,
                isActive: data.isActive,
                order: data.order,
            },
        });

        return NextResponse.json(link);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!await verifyAuth()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        await prisma.navigationLink.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
    }
}
