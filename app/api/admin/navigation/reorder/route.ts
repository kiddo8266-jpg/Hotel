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

export async function POST(request: Request) {
    try {
        if (!await verifyAuth()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { items } = await request.json();

        // Perform batch update inside a transaction to ensure all or nothing
        await prisma.$transaction(
            items.map((item: { id: string, order: number }) =>
                prisma.navigationLink.update({
                    where: { id: item.id },
                    data: { order: item.order }
                })
            )
        );

        return NextResponse.json({ message: 'Reordered successfully' });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to reorder items' }, { status: 500 });
    }
}
