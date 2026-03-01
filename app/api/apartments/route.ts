// app/api/apartments/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const apartments = await prisma.apartment.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10, // limit to recent ones
        });
        return NextResponse.json(apartments);
    } catch (error) {
        console.error('Public apartments API error:', error);
        return NextResponse.json(
            { error: 'Failed to load apartments' },
            { status: 500 }
        );
    }
}