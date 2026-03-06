// app/api/admin/journal-cards/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const cards = await prisma.journalMarketingCard.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(cards);
    } catch (error) {
        console.error('[JOURNAL_CARDS_GET]', error);
        return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { tag, title, description, image, buttonLabel, subject, order, isActive } = body;

        if (!title || !description) {
            return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
        }

        const card = await prisma.journalMarketingCard.create({
            data: {
                tag: tag || '',
                title,
                description,
                image: image || '',
                buttonLabel: buttonLabel || 'Send Enquiry',
                subject: subject || 'New Enquiry from Journal Page',
                order: order ?? 0,
                isActive: isActive ?? true,
            },
        });
        return NextResponse.json(card, { status: 201 });
    } catch (error) {
        console.error('[JOURNAL_CARDS_POST]', error);
        return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
    }
}
