import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items } = body as { items: { id: string; order: number }[] };

        if (!Array.isArray(items)) {
            return NextResponse.json({ error: 'items must be an array' }, { status: 400 });
        }

        // Update all items' order in a transaction
        await prisma.$transaction(
            items.map((item) =>
                prisma.heroContent.update({
                    where: { id: item.id },
                    data: { order: item.order },
                })
            )
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error reordering hero content:', error);
        return NextResponse.json({ error: 'Failed to reorder hero content' }, { status: 500 });
    }
}
