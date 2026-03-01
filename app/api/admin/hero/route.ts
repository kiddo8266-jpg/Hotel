import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const heroContent = await prisma.heroContent.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(heroContent);
    } catch (error) {
        console.error('Error fetching hero content:', error);
        return NextResponse.json({ error: 'Failed to fetch hero content' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, subtitle, mediaUrl, mediaType, order } = body;

        const newHero = await prisma.heroContent.create({
            data: {
                title,
                subtitle,
                mediaUrl,
                mediaType,
                order: Number(order) || 0,
            },
        });

        return NextResponse.json(newHero, { status: 201 });
    } catch (error) {
        console.error('Error creating hero content:', error);
        return NextResponse.json({ error: 'Failed to create hero content' }, { status: 500 });
    }
}
