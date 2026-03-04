import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await req.json();
        const resolvedParams = await params;
        const apartment = await prisma.apartment.update({
            where: { id: resolvedParams.id },
            data: {
                title: body.title,
                description: body.description,
                price: Number(body.price),
                priceDuration: body.priceDuration || "per month",
                image: body.image,
                type: body.type,
                bedrooms: Number(body.bedrooms),
                bathrooms: Number(body.bathrooms),
                size: Number(body.size),
                features: body.features,
                amenities: body.amenities ? {
                    set: body.amenities.map((id: string) => ({ id }))
                } : undefined,
            },
        });
        return NextResponse.json(apartment);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        await prisma.apartment.delete({
            where: { id: resolvedParams.id },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
