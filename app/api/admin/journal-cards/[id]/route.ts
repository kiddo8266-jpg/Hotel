// app/api/admin/journal-cards/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await req.json();
        const { id } = await params;
        const { tag, title, description, image, buttonLabel, subject, order, isActive } = body;

        const card = await prisma.journalMarketingCard.update({
            where: { id },
            data: {
                tag: tag ?? '',
                title,
                description,
                image: image ?? '',
                buttonLabel: buttonLabel ?? 'Send Enquiry',
                subject: subject ?? 'New Enquiry from Journal Page',
                order: order ?? 0,
                isActive: isActive ?? true,
            },
        });
        return NextResponse.json(card);
    } catch (error) {
        console.error('[JOURNAL_CARDS_PUT]', error);
        return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.journalMarketingCard.delete({ where: { id } });
        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[JOURNAL_CARDS_DELETE]', error);
        return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
    }
}
