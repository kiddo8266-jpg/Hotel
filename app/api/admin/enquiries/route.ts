import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const enquiries = await prisma.enquiry.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(enquiries);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.enquiry.delete({ where: { id } });
        return NextResponse.json({ message: 'Enquiry deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const { id, isRead } = await req.json();
        const updated = await prisma.enquiry.update({
            where: { id },
            data: { isRead }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 });
    }
}
