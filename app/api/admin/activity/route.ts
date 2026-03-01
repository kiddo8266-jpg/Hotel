// app/api/admin/activity/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [apartments, blogPosts, mediaItems] = await Promise.all([
      prisma.apartment.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, createdAt: true },
      }),
      prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
      prisma.media.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, alt: true, type: true, createdAt: true },
      }),
    ]);

    type ActivityItem = {
      id: string;
      label: string;
      type: 'apartment' | 'blog' | 'media';
      createdAt: string;
    };

    const activity: ActivityItem[] = [
      ...apartments.map((a) => ({
        id: a.id,
        label: a.name,
        type: 'apartment' as const,
        createdAt: a.createdAt.toISOString(),
      })),
      ...blogPosts.map((b) => ({
        id: b.id,
        label: b.title,
        type: 'blog' as const,
        createdAt: b.createdAt.toISOString(),
      })),
      ...mediaItems.map((m) => ({
        id: m.id,
        label: m.alt || `${m.type} item`,
        type: 'media' as const,
        createdAt: m.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Activity API error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
