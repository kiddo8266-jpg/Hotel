// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Count apartments
    const apartmentsCount = await prisma.apartment.count();

    // Count blog posts (assuming you have BlogPost model in schema)
    const blogPostsCount = await prisma.blogPost.count();

    // Count media items (assuming you have Media model in schema)
    const mediaCount = await prisma.media.count();

    // Count users (total registered users)
    const usersCount = await prisma.user.count();

    return NextResponse.json({
      apartments: apartmentsCount,
      blogPosts: blogPostsCount,
      mediaItems: mediaCount,
      users: usersCount,
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}