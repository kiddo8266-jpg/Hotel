import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, subtitle, mediaUrl, mediaType, order, isActive } = body;

        const updatedHero = await prisma.heroContent.update({
            where: { id },
            data: {
                title,
                subtitle,
                mediaUrl,
                mediaType,
                order: Number(order) || 0,
                isActive,
            },
        });

        return NextResponse.json(updatedHero);
    } catch (error) {
        console.error('Error updating hero content:', error);
        return NextResponse.json({ error: 'Failed to update hero content' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.heroContent.delete({
            where: { id },
        });
        return NextResponse.json({ message: 'Hero content deleted' });
    } catch (error) {
        console.error('Error deleting hero content:', error);
        return NextResponse.json({ error: 'Failed to delete hero content' }, { status: 500 });
    }
}
