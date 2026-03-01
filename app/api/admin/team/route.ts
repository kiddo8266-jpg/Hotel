import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const team = await prisma.team.findMany({
            orderBy: { order: 'asc' }
        });
        return NextResponse.json(team);
    } catch (error) {
        console.error('Error fetching team:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        const member = await prisma.team.create({
            data: {
                name: data.name,
                role: data.role,
                bio: data.bio || null,
                image: data.image || null,
                order: data.order || 0,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error creating team member:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const data = await request.json();
        const { id, ...updateData } = data;

        if (!id) {
            return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
        }

        const member = await prisma.team.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(member);
    } catch (error) {
        console.error('Error updating team member:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
        }

        await prisma.team.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting team member:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
