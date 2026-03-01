import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const apartments = await prisma.apartment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(apartments);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch apartments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apartment = await prisma.apartment.create({
      data: {
        title: body.title,
        description: body.description,
        price: Number(body.price),
        image: body.image || '',
        type: body.type,
        bedrooms: Number(body.bedrooms),
        bathrooms: Number(body.bathrooms),
        size: Number(body.size),
        features: body.features,
      },
    });
    return NextResponse.json(apartment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create apartment' }, { status: 500 });
  }
}